package com.medcare.inventory.service;

import com.medcare.inventory.dto.UserResponse;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.User;
import com.medcare.inventory.model.UserStatus;
import com.medcare.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserAdminService {

    private final UserRepository users;
    private final PasswordEncoder encoder;

    public List<UserResponse> list(UserStatus status) {
        List<User> result = status == null ? users.findAllByOrderByCreatedAtDesc()
                : users.findByStatusOrderByCreatedAtDesc(status);
        return result.stream().map(UserResponse::from).toList();
    }

    @Transactional
    public UserResponse changeStatus(Long id, UserStatus newStatus, String actingEmail) {
        User u = find(id);
        if (u.getEmail().equalsIgnoreCase(actingEmail))
            throw new ApiException(HttpStatus.BAD_REQUEST, "You cannot change your own account status.");
        u.setStatus(newStatus);
        if (newStatus != UserStatus.ACTIVE) u.setTokenVersion(u.getTokenVersion() + 1); // kick out active sessions
        return UserResponse.from(u);
    }

    @Transactional
    public UserResponse unlock(Long id) {
        User u = find(id);
        u.setFailedAttempts(0);
        u.setLockedUntil(null);
        return UserResponse.from(u);
    }

    @Transactional
    public UserResponse resetPassword(Long id, String newPassword) {
        User u = find(id);
        u.setPasswordHash(encoder.encode(newPassword));
        u.setTokenVersion(u.getTokenVersion() + 1);
        u.setFailedAttempts(0);
        u.setLockedUntil(null);
        return UserResponse.from(u);
    }

    private User find(Long id) {
        return users.findById(id).orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));
    }
}