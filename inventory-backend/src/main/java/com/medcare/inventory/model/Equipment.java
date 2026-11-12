package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment")
@Getter
@Setter
@NoArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public ID shown in the UI, e.g. EQ-0001 */
    @Column(unique = true, length = 20)
    private String equipmentId;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(length = 100)
    private String serialNumber;

    @Column(length = 100)
    private String modelNumber;

    @Column(length = 100)
    private String manufacturer;

    private LocalDate purchaseDate;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal purchasePrice = BigDecimal.ZERO;

    private LocalDate warrantyUntil;

    @Column(length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private EquipmentStatus status = EquipmentStatus.AVAILABLE;

    // "condition" is a reserved word in MySQL, so the column gets a different name
    @Enumerated(EnumType.STRING)
    @Column(name = "equipment_condition", nullable = false, length = 20)
    private EquipmentCondition condition = EquipmentCondition.GOOD;

    @Column(length = 150)
    private String assignedTo;

    private LocalDate lastMaintenance;

    private LocalDate nextMaintenance;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = createdAt;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}