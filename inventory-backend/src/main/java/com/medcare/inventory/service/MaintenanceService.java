package com.medcare.inventory.service;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.*;
import com.medcare.inventory.repository.AssignmentRepository;
import com.medcare.inventory.repository.EquipmentRepository;
import com.medcare.inventory.repository.MaintenanceRepository;
import com.medcare.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.EnumSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class MaintenanceService {

    /** Equipment in these states cannot be serviced any more. */
    private static final Set<EquipmentStatus> NOT_SERVICEABLE =
            EnumSet.of(EquipmentStatus.RETIRED, EquipmentStatus.DISPOSED, EquipmentStatus.LOST);

    /** Statuses a manager may set when finishing a job. */
    private static final Set<EquipmentStatus> STATUS_AFTER_WORK =
            EnumSet.of(EquipmentStatus.AVAILABLE, EquipmentStatus.IN_USE, EquipmentStatus.DAMAGED, EquipmentStatus.RETIRED);

    private final MaintenanceRepository records;
    private final EquipmentRepository equipment;
    private final UserRepository users;
    private final AssignmentRepository assignments;

    // ------------------------------------------------------------ reads

    /** equipmentId == null returns the latest 500 jobs of all equipment. */
    public List<MaintenanceResponse> list(String equipmentId) {
        List<MaintenanceRecord> result = blank(equipmentId)
                ? records.findTop500ByOrderByIdDesc()
                : records.findTop500ByEquipment_EquipmentIdIgnoreCaseOrderByIdDesc(equipmentId.trim());
        return result.stream().map(MaintenanceResponse::from).toList();
    }

    public MaintenanceResponse get(String recordNo) {
        return MaintenanceResponse.from(find(recordNo));
    }

    public MaintenanceSummaryResponse summary() {
        LocalDate today = LocalDate.now();
        LocalDate monthStart = today.withDayOfMonth(1);
        BigDecimal cost = records.sumCost(MaintenanceStatus.COMPLETED, monthStart, today);
        return new MaintenanceSummaryResponse(
                records.countByStatus(MaintenanceStatus.SCHEDULED),
                records.countByStatus(MaintenanceStatus.IN_PROGRESS),
                records.countByStatusAndScheduledDateBefore(MaintenanceStatus.SCHEDULED, today),
                records.countByStatusAndScheduledDateBetween(MaintenanceStatus.SCHEDULED, today, today.plusDays(7)),
                records.countByTypeAndStatusIn(MaintenanceType.CORRECTIVE,
                        List.of(MaintenanceStatus.SCHEDULED, MaintenanceStatus.IN_PROGRESS)),
                records.countByStatusAndCompletedDateBetween(MaintenanceStatus.COMPLETED, monthStart, today),
                cost == null ? BigDecimal.ZERO : cost);
    }

    // ------------------------------------------------------------ create / edit

    @Transactional
    public MaintenanceResponse create(MaintenanceRequest r, String actorEmail) {
        if (blank(r.equipmentId())) throw bad("Select the equipment.");
        if (blank(r.type())) throw bad("Select the maintenance type.");
        if (blank(r.description())) throw bad("Describe the work to be done.");
        if (blank(r.scheduledDate())) throw bad("Scheduled date is required.");

        Equipment e = findEquipment(r.equipmentId());
        ensureServiceable(e);

        MaintenanceRecord m = new MaintenanceRecord();
        m.setEquipment(e);
        m.setType(parse(MaintenanceType.class, r.type(), "maintenance type"));
        m.setPriority(blank(r.priority()) ? MaintenancePriority.MEDIUM
                : parse(MaintenancePriority.class, r.priority(), "priority"));
        m.setDescription(r.description().trim());
        m.setScheduledDate(date("Scheduled date", r.scheduledDate()));
        m.setAssignedTo(clean(r.assignedTo()));
        m.setStatus(MaintenanceStatus.SCHEDULED);
        m.setRequestedBy(actorName(actorEmail));
        m = records.save(m);
        m.setRecordNo(String.format("MNT-%04d", m.getId()));   // saved when the transaction commits

        if (m.getType() != MaintenanceType.CORRECTIVE) syncNextDate(e, m.getScheduledDate());
        return MaintenanceResponse.from(m);
    }

    /** Fault report from any user: becomes a CORRECTIVE job due today. The equipment status is not changed yet. */
    @Transactional
    public MaintenanceResponse createRepairRequest(RepairRequest r, String actorEmail) {
        Equipment e = findEquipment(r.equipmentId());
        ensureServiceable(e);

        MaintenanceRecord m = new MaintenanceRecord();
        m.setEquipment(e);
        m.setType(MaintenanceType.CORRECTIVE);
        m.setPriority(blank(r.priority()) ? MaintenancePriority.MEDIUM
                : parse(MaintenancePriority.class, r.priority(), "priority"));
        m.setDescription(r.description().trim());
        m.setScheduledDate(LocalDate.now());
        m.setStatus(MaintenanceStatus.SCHEDULED);
        m.setRequestedBy(actorName(actorEmail));
        m = records.save(m);
        m.setRecordNo(String.format("MNT-%04d", m.getId()));
        return MaintenanceResponse.from(m);
    }

    @Transactional
    public MaintenanceResponse update(String recordNo, MaintenanceRequest r) {
        MaintenanceRecord m = lockRecord(recordNo);
        if (m.getStatus() != MaintenanceStatus.SCHEDULED)
            throw conflict("Only scheduled work can be edited.");

        if (!blank(r.type())) m.setType(parse(MaintenanceType.class, r.type(), "maintenance type"));
        if (!blank(r.priority())) m.setPriority(parse(MaintenancePriority.class, r.priority(), "priority"));
        if (r.description() != null) {
            if (r.description().isBlank()) throw bad("Description cannot be empty.");
            m.setDescription(r.description().trim());
        }
        if (r.scheduledDate() != null) {
            if (r.scheduledDate().isBlank()) throw bad("Scheduled date cannot be empty.");
            m.setScheduledDate(date("Scheduled date", r.scheduledDate()));
        }
        if (r.assignedTo() != null) m.setAssignedTo(clean(r.assignedTo()));

        if (m.getType() != MaintenanceType.CORRECTIVE) syncNextDate(m.getEquipment(), m.getScheduledDate());
        return MaintenanceResponse.from(m);
    }

    // ------------------------------------------------------------ workflow

    /** SCHEDULED -> IN_PROGRESS. The equipment becomes UNDER_MAINTENANCE. */
    @Transactional
    public MaintenanceResponse start(String recordNo) {
        MaintenanceRecord m = lockRecord(recordNo);
        if (m.getStatus() != MaintenanceStatus.SCHEDULED)
            throw conflict("Only scheduled work can be started.");

        Equipment e = lockEquipment(m);
        ensureServiceable(e);
        if (records.existsByEquipment_IdAndStatus(e.getId(), MaintenanceStatus.IN_PROGRESS))
            throw conflict("This equipment already has maintenance in progress. Complete or cancel it first.");

        m.setPreviousEquipmentStatus(e.getStatus());
        e.setStatus(EquipmentStatus.UNDER_MAINTENANCE);
        m.setStatus(MaintenanceStatus.IN_PROGRESS);
        m.setStartedDate(LocalDate.now());
        return MaintenanceResponse.from(m);
    }

    /** SCHEDULED or IN_PROGRESS -> COMPLETED. Updates last/next maintenance, condition and status of the equipment. */
    @Transactional
    public MaintenanceResponse complete(String recordNo, MaintenanceCompleteRequest r) {
        MaintenanceRecord m = lockRecord(recordNo);
        if (m.getStatus() != MaintenanceStatus.SCHEDULED && m.getStatus() != MaintenanceStatus.IN_PROGRESS)
            throw conflict("Only scheduled or in-progress work can be completed.");

        LocalDate today = LocalDate.now();
        LocalDate done = blank(r.completedDate()) ? today : date("Completion date", r.completedDate());
        if (done.isAfter(today)) throw bad("Completion date cannot be in the future.");
        if (m.getStartedDate() != null && done.isBefore(m.getStartedDate()))
            throw bad("Completion date cannot be before the start date.");

        LocalDate next = blank(r.nextMaintenanceDate()) ? null : date("Next maintenance date", r.nextMaintenanceDate());
        if (next != null && !next.isAfter(done)) throw bad("Next maintenance date must be after the completion date.");

        EquipmentCondition condition = blank(r.condition()) ? null
                : parse(EquipmentCondition.class, r.condition(), "condition");
        EquipmentStatus statusAfter = blank(r.equipmentStatus()) ? null
                : parse(EquipmentStatus.class, r.equipmentStatus(), "equipment status");
        if (statusAfter != null && !STATUS_AFTER_WORK.contains(statusAfter))
            throw bad("Equipment status after work must be Available, In use, Damaged or Retired.");

        Equipment e = lockEquipment(m);
        LocalDate newLast = e.getLastMaintenance() == null || done.isAfter(e.getLastMaintenance())
                ? done : e.getLastMaintenance();
        if (next != null && next.isBefore(newLast))
            throw bad("Next maintenance date cannot be before the last maintenance date (" + newLast + ").");

        boolean wasRunning = m.getStatus() == MaintenanceStatus.IN_PROGRESS;
        m.setStatus(MaintenanceStatus.COMPLETED);
        m.setCompletedDate(done);
        m.setCost(r.cost());
        m.setNotes(clean(r.notes()));

        e.setLastMaintenance(newLast);
        if (next != null) {
            e.setNextMaintenance(next);
        } else if (m.getType() != MaintenanceType.CORRECTIVE
                && e.getNextMaintenance() != null && !e.getNextMaintenance().isAfter(done)) {
            e.setNextMaintenance(null);   // the planned date has been served; avoids a false "overdue"
        }
        if (wasRunning) restoreEquipment(e, m);
        if (condition != null) e.setCondition(condition);
        if (statusAfter != null) e.setStatus(statusAfter);
        return MaintenanceResponse.from(m);
    }

    /** SCHEDULED or IN_PROGRESS -> CANCELLED. A running job gives the equipment its old status back. */
    @Transactional
    public MaintenanceResponse cancel(String recordNo) {
        MaintenanceRecord m = lockRecord(recordNo);
        if (m.getStatus() != MaintenanceStatus.SCHEDULED && m.getStatus() != MaintenanceStatus.IN_PROGRESS)
            throw conflict("Only scheduled or in-progress work can be cancelled.");

        if (m.getStatus() == MaintenanceStatus.IN_PROGRESS) restoreEquipment(lockEquipment(m), m);
        m.setStatus(MaintenanceStatus.CANCELLED);
        return MaintenanceResponse.from(m);
    }

    // ------------------------------------------------------------ helpers

    /** Gives the equipment its pre-job status back, unless someone has already changed it by hand. */
    private void restoreEquipment(Equipment e, MaintenanceRecord m) {
        if (e.getStatus() != EquipmentStatus.UNDER_MAINTENANCE) return;
        // it only goes back to IN_USE if someone still holds it (the assignment may have been returned meanwhile)
        boolean stillAssigned = assignments.existsByEquipment_IdAndStatus(e.getId(), AssignmentStatus.ACTIVE);
        e.setStatus(m.getPreviousEquipmentStatus() == EquipmentStatus.IN_USE && stillAssigned
                ? EquipmentStatus.IN_USE : EquipmentStatus.AVAILABLE);
    }

    /** Keeps the equipment's "next maintenance" in step with planned work (earliest planned date wins). */
    private void syncNextDate(Equipment e, LocalDate planned) {
        boolean notBeforeLast = e.getLastMaintenance() == null || !planned.isBefore(e.getLastMaintenance());
        if (notBeforeLast && (e.getNextMaintenance() == null || planned.isBefore(e.getNextMaintenance())))
            e.setNextMaintenance(planned);
    }

    private void ensureServiceable(Equipment e) {
        if (NOT_SERVICEABLE.contains(e.getStatus()))
            throw conflict(e.getEquipmentId() + " is " + e.getStatus().name().toLowerCase()
                    + " and cannot be serviced.");
    }

    private MaintenanceRecord find(String recordNo) {
        return records.findByRecordNoIgnoreCase(recordNo)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Maintenance " + recordNo + " not found."));
    }

    private MaintenanceRecord lockRecord(String recordNo) {
        return records.findForUpdate(recordNo)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Maintenance " + recordNo + " not found."));
    }

    private Equipment findEquipment(String equipmentId) {
        return equipment.findByEquipmentIdIgnoreCase(equipmentId.trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipment " + equipmentId + " not found."));
    }

    private Equipment lockEquipment(MaintenanceRecord m) {
        return equipment.lockById(m.getEquipment().getId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipment not found."));
    }

    private String actorName(String email) {
        return users.findByEmailIgnoreCase(email).map(User::getFullName).orElse(email);
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
}