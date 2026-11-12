package com.medcare.inventory.dto;

import java.math.BigDecimal;

/** Numbers for the dashboard cards (active items only). */
public record StockSummaryResponse(
        long totalItems,
        long inStock,
        long lowStock,
        long outOfStock,
        long expired,
        long expiringSoon,
        BigDecimal totalValue
) {}