package com.medcare.inventory.dto;

import java.math.BigDecimal;

public record PurchaseSummaryResponse(
        long draft,
        long ordered,
        long partiallyReceived,
        long overdue,
        BigDecimal pendingValue,
        BigDecimal receivedThisMonth
) {}
