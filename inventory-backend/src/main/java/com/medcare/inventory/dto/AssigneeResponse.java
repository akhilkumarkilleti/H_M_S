package com.medcare.inventory.dto;

import com.medcare.inventory.model.Role;
import com.medcare.inventory.model.User;

/** The few user details needed to pick a doctor / staff member (no email, phone or status). */
public record AssigneeResponse(Long id, String fullName, Role role, String department) {
    public static AssigneeResponse from(User u) {
        return new AssigneeResponse(u.getId(), u.getFullName(), u.getRole(), u.getDepartment());
    }
}