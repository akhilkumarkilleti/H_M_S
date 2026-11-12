package com.medcare.inventory.dto;

import com.medcare.inventory.model.PurchaseOrder;
import com.medcare.inventory.model.PurchaseOrderLine;
import com.medcare.inventory.model.PurchaseOrderStatus;
import com.medcare.inventory.model.PurchaseReceipt;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record PurchaseOrderResponse(
        String id,
        String supplierId,
        String supplierName,
        PurchaseOrderStatus status,
        LocalDate orderDate,
        LocalDate expectedDate,
        String notes,
        String createdBy,
        int orderedQty,
        int receivedQty,
        int pendingQty,
        BigDecimal totalAmount,
        BigDecimal receivedAmount,
        boolean overdue,
        List<Line> lines,
        List<Receipt> receipts,
        LocalDateTime createdAt
) {
    public record Line(Long lineId, String itemId, String itemName, String unit, int orderedQty,
                       int receivedQty, int pendingQty, BigDecimal unitPrice, BigDecimal lineTotal) {}

    public record Receipt(String itemId, String itemName, int quantity, LocalDate receivedDate,
                          String invoiceNo, String remarks, String receivedBy) {}

    /** receipts may be empty (the list view leaves them out). */
    public static PurchaseOrderResponse from(PurchaseOrder p, List<PurchaseReceipt> receipts) {
        int ordered = 0, received = 0;
        BigDecimal total = BigDecimal.ZERO, receivedAmount = BigDecimal.ZERO;
        List<Line> lines = p.getLines().stream().map(PurchaseOrderResponse::line).toList();
        for (PurchaseOrderLine l : p.getLines()) {
            ordered += l.getOrderedQty();
            received += l.getReceivedQty();
            total = total.add(l.getUnitPrice().multiply(BigDecimal.valueOf(l.getOrderedQty())));
            receivedAmount = receivedAmount.add(l.getUnitPrice().multiply(BigDecimal.valueOf(l.getReceivedQty())));
        }
        boolean open = p.getStatus() == PurchaseOrderStatus.ORDERED
                || p.getStatus() == PurchaseOrderStatus.PARTIALLY_RECEIVED;
        boolean overdue = open && p.getExpectedDate() != null && p.getExpectedDate().isBefore(LocalDate.now());
        return new PurchaseOrderResponse(
                p.getPoNumber(), p.getSupplier().getSupplierCode(), p.getSupplier().getName(), p.getStatus(),
                p.getOrderDate(), p.getExpectedDate(), p.getNotes(), p.getCreatedBy(),
                ordered, received, ordered - received, total, receivedAmount, overdue, lines,
                receipts.stream().map(PurchaseOrderResponse::receipt).toList(), p.getCreatedAt());
    }

    private static Line line(PurchaseOrderLine l) {
        return new Line(l.getId(), l.getItem().getItemCode(), l.getItem().getName(), l.getItem().getUnit(),
                l.getOrderedQty(), l.getReceivedQty(), l.pendingQty(), l.getUnitPrice(),
                l.getUnitPrice().multiply(BigDecimal.valueOf(l.getOrderedQty())));
    }

    private static Receipt receipt(PurchaseReceipt r) {
        return new Receipt(r.getLine().getItem().getItemCode(), r.getLine().getItem().getName(), r.getQuantity(),
                r.getReceivedDate(), r.getInvoiceNo(), r.getRemarks(), r.getReceivedBy());
    }
}
