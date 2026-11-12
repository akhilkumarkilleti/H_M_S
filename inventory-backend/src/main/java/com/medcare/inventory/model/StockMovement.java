package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "stock_movements")
@Getter
@Setter
@NoArgsConstructor
public class StockMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private StockItem item;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private MovementType type;

    @Column(nullable = false)
    private int quantity;

    /** Item quantity right after this movement. */
    @Column(nullable = false)
    private int quantityAfter;

    @Column(length = 100)
    private String fromDepartment;

    @Column(length = 100)
    private String toDepartment;

    /** Supplier name, PO number, issue slip number, etc. */
    @Column(length = 100)
    private String reference;

    @Column(length = 255)
    private String remarks;

    @Column(nullable = false, length = 150)
    private String performedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}