package com.medcare.inventory.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * Everything the home page needs in one response. Sections a role may not see are null
 * (purchasing) or left out (equipment value).
 */
public record DashboardResponse(
        String generatedAt,
        EquipmentStats equipment,
        MaintenanceSummaryResponse maintenance,
        AssignmentSummaryResponse assignments,
        StockSummaryResponse stock,
        PurchaseSummaryResponse purchasing,          // null unless admin, inventory manager or store keeper
        List<Alert> alerts,
        List<MaintenanceResponse> upcomingMaintenance,
        List<StockItemResponse> lowStock,
        List<Activity> activity
) {
    public record EquipmentStats(
            long total,
            Map<String, Long> byStatus,              // every equipment status, zero when none
            List<CountItem> byCategory,              // active equipment only
            int utilization,                         // percent of usable equipment that is in use
            long warrantyEnding,                     // warranty ends within 90 days
            BigDecimal value                         // null for roles that may not see prices
    ) {}

    /** level: DANGER | WARN | INFO — link is a frontend route. */
    public record Alert(String level, String title, String detail, String link) {}

    /** kind: STOCK | MAINTENANCE | ASSIGNMENT | PURCHASE */
    public record Activity(LocalDateTime at, String kind, String text, String link) {}
}
