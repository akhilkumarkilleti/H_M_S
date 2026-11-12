package com.medcare.inventory.dto;

public record CategoryResponse(Long id, String name, String description, boolean active, long equipmentCount) {}
