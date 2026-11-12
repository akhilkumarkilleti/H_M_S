package com.medcare.inventory.dto;

import jakarta.validation.constraints.Size;

public record AssignmentReturnRequest(
        String returnedDate,              // yyyy-MM-dd, empty = today
        String condition,                 // optional: GOOD | FAIR | POOR
        String equipmentStatus,           // optional: AVAILABLE | DAMAGED (empty = AVAILABLE)
        @Size(max = 150) String returnLocation,   // optional: where it is kept now, e.g. "Store room"
        @Size(max = 500) String notes
) {}