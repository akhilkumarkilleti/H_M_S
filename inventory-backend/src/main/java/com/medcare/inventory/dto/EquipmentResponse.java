package com.medcare.inventory.dto;

import com.medcare.inventory.model.Equipment;
import com.medcare.inventory.model.EquipmentCondition;
import com.medcare.inventory.model.EquipmentStatus;

import java.math.BigDecimal;
import java.time.LocalDate;

public record EquipmentResponse(
        String id,
        String name,
        String category,
        String serialNumber,
        String modelNumber,
        String manufacturer,
        LocalDate purchaseDate,
        BigDecimal purchasePrice,
        LocalDate warrantyUntil,
        String location,
        EquipmentStatus status,
        EquipmentCondition condition,
        String assignedTo,
        LocalDate lastMaintenance,
        LocalDate nextMaintenance
) {
    public static EquipmentResponse from(Equipment e) {
        return new EquipmentResponse(
                e.getEquipmentId(), e.getName(), e.getCategory(), e.getSerialNumber(), e.getModelNumber(),
                e.getManufacturer(), e.getPurchaseDate(), e.getPurchasePrice(), e.getWarrantyUntil(),
                e.getLocation(), e.getStatus(), e.getCondition(), e.getAssignedTo(),
                e.getLastMaintenance(), e.getNextMaintenance());
    }
}