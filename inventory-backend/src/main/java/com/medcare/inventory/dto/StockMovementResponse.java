package com.medcare.inventory.dto;

import com.medcare.inventory.model.MovementType;
import com.medcare.inventory.model.StockMovement;

import java.time.LocalDateTime;

public record StockMovementResponse(
        Long id,
        String itemId,
        String itemName,
        String unit,
        MovementType type,
        int quantity,
        int quantityAfter,
        String fromDepartment,
        String toDepartment,
        String reference,
        String remarks,
        String performedBy,
        LocalDateTime createdAt
) {
    public static StockMovementResponse from(StockMovement m) {
        return new StockMovementResponse(m.getId(), m.getItem().getItemCode(), m.getItem().getName(),
                m.getItem().getUnit(), m.getType(), m.getQuantity(), m.getQuantityAfter(),
                m.getFromDepartment(), m.getToDepartment(), m.getReference(), m.getRemarks(),
                m.getPerformedBy(), m.getCreatedAt());
    }
}