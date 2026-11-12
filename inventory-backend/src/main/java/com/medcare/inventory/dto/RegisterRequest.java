package com.medcare.inventory.dto;

import com.medcare.inventory.model.Role;
import jakarta.validation.constraints.*;

public record RegisterRequest(
        @NotBlank @Size(min = 3, max = 100) String fullName,
        @NotBlank @Size(max = 50) String employeeId,
        @NotBlank @Pattern(regexp = "^[0-9\\s+\\-]{10,15}$", message = "must be a valid phone number") String phone,
        @NotBlank @Email String email,
        @NotNull Role role,
        @NotBlank String department,
        @NotBlank @Size(min = 8, max = 100)
        @Pattern(regexp = "^(?=.*[A-Za-z])(?=.*\\d).+$", message = "must contain letters and numbers") String password
) {}
