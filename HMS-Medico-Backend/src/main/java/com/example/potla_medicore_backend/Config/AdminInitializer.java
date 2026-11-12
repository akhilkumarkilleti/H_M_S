package com.example.potla_medicore_backend.Config;

import com.example.potla_medicore_backend.Entity.Role;
import com.example.potla_medicore_backend.Entity.User;
import com.example.potla_medicore_backend.Repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AdminInitializer {
    public static final String MAIN_ADMIN_EMAIL="admin@gmail.com";
    private static final String MAIN_ADMIN_PASSWORD="admin123";
    private static final String MAIN_ADMIN_NAME="Main Administrator";
    private static final String MAIN_ADMIN_PHONE="9999999999";

    @Bean
    CommandLineRunner createMainAdmin(UserRepository repo, PasswordEncoder encoder){
        return args -> {
            //Checking for the mainadmin email is alredy exists or not
            User admin=repo.findByEmail(MAIN_ADMIN_EMAIL).orElseGet(User::new);
            admin.setEmail(MAIN_ADMIN_EMAIL);
            if(admin.getPassword()==null || !encoder.matches(MAIN_ADMIN_PASSWORD,admin.getPassword()))
                admin.setPassword(encoder.encode(MAIN_ADMIN_PASSWORD));
            admin.setRole(Role.MAIN_ADMIN);
            admin.setMainAdmin(true);
            if (admin.getFullName() == null || admin.getFullName().isBlank()) {
                admin.setFullName(MAIN_ADMIN_NAME);
            }
            if (admin.getPhoneNumber() == null || admin.getPhoneNumber().isBlank()) {
                admin.setPhoneNumber(MAIN_ADMIN_PHONE);
            }
            repo.save(admin);
            System.out.println("MAIN ADMIN READY: "+MAIN_ADMIN_EMAIL);
            System.out.println("SuccessfullY Running You Can Login to the ADMIN-PANEL...");
        };
    }
}

