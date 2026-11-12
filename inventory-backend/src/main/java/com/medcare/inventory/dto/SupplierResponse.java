package com.medcare.inventory.dto;

import com.medcare.inventory.model.Supplier;

public record SupplierResponse(
        String id,
        String name,
        String contactPerson,
        String phone,
        String email,
        String address,
        String taxId,
        boolean active
) {
    public static SupplierResponse from(Supplier s) {
        return new SupplierResponse(s.getSupplierCode(), s.getName(), s.getContactPerson(), s.getPhone(),
                s.getEmail(), s.getAddress(), s.getTaxId(), s.isActive());
    }
}