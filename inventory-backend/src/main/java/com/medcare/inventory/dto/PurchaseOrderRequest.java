package com.medcare.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Size;

import java.util.List;

/** Used to create a DRAFT order (POST) and to replace a DRAFT order's content (PUT). Dates are yyyy-MM-dd strings. */
public record PurchaseOrderRequest(
        @Size(max = 20) String supplierId,             // supplier code, e.g. SUP-0001
        String orderDate,                              // empty = today
        String expectedDate,                           // optional
        @Size(max = 500) String notes,
        @Valid @Size(max = 100) List<PurchaseOrderLineRequest> lines
) {}