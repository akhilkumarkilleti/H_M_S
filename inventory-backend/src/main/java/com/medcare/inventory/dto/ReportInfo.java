package com.medcare.inventory.dto;

import java.util.List;

/** One entry of the report catalogue (only reports the logged-in user may open are listed). */
public record ReportInfo(
        String key,
        String title,
        String description,
        boolean dateRange,            // true = the report uses a from / to period
        String filterLabel,           // e.g. "Status"; null = no extra filter
        List<String> filterOptions
) {}