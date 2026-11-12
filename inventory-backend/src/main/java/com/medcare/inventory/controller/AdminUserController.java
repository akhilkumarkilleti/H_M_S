package com.medcare.inventory.controller;

import com.medcare.inventory.dto.ResetPasswordRequest;
import com.medcare.inventory.dto.UserResponse;
import com.medcare.inventory.model.UserStatus;
import com.medcare.inventory.service.UserAdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
public class AdminUserController {

    private final UserAdminService service;

    @GetMapping
    public List<UserResponse> list(@RequestParam(required = false) UserStatus status) {
        return service.list(status);
    }

    @PutMapping("/{id}/approve")
    public UserResponse approve(@PathVariable Long id, Authentication auth) {
        return service.changeStatus(id, UserStatus.ACTIVE, auth.getName());
    }

    @PutMapping("/{id}/reject")
    public UserResponse reject(@PathVariable Long id, Authentication auth) {
        return service.changeStatus(id, UserStatus.REJECTED, auth.getName());
    }

    @PutMapping("/{id}/disable")
    public UserResponse disable(@PathVariable Long id, Authentication auth) {
        return service.changeStatus(id, UserStatus.DISABLED, auth.getName());
    }

    @PutMapping("/{id}/unlock")
    public UserResponse unlock(@PathVariable Long id) {
        return service.unlock(id);
    }

    @PutMapping("/{id}/reset-password")
    public UserResponse resetPassword(@PathVariable Long id, @Valid @RequestBody ResetPasswordRequest request) {
        return service.resetPassword(id, request.newPassword());
    }
}