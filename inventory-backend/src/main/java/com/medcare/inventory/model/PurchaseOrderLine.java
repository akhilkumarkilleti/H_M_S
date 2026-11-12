package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_order_lines")
@Getter
@Setter
@NoArgsConstructor
public class PurchaseOrderLine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "purchase_order_id", nullable = false)
    private PurchaseOrder order;

    @ManyToOne(optional = false)
    @JoinColumn(name = "item_id", nullable = false)
    private StockItem item;

    @Column(nullable = false)
    private int orderedQty;

    /** Grows with every goods receipt. */
    @Column(nullable = false)
    private int receivedQty = 0;

    /** Purchase price per unit for this order. */
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    public int pendingQty() {
        return orderedQty - receivedQty;
    }
}