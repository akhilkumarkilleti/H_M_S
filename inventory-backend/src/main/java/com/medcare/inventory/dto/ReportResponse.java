package com.medcare.inventory.dto;

import java.util.List;
import java.util.Map;

/**
 * A report in one generic shape, so a single screen can show every report:
 * column definitions, rows keyed by column key, and a few headline figures.
 * Column / stat types: text | int | money | date | status
 */
public record ReportResponse(
        String key,
        String title,
        String period,
        String generatedAt,
        List<Column> columns,
        List<Map<String, Object>> rows,
        List<Stat> summary,
        boolean truncated             // true = more rows exist than were sent
) {
    public record Column(String key, String label, String type) {}

    public record Stat(String label, Object value, String type) {}
}