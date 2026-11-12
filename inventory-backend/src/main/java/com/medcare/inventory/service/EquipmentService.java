package com.medcare.inventory.service;

import com.medcare.inventory.dto.EquipmentRequest;
import com.medcare.inventory.dto.EquipmentResponse;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.Category;
import com.medcare.inventory.model.Equipment;
import com.medcare.inventory.model.EquipmentCondition;
import com.medcare.inventory.model.EquipmentStatus;
import com.medcare.inventory.repository.AssignmentRepository;
import com.medcare.inventory.repository.CategoryRepository;
import com.medcare.inventory.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.medcare.inventory.repository.MaintenanceRepository;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipmentService {

    private final EquipmentRepository repo;
    private final CategoryRepository categories;
    private final MaintenanceRepository maintenance;
    private final AssignmentRepository assignments;

    public List<EquipmentResponse> list() {
        return repo.findAllByOrderByIdAsc().stream().map(EquipmentResponse::from).toList();
    }

    public EquipmentResponse get(String equipmentId) {
        return EquipmentResponse.from(find(equipmentId));
    }

    @Transactional
    public EquipmentResponse create(EquipmentRequest r) {
        if (r.name() == null || r.name().isBlank()) throw bad("Equipment name is required.");
        if (r.category() == null || r.category().isBlank()) throw bad("Category is required.");

        Equipment e = new Equipment();
        apply(e, r);
        e = repo.save(e);
        e.setEquipmentId(String.format("EQ-%04d", e.getId()));   // saved when the transaction commits
        return EquipmentResponse.from(e);
    }

    @Transactional
    public EquipmentResponse update(String equipmentId, EquipmentRequest r) {
        Equipment e = find(equipmentId);
        apply(e, r);
        return EquipmentResponse.from(e);
    }

    @Transactional
    public void delete(String equipmentId) {
        Equipment e = find(equipmentId);

        if (assignments.existsByEquipment_Id(e.getId()))
            throw new ApiException(HttpStatus.CONFLICT,
                    "This equipment has assignment history and cannot be deleted. Retire it instead.");
        if (e.getStatus() == EquipmentStatus.IN_USE)
            throw new ApiException(HttpStatus.CONFLICT, "This equipment is in use. Change its status or retire it first.");
        repo.delete(e);
    }

    // ---------------------------------------------------------------- helpers

    private void apply(Equipment e, EquipmentRequest r) {
        if (r.name() != null) {
            if (r.name().isBlank()) throw bad("Equipment name cannot be empty.");
            e.setName(r.name().trim());
        }
        if (r.category() != null) {
            Category c = categories.findByNameIgnoreCase(r.category().trim())
                    .orElseThrow(() -> bad("Invalid category: " + r.category()));
            if (!c.isActive() && !c.getName().equals(e.getCategory()))
                throw bad("Category \"" + c.getName() + "\" is inactive. Choose an active category.");
            e.setCategory(c.getName());
        }
        if (r.serialNumber() != null) {
            String serial = clean(r.serialNumber());
            if (serial != null && repo.existsBySerialNumberIgnoreCaseAndIdNot(serial, e.getId() == null ? -1L : e.getId()))
                throw new ApiException(HttpStatus.CONFLICT, "Serial number " + serial + " already exists.");
            e.setSerialNumber(serial);
        }
        if (r.modelNumber() != null) e.setModelNumber(clean(r.modelNumber()));
        if (r.manufacturer() != null) e.setManufacturer(clean(r.manufacturer()));
        if (r.location() != null) e.setLocation(clean(r.location()));
        if (r.assignedTo() != null) e.setAssignedTo(clean(r.assignedTo()));
        if (r.purchasePrice() != null) e.setPurchasePrice(r.purchasePrice());

        if (r.purchaseDate() != null) e.setPurchaseDate(date("Purchase date", r.purchaseDate()));
        if (r.warrantyUntil() != null) e.setWarrantyUntil(date("Warranty until", r.warrantyUntil()));
        if (r.lastMaintenance() != null) e.setLastMaintenance(date("Last maintenance", r.lastMaintenance()));
        if (r.nextMaintenance() != null) e.setNextMaintenance(date("Next maintenance", r.nextMaintenance()));

        if (r.status() != null) {
            try { e.setStatus(EquipmentStatus.valueOf(r.status().trim().toUpperCase())); }
            catch (IllegalArgumentException ex) { throw bad("Invalid status: " + r.status()); }
        }
        if (r.condition() != null) {
            try { e.setCondition(EquipmentCondition.valueOf(r.condition().trim().toUpperCase())); }
            catch (IllegalArgumentException ex) { throw bad("Invalid condition: " + r.condition()); }
        }

        if (e.getPurchaseDate() != null && e.getWarrantyUntil() != null
                && e.getWarrantyUntil().isBefore(e.getPurchaseDate()))
            throw bad("Warranty end date cannot be before the purchase date.");
        if (e.getLastMaintenance() != null && e.getNextMaintenance() != null
                && e.getNextMaintenance().isBefore(e.getLastMaintenance()))
            throw bad("Next maintenance cannot be before the last maintenance date.");
    }

    private Equipment find(String equipmentId) {
        return repo.findByEquipmentIdIgnoreCase(equipmentId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Equipment " + equipmentId + " not found."));
    }

    private static String clean(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }

    private static LocalDate date(String field, String v) {
        if (v == null || v.isBlank()) return null;
        try {
            return LocalDate.parse(v.trim());
        } catch (DateTimeParseException ex) {
            throw bad(field + " must be a valid date (yyyy-MM-dd).");
        }
    }

    private static ApiException bad(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}