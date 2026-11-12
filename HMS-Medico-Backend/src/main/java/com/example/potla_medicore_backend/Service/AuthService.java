package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Entity.User;
import com.example.potla_medicore_backend.Repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User registerAdmin(String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("User already exists");
        }
        User admin = new User();
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        // Mobile number belongs to patient/doctor profiles, not the admin account.
        // Leave it null so the users table does not require admin phone details.
        admin.setRole(com.example.potla_medicore_backend.Entity.Role.ADMIN);

        return userRepository.save(admin);
    }
}
