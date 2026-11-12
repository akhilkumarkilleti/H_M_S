package com.medcare.inventory.service;

import com.medcare.inventory.dto.AuthResponse;
import com.medcare.inventory.dto.ChangePasswordRequest;
import com.medcare.inventory.dto.LoginRequest;
import com.medcare.inventory.dto.RegisterRequest;
import com.medcare.inventory.dto.UserResponse;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.Role;
import com.medcare.inventory.model.User;
import com.medcare.inventory.model.UserStatus;
import com.medcare.inventory.repository.UserRepository;
import com.medcare.inventory.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {

    static final int MAX_FAILED_ATTEMPTS = 5;
    static final int LOCK_MINUTES = 15;

    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;

    @Transactional
    public UserResponse register(RegisterRequest req) {
        String email = req.email().trim().toLowerCase();
        String empId = req.employeeId().trim();

        if (users.existsByEmailIgnoreCase(email))
            throw new ApiException(HttpStatus.CONFLICT, "This email is already registered.");
        if (users.existsByEmployeeIdIgnoreCase(empId))
            throw new ApiException(HttpStatus.CONFLICT, "This employee ID is already registered.");

        boolean firstUser = users.count() == 0;
        if (!firstUser && req.role() == Role.ADMIN)
            throw new ApiException(HttpStatus.BAD_REQUEST, "Admin accounts can only be created by an existing admin.");

        User u = new User();
        u.setFullName(req.fullName().trim());
        u.setEmployeeId(empId);
        u.setPhone(req.phone().trim());
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(req.password()));
        u.setDepartment(req.department().trim());
        // The very first account bootstraps the system as an active admin.
        u.setRole(firstUser ? Role.ADMIN : req.role());
        u.setStatus(firstUser ? UserStatus.ACTIVE : UserStatus.PENDING);
        return UserResponse.from(users.save(u));
    }

    // noRollbackFor: the failed-attempt counter must be saved even though we throw an ApiException.
    @Transactional(noRollbackFor = ApiException.class)
    public AuthResponse login(LoginRequest req) {
        String id = req.identifier().trim();
        User u = users.findByEmailIgnoreCase(id)
                .or(() -> users.findByEmployeeIdIgnoreCase(id))
                .orElseThrow(this::badCredentials);

        if (u.isLocked()) {
            long mins = Math.max(1, Duration.between(LocalDateTime.now(), u.getLockedUntil()).toMinutes() + 1);
            throw new ApiException(HttpStatus.LOCKED,
                    "Account locked after too many failed attempts. Try again in " + mins
                            + " minute(s) or ask an administrator to unlock it.");
        }

        if (!encoder.matches(req.password(), u.getPasswordHash())) {
            registerFailure(u);
            throw badCredentials();
        }

        switch (u.getStatus()) {
            case PENDING -> throw new ApiException(HttpStatus.FORBIDDEN, "Your account is waiting for administrator approval.");
            case REJECTED -> throw new ApiException(HttpStatus.FORBIDDEN, "Your registration was rejected. Contact your administrator.");
            case DISABLED -> throw new ApiException(HttpStatus.FORBIDDEN, "Your account is disabled. Contact your administrator.");
            default -> { }
        }

        u.setFailedAttempts(0);
        u.setLockedUntil(null);
        return new AuthResponse(jwtService.generateToken(u), "Bearer", jwtService.getExpirationMs(), UserResponse.from(u));
    }

    public UserResponse me(String email) {
        return UserResponse.from(byEmail(email));
    }

    /** Invalidates every token issued to this user so far. */
    @Transactional
    public void logout(String email) {
        User u = byEmail(email);
        u.setTokenVersion(u.getTokenVersion() + 1);
    }

    @Transactional
    public void changePassword(String email, ChangePasswordRequest req) {
        User u = byEmail(email);
        // 400 (not 401) on purpose: the frontend treats any 401 as "session expired" and signs the user out.
        if (!encoder.matches(req.currentPassword(), u.getPasswordHash()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "Current password is incorrect.");
        if (encoder.matches(req.newPassword(), u.getPasswordHash()))
            throw new ApiException(HttpStatus.BAD_REQUEST, "New password must be different from the current one.");
        u.setPasswordHash(encoder.encode(req.newPassword()));
        u.setTokenVersion(u.getTokenVersion() + 1);
    }

    private void registerFailure(User u) {
        // A previous lock that has already expired starts a fresh count.
        if (u.getLockedUntil() != null) {
            u.setFailedAttempts(0);
            u.setLockedUntil(null);
        }
        int attempts = u.getFailedAttempts() + 1;
        u.setFailedAttempts(attempts);
        if (attempts >= MAX_FAILED_ATTEMPTS) u.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_MINUTES));
    }

    private User byEmail(String email) {
        return users.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found."));
    }

    private ApiException badCredentials() {
        return new ApiException(HttpStatus.UNAUTHORIZED, "Email/ID or password is incorrect.");
    }
}