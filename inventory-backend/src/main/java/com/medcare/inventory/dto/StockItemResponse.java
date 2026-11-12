package com.medcare.inventory.dto;

import com.medcare.inventory.model.StockItem;

import java.math.BigDecimal;
import java.time.LocalDate;

public record StockItemResponse(
        String id,
        String name,
        String category,
        String unit,
        int quantity,
        int reorderLevel,
        BigDecimal unitPrice,
        LocalDate expiryDate,
        String location,
        boolean active,
        String stockStatus,    // IN_STOCK | LOW_STOCK | OUT_OF_STOCK
        String expiryStatus    // OK | EXPIRING_SOON | EXPIRED | NO_EXPIRY
) {
    public static StockItemResponse from(StockItem s) {
        return new StockItemResponse(s.getItemCode(), s.getName(), s.getCategory(), s.getUnit(),
                s.getQuantity(), s.getReorderLevel(), s.getUnitPrice(), s.getExpiryDate(), s.getLocation(),
                s.isActive(), s.stockStatus(), s.expiryStatus());
    }
}