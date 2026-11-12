package com.example.potla_medicore_backend.Dto;

public record AdminDoctorUpdateDTO(String fullName, String phoneNumber, String email, String password, String qualification,
 String specialization, Integer experienceYears, Double consultationFee, String city, String hospitalName,
 String availableTimings, String languagesKnown, String about, String licenseDocument, String status) {}
