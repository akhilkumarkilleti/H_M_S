package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

/** One maintenance job: planned service, calibration, inspection or a repair request. */
@Entity
@Table(name = "maintenance_records")
@Getter
@Setter
@NoArgsConstructor
public class MaintenanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public ID shown in the UI, e.g. MNT-0001 */
    @Column(unique = true, length = 20)
    private String recordNo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_type", nullable = false, length = 20)
    private MaintenanceType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "maintenance_status", nullable = false, length = 20)
    private MaintenanceStatus status = MaintenanceStatus.SCHEDULED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MaintenancePriority priority = MaintenancePriority.MEDIUM;

    /** Work to be done, or the fault that was reported. */
    @Column(nullable = false, length = 500)
    private String description;

    @Column(nullable = false)
    private LocalDate scheduledDate;

    private LocalDate startedDate;

    private LocalDate completedDate;

    /** Technician or vendor doing the work. */
    @Column(length = 150)
    private String assignedTo;

    @Column(precision = 12, scale = 2)
    private BigDecimal cost;

    /** Work done / resolution notes. */
    @Column(length = 1000)
    private String notes;

    /** Equipment status before the job started, so it can be restored afterwards. */
    @Enumerated(EnumType.STRING)
    @Column(name = "previous_equipment_status", length = 30)
    private EquipmentStatus previousEquipmentStatus;

    @Column(nullable = false, length = 150)
    private String requestedBy;

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