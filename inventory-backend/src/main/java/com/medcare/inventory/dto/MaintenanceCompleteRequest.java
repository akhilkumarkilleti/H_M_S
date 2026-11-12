package com.medcare.inventory.dto;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record MaintenanceCompleteRequest(
        String completedDate,                 // yyyy-MM-dd, empty = today
        @PositiveOrZero BigDecimal cost,
        @Size(max = 1000) String notes,
        String nextMaintenanceDate,           // optional: sets the equipment's next maintenance date
        String condition,                     // optional: GOOD | FAIR | POOR
        String equipmentStatus                // optional: AVAILABLE | IN_USE | DAMAGED | RETIRED (empty = restore automatically)
) {}