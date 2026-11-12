package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private boolean mainAdmin = false;

    @Column(length = 120)
    private String fullName;

    @Column(length = 20)
    private String phoneNumber;
    //Setters and Getters....
    public boolean isMainAdmin() {return mainAdmin;}
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public void setMainAdmin(boolean mainAdmin) {this.mainAdmin = mainAdmin;}
    public User() {}
    public User(String email, String password, Role role) {this.email = email;this.password = password;this.role = role;}
    public Long getId() {return id;}
    public void setId(Long id) {this.id = id;}
    public String getEmail() {return email;}
    public void setEmail(String email) {this.email = email;}
    public String getPassword() {return password;}
    public void setPassword(String password) {this.password = password;}
    public Role getRole() {return role;}
    public void setRole(Role role) {this.role = role;}

}
