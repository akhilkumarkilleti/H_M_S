package com.medcare.inventory.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record StockMovementRequest(
        @NotBlank String type,                       // RECEIVED | ISSUED | RETURNED | TRANSFERRED
        @NotNull @Positive @Max(1_000_000) Integer quantity,
        @Size(max = 100) String fromDepartment,
        @Size(max = 100) String toDepartment,
        @Size(max = 100) String reference,
        @Size(max = 255) String remarks
) {}