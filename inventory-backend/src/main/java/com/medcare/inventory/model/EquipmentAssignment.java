package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** Who has a piece of equipment, where it is, and for how long. One row per hand-over. */
@Entity
@Table(name = "equipment_assignments")
@Getter
@Setter
@NoArgsConstructor
public class EquipmentAssignment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public ID shown in the UI, e.g. ASG-0001 */
    @Column(unique = true, length = 20)
    private String assignmentNo;

    @ManyToOne(optional = false)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignee_type", nullable = false, length = 20)
    private AssigneeType assigneeType;

    /** Department that holds the equipment (always filled; for staff it defaults to the person's department). */
    @Column(nullable = false, length = 100)
    private String department;

    /** Set when the equipment is assigned to a doctor / staff member. */
    @ManyToOne
    @JoinColumn(name = "staff_id")
    private User staff;

    /** Name of the staff member at the time of assignment. */
    @Column(length = 150)
    private String staffName;

    /** Room / ward / bed detail, e.g. "ICU Bed 4". Copied to the equipment's location. */
    @Column(length = 150)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "assignment_status", nullable = false, length = 20)
    private AssignmentStatus status = AssignmentStatus.ACTIVE;

    @Column(nullable = false)
    private LocalDate assignedDate;

    private LocalDate expectedReturnDate;

    /** Date it was returned, or handed over to someone else (transfer). */
    private LocalDate returnedDate;

    @Column(length = 255)
    private String remarks;

    @Enumerated(EnumType.STRING)
    @Column(name = "return_condition", length = 20)
    private EquipmentCondition returnCondition;

    @Column(length = 500)
    private String returnNotes;

    @Column(nullable = false, length = 150)
    private String assignedBy;

    @Column(length = 150)
    private String returnedBy;

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