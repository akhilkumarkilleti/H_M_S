package com.medcare.inventory.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

/**
 * Used for create and (partial) update. null = not sent (keep current value).
 * openingQuantity is only allowed when creating; later changes go through stock movements.
 */
public record StockItemRequest(
        @Size(max = 150) String name,
        @Size(max = 60) String category,
        @Size(max = 30) String unit,
        @PositiveOrZero @Max(1_000_000) Integer openingQuantity,
        @PositiveOrZero @Max(1_000_000) Integer reorderLevel,
        @PositiveOrZero BigDecimal unitPrice,
        String expiryDate,
        @Size(max = 150) String location,
        Boolean active
) {}
