package com.medcare.inventory.dto;

public record AuthResponse(String token, String tokenType, long expiresInMs, UserResponse user) {}
