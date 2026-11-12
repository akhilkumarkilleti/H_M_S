package com.medcare.inventory.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** A fault report. Any logged-in user can send one. */
public record RepairRequest(
        @NotBlank @Size(max = 20) String equipmentId,
        @NotBlank @Size(max = 500) String description,
        String priority          // LOW | MEDIUM | HIGH | CRITICAL (default MEDIUM)
) {}
