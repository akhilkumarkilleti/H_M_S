package com.medcare.inventory.dto;

import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Every field is optional so PUT works as a partial update
 * (e.g. the Deactivate button sends only {"status":"RETIRED"}).
 * null = not sent (keep current value), "" = clear the value.
 * Dates are strings (yyyy-MM-dd) because the UI sends "" for empty dates.
 */
public record EquipmentRequest(
        @Size(max = 150) String name,
        @Size(max = 60) String category,
        @Size(max = 100) String serialNumber,
        @Size(max = 100) String modelNumber,
        @Size(max = 100) String manufacturer,
        String purchaseDate,
        @PositiveOrZero BigDecimal purchasePrice,
        String warrantyUntil,
        @Size(max = 150) String location,
        String status,
        String condition,
        @Size(max = 150) String assignedTo,
        String lastMaintenance,
        String nextMaintenance
) {}