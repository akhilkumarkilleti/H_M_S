package com.example.potla_medicore_backend.Dto;

public class LoginResponseDTO {

    private String token;
    private Long id;
    private String email;
    private String role;
    private String status;

    public LoginResponseDTO(String token, Long id, String email, String role, String status) {
        this.token = token;this.id = id;this.email = email;this.role = role;this.status = status;
    }


    public String getToken() {
        return token;
    }

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getStatus() {
        return status;
    }
}
