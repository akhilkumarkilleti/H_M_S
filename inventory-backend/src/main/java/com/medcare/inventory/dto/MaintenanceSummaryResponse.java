package com.medcare.inventory.dto;

import java.math.BigDecimal;

public record MaintenanceSummaryResponse(
        long scheduled,
        long inProgress,
        long overdue,
        long dueNext7Days,
        long openRepairs,
        long completedThisMonth,
        BigDecimal costThisMonth
) {}