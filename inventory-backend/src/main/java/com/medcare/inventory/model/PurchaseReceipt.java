package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

/** One goods receipt against a purchase-order line (partial deliveries create several). */
@Entity
@Table(name = "purchase_receipts")
@Getter
@Setter
@NoArgsConstructor
public class PurchaseReceipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "line_id", nullable = false)
    private PurchaseOrderLine line;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = false)
    private LocalDate receivedDate;

    /** Supplier's invoice / delivery challan number. */
    @Column(length = 60)
    private String invoiceNo;

    @Column(length = 200)
    private String remarks;

    @Column(nullable = false, length = 150)
    private String receivedBy;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }
}