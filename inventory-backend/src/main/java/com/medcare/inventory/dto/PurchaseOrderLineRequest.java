package com.medcare.inventory.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record PurchaseOrderLineRequest(
        @Size(max = 20) String itemId,                 // stock item code, e.g. ST-0001
        @Positive @Max(1_000_000) Integer quantity,
        @PositiveOrZero BigDecimal unitPrice           // empty = the item's current unit price
) {}