package com.medcare.inventory.dto;

import java.util.List;

public record AssignmentSummaryResponse(
        long active,
        long overdueReturns,
        long dueNext7Days,
        long returnedThisMonth,
        long availableEquipment,
        List<DepartmentCount> departments
) {}