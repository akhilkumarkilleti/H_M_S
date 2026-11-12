package com.medcare.inventory.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stock_items")
@Getter
@Setter
@NoArgsConstructor
public class StockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Public code shown in the UI, e.g. ST-0001 */
    @Column(unique = true, length = 20)
    private String itemCode;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 60)
    private String category;

    @Column(nullable = false, length = 30)
    private String unit;

    /** Current quantity. Only changes through stock movements. */
    @Column(nullable = false)
    private int quantity = 0;

    /** Minimum / reorder quantity. At or below this the item is "low stock". */
    @Column(nullable = false)
    private int reorderLevel = 0;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal unitPrice = BigDecimal.ZERO;

    private LocalDate expiryDate;

    @Column(length = 150)
    private String location;

    @Column(nullable = false)
    private boolean active = true;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    // Plain methods (not fields), so JPA ignores them.
    public String stockStatus() {
        if (quantity <= 0) return "OUT_OF_STOCK";
        if (quantity <= reorderLevel) return "LOW_STOCK";
        return "IN_STOCK";
    }

    public String expiryStatus() {
        if (expiryDate == null) return "NO_EXPIRY";
        LocalDate today = LocalDate.now();
        if (expiryDate.isBefore(today)) return "EXPIRED";
        if (!expiryDate.isAfter(today.plusDays(30))) return "EXPIRING_SOON";
        return "OK";
    }
}