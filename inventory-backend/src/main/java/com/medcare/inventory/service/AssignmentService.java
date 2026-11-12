package com.medcare.inventory.service;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.*;
import com.medcare.inventory.repository.AssignmentRepository;
import com.medcare.inventory.repository.EquipmentRepository;
import com.medcare.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    /** Statuses a manager may set when taking equipment back. */
    private static final Set<EquipmentStatus> STATUS_AFTER_RETURN =
            EnumSet.of(EquipmentStatus.AVAILABLE, EquipmentStatus.DAMAGED);

    private final AssignmentRepository assignments;
    private final EquipmentRepository equipment;
    private final UserRepository users;

    // ------------------------------------------------------------ reads

    /** equipmentId == null returns the latest 500 assignments of all equipment. */
    public List<AssignmentResponse> list(String equipmentId) {
        List<EquipmentAssignment> result = blank(equipmentId)
                ? assignments.findTop500ByOrderByIdDesc()
                : assignments.findTop500ByEquipment_EquipmentIdIgnoreCaseOrderByIdDesc(equipmentId.trim());
        return result.stream().map(AssignmentResponse::from).toList();
    }

    public AssignmentResponse get(String assignmentNo) {
        return AssignmentResponse.from(find(assignmentNo));
    }

    public AssignmentSummaryResponse summary() {
        LocalDate today = LocalDate.now();
        return new AssignmentSummaryResponse(
                assignments.countByStatus(AssignmentStatus.ACTIVE),
                assignments.countByStatusAndExpectedReturnDateBefore(AssignmentStatus.ACTIVE, today),
                assignments.countByStatusAndExpectedReturnDateBetween(AssignmentStatus.ACTIVE, today, today.plusDays(7)),
                assignments.countByStatusAndReturnedDateBetween(AssignmentStatus.RETURNED, today.withDayOfMonth(1), today),
                equipment.countByStatus(EquipmentStatus.AVAILABLE),
                assignments.activeByDepartment(AssignmentStatus.ACTIVE));
    }

    /** Active users that equipment can be assigned to. */
    public List<AssigneeResponse> assignees() {
        return users.findByStatusOrderByCreatedAtDesc(UserStatus.ACTIVE).stream()
                .sorted(Comparator.comparing(User::getFullName, String.CASE_INSENSITIVE_ORDER))
                .map(AssigneeResponse::from)
                .toList();
    }

    // ------------------------------------------------------------ workflow

    /** Hands an AVAILABLE item to a department or a staff member. The equipment becomes IN_USE. */
    @Transactional
    public AssignmentResponse create(AssignmentRequest r, String actorEmail) {
        if (blank(r.equipmentId())) throw bad("Select the equipment.");
        Target t = target(r);
        LocalDate assigned = assignedDate(r);
        LocalDate expected = expectedDate(r, assigned);

        Equipment e = equipment.findByEquipmentIdIgnoreCase(r.equipmentId().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipment " + r.equipmentId() + " not found."));
        e = lockEquipment(e.getId());
        if (e.getStatus() != EquipmentStatus.AVAILABLE)
            throw conflict(e.getEquipmentId() + " is " + pretty(e.getStatus())
                    + ". Only available equipment can be assigned.");
        if (assignments.existsByEquipment_IdAndStatus(e.getId(), AssignmentStatus.ACTIVE))
            throw conflict(e.getEquipmentId() + " already has an active assignment.");

        EquipmentAssignment a = open(e, t, assigned, expected, r, actorEmail);
        e.setStatus(EquipmentStatus.IN_USE);
        return AssignmentResponse.from(a);
    }

    /** ACTIVE -> RETURNED. The equipment is freed (AVAILABLE, or DAMAGED if reported so). */
    @Transactional
    public AssignmentResponse returnEquipment(String assignmentNo, AssignmentReturnRequest r, String actorEmail) {
        EquipmentAssignment a = lockAssignment(assignmentNo);
        if (a.getStatus() != AssignmentStatus.ACTIVE)
            throw conflict("Only active assignments can be returned.");

        LocalDate returned = blank(r.returnedDate()) ? LocalDate.now() : date("Return date", r.returnedDate());
        if (returned.isAfter(LocalDate.now())) throw bad("Return date cannot be in the future.");
        if (returned.isBefore(a.getAssignedDate())) throw bad("Return date cannot be before the assigned date.");

        EquipmentCondition condition = blank(r.condition()) ? null
                : parse(EquipmentCondition.class, r.condition(), "condition");
        EquipmentStatus statusAfter = blank(r.equipmentStatus()) ? null
                : parse(EquipmentStatus.class, r.equipmentStatus(), "equipment status");
        if (statusAfter != null && !STATUS_AFTER_RETURN.contains(statusAfter))
            throw bad("Equipment status after return must be Available or Damaged.");

        Equipment e = lockEquipment(a.getEquipment().getId());
        a.setStatus(AssignmentStatus.RETURNED);
        a.setReturnedDate(returned);
        a.setReturnCondition(condition);
        a.setReturnNotes(clean(r.notes()));
        a.setReturnedBy(actorName(actorEmail));

        e.setAssignedTo(null);
        if (condition != null) e.setCondition(condition);
        if (!blank(r.returnLocation())) e.setLocation(clean(r.returnLocation()));
        // if the item is under maintenance right now, leave its status to the maintenance job
        if (e.getStatus() == EquipmentStatus.IN_USE)
            e.setStatus(statusAfter != null ? statusAfter : EquipmentStatus.AVAILABLE);
        return AssignmentResponse.from(a);
    }

    /** ACTIVE -> TRANSFERRED, and a new ACTIVE assignment to the new department / person. */
    @Transactional
    public AssignmentResponse transfer(String assignmentNo, AssignmentRequest r, String actorEmail) {
        EquipmentAssignment old = lockAssignment(assignmentNo);
        if (old.getStatus() != AssignmentStatus.ACTIVE)
            throw conflict("Only active assignments can be transferred.");

        Target t = target(r);
        LocalDate when = assignedDate(r);
        if (when.isBefore(old.getAssignedDate())) throw bad("Transfer date cannot be before the current assignment started.");
        LocalDate expected = expectedDate(r, when);

        boolean sameStaff = old.getStaff() != null && t.staff != null && old.getStaff().getId().equals(t.staff.getId());
        boolean sameDept = old.getDepartment().equalsIgnoreCase(t.department);
        boolean sameLoc = String.valueOf(old.getLocation()).equalsIgnoreCase(String.valueOf(clean(r.location())));
        if (t.type == old.getAssigneeType() && sameDept && sameLoc
                && (t.type == AssigneeType.DEPARTMENT || sameStaff))
            throw bad("Nothing to transfer: the new assignee and location are the same as now.");

        Equipment e = lockEquipment(old.getEquipment().getId());
        if (e.getStatus() != EquipmentStatus.IN_USE)
            throw conflict(e.getEquipmentId() + " is " + pretty(e.getStatus()) + " and cannot be transferred right now.");

        old.setStatus(AssignmentStatus.TRANSFERRED);
        old.setReturnedDate(when);
        old.setReturnedBy(actorName(actorEmail));
        return AssignmentResponse.from(open(e, t, when, expected, r, actorEmail));
    }

    // ------------------------------------------------------------ helpers

    /** Creates the ACTIVE row and points the equipment's assignedTo / location at the new holder. */
    private EquipmentAssignment open(Equipment e, Target t, LocalDate assigned, LocalDate expected,
                                     AssignmentRequest r, String actorEmail) {
        EquipmentAssignment a = new EquipmentAssignment();
        a.setEquipment(e);
        a.setAssigneeType(t.type);
        a.setDepartment(t.department);
        a.setStaff(t.staff);
        a.setStaffName(t.staff == null ? null : t.staff.getFullName());
        a.setLocation(clean(r.location()));
        a.setStatus(AssignmentStatus.ACTIVE);
        a.setAssignedDate(assigned);
        a.setExpectedReturnDate(expected);
        a.setRemarks(clean(r.remarks()));
        a.setAssignedBy(actorName(actorEmail));
        a = assignments.save(a);
        a.setAssignmentNo(String.format("ASG-%04d", a.getId()));   // saved when the transaction commits

        String holder = t.staff == null ? t.department : t.staff.getFullName() + " (" + t.department + ")";
        e.setAssignedTo(holder.length() > 150 ? holder.substring(0, 150) : holder);
        e.setLocation(a.getLocation() != null ? a.getLocation() : t.department);
        return a;
    }

    /** Who receives the equipment, validated. */
    private Target target(AssignmentRequest r) {
        if (blank(r.assigneeType())) throw bad("Choose whether this goes to a department or a staff member.");
        AssigneeType type = parse(AssigneeType.class, r.assigneeType(), "assignee type");

        User staff = null;
        String department = clean(r.department());
        if (type == AssigneeType.STAFF) {
            if (r.staffId() == null) throw bad("Select the doctor / staff member.");
            staff = users.findById(r.staffId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Staff member not found."));
            if (staff.getStatus() != UserStatus.ACTIVE)
                throw conflict(staff.getFullName() + " does not have an active account.");
            if (department == null) department = staff.getDepartment();
        }
        if (department == null) throw bad("Enter the department.");
        return new Target(type, department, staff);
    }

    private LocalDate assignedDate(AssignmentRequest r) {
        LocalDate d = blank(r.assignedDate()) ? LocalDate.now() : date("Assigned date", r.assignedDate());
        if (d.isAfter(LocalDate.now())) throw bad("Assigned date cannot be in the future.");
        return d;
    }

    private LocalDate expectedDate(AssignmentRequest r, LocalDate assigned) {
        if (blank(r.expectedReturnDate())) return null;
        LocalDate d = date("Expected return date", r.expectedReturnDate());
        if (d.isBefore(assigned)) throw bad("Expected return date cannot be before the assigned date.");
        return d;
    }

    private EquipmentAssignment find(String no) {
        return assignments.findByAssignmentNoIgnoreCase(no)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment " + no + " not found."));
    }

    private EquipmentAssignment lockAssignment(String no) {
        return assignments.findForUpdate(no)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Assignment " + no + " not found."));
    }

    private Equipment lockEquipment(Long id) {
        return equipment.lockById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipment not found."));
    }

    private String actorName(String email) {
        return users.findByEmailIgnoreCase(email).map(User::getFullName).orElse(email);
    }

    private static String pretty(EquipmentStatus s) {
        return s.name().toLowerCase().replace('_', ' ');
    }

    private static <E extends Enum<E>> E parse(Class<E> type, String value, String field) {
        try {
            return Enum.valueOf(type, value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw bad("Invalid " + field + ": " + value);
        }
    }

    private static LocalDate date(String field, String v) {
        try {
            return LocalDate.parse(v.trim());
        } catch (DateTimeParseException ex) {
            throw bad(field + " must be a valid date (yyyy-MM-dd).");
        }
    }

    private static boolean blank(String v) {
        return v == null || v.isBlank();
    }

    private static String clean(String v) {
        return blank(v) ? null : v.trim();
    }

    private static ApiException bad(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }

    private static ApiException conflict(String message) {
        return new ApiException(HttpStatus.CONFLICT, message);
    }

    private record Target(AssigneeType type, String department, User staff) {}
}