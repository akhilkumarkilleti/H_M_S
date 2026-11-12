package com.example.potla_medicore_backend.Dto;


import com.example.potla_medicore_backend.Entity.Role;
import lombok.Data;

@Data
public class CreateUserRequestDTO {

    private String email;
    private String fullName;
    private String phoneNumber;
    private String password;
    private Role role;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
