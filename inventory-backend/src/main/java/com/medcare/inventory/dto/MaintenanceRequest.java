package com.medcare.inventory.dto;

import jakarta.validation.constraints.Size;

/**
 * Used to schedule new work (POST) and to edit work that is still SCHEDULED (PUT).
 * On PUT every field is optional: null = keep the current value. equipmentId is ignored on PUT.
 * Dates are strings (yyyy-MM-dd) like in EquipmentRequest.
 */
public record MaintenanceRequest(
        @Size(max = 20) String equipmentId,
        String type,            // PREVENTIVE | CORRECTIVE | CALIBRATION | INSPECTION
        String priority,        // LOW | MEDIUM | HIGH | CRITICAL (default MEDIUM)
        @Size(max = 500) String description,
        String scheduledDate,
        @Size(max = 150) String assignedTo
) {}