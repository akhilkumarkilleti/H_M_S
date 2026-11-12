package com.medcare.inventory.dto;

import com.medcare.inventory.model.AssigneeType;
import com.medcare.inventory.model.AssignmentStatus;
import com.medcare.inventory.model.EquipmentAssignment;
import com.medcare.inventory.model.EquipmentCondition;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

public record AssignmentResponse(
        String id,
        String equipmentId,
        String equipmentName,
        String equipmentCategory,
        AssigneeType assigneeType,
        String department,
        Long staffId,
        String staffName,
        String location,
        AssignmentStatus status,
        LocalDate assignedDate,
        LocalDate expectedReturnDate,
        LocalDate returnedDate,
        String remarks,
        EquipmentCondition returnCondition,
        String returnNotes,
        String assignedBy,
        String returnedBy,
        boolean overdue,
        long daysOut,
        LocalDateTime createdAt
) {
    public static AssignmentResponse from(EquipmentAssignment a) {
        LocalDate today = LocalDate.now();
        boolean active = a.getStatus() == AssignmentStatus.ACTIVE;
        boolean overdue = active && a.getExpectedReturnDate() != null && a.getExpectedReturnDate().isBefore(today);
        LocalDate end = a.getReturnedDate() != null ? a.getReturnedDate() : today;
        long daysOut = Math.max(0, ChronoUnit.DAYS.between(a.getAssignedDate(), end));
        return new AssignmentResponse(
                a.getAssignmentNo(), a.getEquipment().getEquipmentId(), a.getEquipment().getName(),
                a.getEquipment().getCategory(), a.getAssigneeType(), a.getDepartment(),
                a.getStaff() == null ? null : a.getStaff().getId(), a.getStaffName(), a.getLocation(),
                a.getStatus(), a.getAssignedDate(), a.getExpectedReturnDate(), a.getReturnedDate(),
                a.getRemarks(), a.getReturnCondition(), a.getReturnNotes(), a.getAssignedBy(), a.getReturnedBy(),
                overdue, daysOut, a.getCreatedAt());
    }
}