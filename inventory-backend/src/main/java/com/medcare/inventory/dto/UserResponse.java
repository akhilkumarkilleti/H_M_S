package com.medcare.inventory.dto;

import com.medcare.inventory.model.Role;
import com.medcare.inventory.model.User;
import com.medcare.inventory.model.UserStatus;

import java.time.LocalDateTime;

public record UserResponse(Long id, String fullName, String employeeId, String phone, String email,
                           Role role, String department, UserStatus status, boolean locked, LocalDateTime createdAt) {
    public static UserResponse from(User u) {
        return new UserResponse(u.getId(), u.getFullName(), u.getEmployeeId(), u.getPhone(), u.getEmail(),
                u.getRole(), u.getDepartment(), u.getStatus(), u.isLocked(), u.getCreatedAt());
    }
}