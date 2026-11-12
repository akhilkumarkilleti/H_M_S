package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Config.AdminInitializer;
import com.example.potla_medicore_backend.Dto.CreateUserRequestDTO;
import com.example.potla_medicore_backend.Entity.Role;
import com.example.potla_medicore_backend.Entity.User;
import com.example.potla_medicore_backend.Repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailService emailService;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtService jwtService, EmailService emailService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }


    public User createUser(CreateUserRequestDTO request, Authentication authentication) {

        // Checks the  authentication
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new RuntimeException("Unauthorized. Please login first.");
        }

        String loggedInEmail = authentication.getName().trim().toLowerCase();

        if (!AdminInitializer.MAIN_ADMIN_EMAIL.equalsIgnoreCase(loggedInEmail)) {
            throw new RuntimeException("Only the Main Admin can create staff accounts.");
        }

        if (request == null) {
            throw new RuntimeException("Request cannot be empty.");
        }

        if (request.getEmail() == null || request.getEmail().isBlank()) {
            throw new RuntimeException("Email is required.");
        }

        if (request.getFullName() == null || request.getFullName().isBlank()) {
            throw new RuntimeException("Full name is required.");
        }

        if (request.getPhoneNumber() == null || !request.getPhoneNumber().trim().matches("[6-9]\\d{9}")) {
            throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number.");
        }

        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new RuntimeException("Password is required.");
        }

        if (request.getRole() == null) {
            throw new RuntimeException("Role is required.");
        }

        Role role = request.getRole();

        if (role != Role.ADMIN && role != Role.NURSE && role != Role.RECEPTION && role != Role.LAB && role != Role.PHARMACY) {
            throw new RuntimeException("Only ADMIN, NURSE, RECEPTION, LAB, or PHARMACY accounts can be created.");
        }

        String email = request.getEmail().trim().toLowerCase();
        //checks the duplicate mail exsts or not
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User with this email already exists.");
        }

        User user = new User();
        user.setEmail(email);
        user.setFullName(request.getFullName().trim());
        user.setPhoneNumber(request.getPhoneNumber().trim());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);

        User saved = userRepository.save(user);
        try {
            emailService.sendStaffCredentials(saved.getEmail(), saved.getFullName(), saved.getRole().name(), request.getPassword());
        } catch (Exception e) {
            System.err.println("Staff account created, but credentials email failed: " + e.getMessage());
        }
        return saved;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Staff account not found"));
    }

    public User updateMyProfile(String currentEmail, com.example.potla_medicore_backend.Controller.UserController.StaffProfileUpdateRequest request) {
        User user = getByEmail(currentEmail);
        String fullName = request.fullName() == null ? "" : request.fullName().trim();
        String phone = request.phoneNumber() == null ? "" : request.phoneNumber().trim();
        String email = request.email() == null ? "" : request.email().trim().toLowerCase();
        if(fullName.isBlank()) throw new RuntimeException("Full name is required.");
        if(!phone.matches("[6-9]\\d{9}"))
            throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number.");
        if(!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new RuntimeException("Enter a valid email address.");
        if(request.password()!=null && !request.password().isBlank() && request.password().length()<6)
            throw new RuntimeException("Password must contain at least 6 characters.");
        userRepository.findByEmail(email).ifPresent(existing -> {
            if(!existing.getId().equals(user.getId()))
            throw new RuntimeException("Email already registered."); });
        user.setFullName(fullName); user.setPhoneNumber(phone); user.setEmail(email);
        if(request.password()!=null && !request.password().isBlank()) user.setPassword(passwordEncoder.encode(request.password()));
        return userRepository.save(user);
    }

    public String generateTokenForUser(User user) {
        return jwtService.generateToken(user.getId(), user.getEmail(), user.getRole().name(), "ACTIVE");
    }

    public List<User> getAllStaff() {
        return userRepository.findByRoleIn(List.of(Role.MAIN_ADMIN, Role.ADMIN, Role.DOCTOR, Role.NURSE, Role.RECEPTION, Role.LAB, Role.PHARMACY));
    }



}