package com.medcare.inventory.dto;

import com.medcare.inventory.model.MaintenancePriority;
import com.medcare.inventory.model.MaintenanceRecord;
import com.medcare.inventory.model.MaintenanceStatus;
import com.medcare.inventory.model.MaintenanceType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record MaintenanceResponse(
        String id,
        String equipmentId,
        String equipmentName,
        String equipmentLocation,
        MaintenanceType type,
        MaintenancePriority priority,
        MaintenanceStatus status,
        String description,
        LocalDate scheduledDate,
        LocalDate startedDate,
        LocalDate completedDate,
        String assignedTo,
        BigDecimal cost,
        String notes,
        String requestedBy,
        boolean overdue,
        LocalDateTime createdAt
) {
    public static MaintenanceResponse from(MaintenanceRecord m) {
        boolean overdue = m.getStatus() == MaintenanceStatus.SCHEDULED
                && m.getScheduledDate().isBefore(LocalDate.now());
        return new MaintenanceResponse(
                m.getRecordNo(), m.getEquipment().getEquipmentId(), m.getEquipment().getName(),
                m.getEquipment().getLocation(), m.getType(), m.getPriority(), m.getStatus(),
                m.getDescription(), m.getScheduledDate(), m.getStartedDate(), m.getCompletedDate(),
                m.getAssignedTo(), m.getCost(), m.getNotes(), m.getRequestedBy(), overdue, m.getCreatedAt());
    }
}