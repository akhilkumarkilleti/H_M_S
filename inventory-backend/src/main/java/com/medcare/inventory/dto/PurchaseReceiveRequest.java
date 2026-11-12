package com.medcare.inventory.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.util.List;

public record PurchaseReceiveRequest(
        String receivedDate,                           // yyyy-MM-dd, empty = today
        @Size(max = 60) String invoiceNo,
        @Size(max = 200) String remarks,
        @Valid @Size(max = 100) List<Line> lines
) {
    public record Line(Long lineId, @Positive @Max(1_000_000) Integer quantity) {}
}
