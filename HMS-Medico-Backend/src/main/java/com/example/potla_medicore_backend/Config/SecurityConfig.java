package com.example.potla_medicore_backend.Config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.potla_medicore_backend.Security.JwtAuthenticationFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter)
            throws Exception {

        http
                .cors(cors ->cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/doctors/signup", "/api/doctors/login", "/api/doctors/reset-password").permitAll()
                        .requestMatchers("/api/doctors/*/profile-photo").permitAll()
                        .requestMatchers("/api/admin/login").permitAll()
                        .requestMatchers("/api/admin/forgot-password").permitAll()
                        .requestMatchers("/api/patients/register", "/api/patients/login", "/api/patients/forgot-password").permitAll()

                        // Match staff self-service before the broader /api/admin/** rule.
                        .requestMatchers("/api/admin/users/me").hasAnyRole("MAIN_ADMIN","ADMIN","NURSE","RECEPTION","LAB","PHARMACY")
                        .requestMatchers(HttpMethod.POST, "/api/admin/users", "/api/admin/admins").hasRole("MAIN_ADMIN")
                        .requestMatchers("/api/admin/**").hasAnyRole("MAIN_ADMIN","ADMIN")

                        .requestMatchers("/api/nurse/**").hasRole("NURSE")
                        .requestMatchers("/api/reception/**").hasRole("RECEPTION")
                        .requestMatchers("/api/lab/patients/**", "/api/lab/history", "/api/lab/reports", "/api/lab/reports/*").hasRole("LAB")
                        .requestMatchers("/api/lab/reports/*/file").authenticated()
                        .requestMatchers("/api/lab-tests/doctor/**").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.POST, "/api/lab-tests").hasRole("DOCTOR")
                        .requestMatchers("/api/lab-tests/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/lab-tests/lab/**").hasRole("LAB")
                        .requestMatchers(HttpMethod.PUT, "/api/lab-tests/*/complete").hasRole("LAB")
                        .requestMatchers("/api/pharmacy/**").hasRole("PHARMACY")

                        .requestMatchers(HttpMethod.POST, "/api/health-checkups").hasRole("PATIENT")
                        .requestMatchers("/api/health-checkups/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/health-checkups/admin/**").hasAnyRole("MAIN_ADMIN","ADMIN")
                        .requestMatchers("/api/health-checkups/lab/**").hasRole("LAB")
                        .requestMatchers("/api/health-checkups/*/file").authenticated()

                        .requestMatchers("/api/prescriptions").hasRole("DOCTOR")
                        .requestMatchers("/api/prescriptions/doctor/**").hasRole("DOCTOR")
                        .requestMatchers("/api/prescriptions/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/prescriptions/pharmacy/**").hasRole("PHARMACY")
                        .requestMatchers(HttpMethod.PUT, "/api/prescriptions/*/dispense").hasRole("PHARMACY")

                        .requestMatchers("/api/patient-records/vitals", "/api/patient-records/reports", "/api/patient-records/lab-tests", "/api/patient-records/prescriptions").hasRole("PATIENT")
                        .requestMatchers("/api/patient-records/reports/*/file").authenticated()
                        .requestMatchers("/api/medical-reports/upload/**", "/api/medical-reports/patient/**").hasRole("PATIENT")
                        .requestMatchers("/api/medical-reports/file/**").authenticated()
                        .requestMatchers("/api/clinical-records/doctor/**").hasRole("DOCTOR")
                        .requestMatchers("/api/clinical-records/admin/**").hasAnyRole("MAIN_ADMIN","ADMIN")
                        .requestMatchers("/api/clinical-records/patient/**").hasAnyRole("DOCTOR","NURSE","RECEPTION","LAB","PHARMACY","ADMIN","MAIN_ADMIN")
                        .requestMatchers("/api/doctors/me", "/api/doctors/availability").hasRole("DOCTOR")
                        .requestMatchers("/api/doctors/active-today").hasAnyRole("NURSE","RECEPTION")
                        .requestMatchers("/api/patients/me").hasRole("PATIENT")
                        .requestMatchers(HttpMethod.PUT, "/api/patients/me").hasRole("PATIENT")
                        .requestMatchers("/api/appointments/patient/**").hasRole("PATIENT")
                        .requestMatchers(HttpMethod.POST, "/api/appointments").hasRole("PATIENT")
                        .requestMatchers("/api/appointments/doctor/**").hasRole("DOCTOR")
                        .requestMatchers(HttpMethod.PUT, "/api/appointments/*/confirm", "/api/appointments/*/reject").hasRole("DOCTOR")
                        .requestMatchers("/api/billing/invoices/catalog").hasAnyRole("PATIENT","DOCTOR")
                        .requestMatchers("/api/billing/invoices/**").hasRole("PATIENT")
                        .anyRequest().permitAll()
                )

                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(List.of("http://localhost:3000","http://localhost:5173"));

        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }
}
