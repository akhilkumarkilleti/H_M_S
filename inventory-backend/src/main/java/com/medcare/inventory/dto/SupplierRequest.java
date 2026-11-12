package com.medcare.inventory.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

/** Used for create and (partial) update. null = not sent (keep current value). */
public record SupplierRequest(
        @Size(max = 150) String name,
        @Size(max = 150) String contactPerson,
        @Size(max = 30) String phone,
        @Email @Size(max = 150) String email,
        @Size(max = 255) String address,
        @Size(max = 30) String taxId,
        Boolean active
) {}