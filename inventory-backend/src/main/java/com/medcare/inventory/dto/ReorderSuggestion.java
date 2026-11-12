package com.medcare.inventory.dto;

import java.math.BigDecimal;

/** A low-stock item that is not already covered by open purchase orders. */
public record ReorderSuggestion(
        String itemId,
        String name,
        String unit,
        int quantity,
        int reorderLevel,
        long onOrder,
        int suggestedQty,
        BigDecimal unitPrice
) {}