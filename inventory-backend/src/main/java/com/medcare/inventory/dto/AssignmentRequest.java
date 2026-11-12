package com.medcare.inventory.dto;

import jakarta.validation.constraints.Size;

/**
 * Used to assign equipment (POST) and to transfer it to someone else (PUT /{id}/transfer).
 * equipmentId is only needed when assigning. Dates are strings (yyyy-MM-dd) like in EquipmentRequest.
 */
public record AssignmentRequest(
        @Size(max = 20) String equipmentId,
        String assigneeType,              // DEPARTMENT | STAFF
        @Size(max = 100) String department,   // required for DEPARTMENT; for STAFF it defaults to the person's department
        Long staffId,                     // required for STAFF
        @Size(max = 150) String location, // room / ward / bed (optional)
        String assignedDate,              // empty = today
        String expectedReturnDate,        // optional
        @Size(max = 255) String remarks
) {}