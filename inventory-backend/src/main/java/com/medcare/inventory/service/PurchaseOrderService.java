package com.medcare.inventory.service;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.*;
import com.medcare.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    /** Orders that are placed and still expecting goods. */
    private static final List<PurchaseOrderStatus> OPEN =
            List.of(PurchaseOrderStatus.ORDERED, PurchaseOrderStatus.PARTIALLY_RECEIVED);

    private final PurchaseOrderRepository orders;
    private final PurchaseOrderLineRepository lineRepo;
    private final PurchaseReceiptRepository receiptRepo;
    private final SupplierRepository suppliers;
    private final StockItemRepository items;
    private final UserRepository users;
    private final StockService stock;

    // ------------------------------------------------------------ reads

    /** Latest 500 orders. Receipts are left out here; get one order to see them. */
    @Transactional(readOnly = true)
    public List<PurchaseOrderResponse> list() {
        return orders.findTop500ByOrderByIdDesc().stream()
                .map(p -> PurchaseOrderResponse.from(p, List.of())).toList();
    }

    @Transactional(readOnly = true)
    public PurchaseOrderResponse get(String poNumber) {
        return detail(find(poNumber));
    }

    @Transactional(readOnly = true)
    public PurchaseSummaryResponse summary() {
        LocalDate today = LocalDate.now();
        BigDecimal pending = BigDecimal.ZERO;
        for (PurchaseOrder p : orders.findByStatusIn(OPEN))
            for (PurchaseOrderLine l : p.getLines())
                pending = pending.add(l.getUnitPrice().multiply(BigDecimal.valueOf(l.pendingQty())));
        BigDecimal received = receiptRepo.valueBetween(today.withDayOfMonth(1), today);
        return new PurchaseSummaryResponse(
                orders.countByStatus(PurchaseOrderStatus.DRAFT),
                orders.countByStatus(PurchaseOrderStatus.ORDERED),
                orders.countByStatus(PurchaseOrderStatus.PARTIALLY_RECEIVED),
                orders.countByStatusInAndExpectedDateBefore(OPEN, today),
                pending,
                received == null ? BigDecimal.ZERO : received);
    }

    /** Low-stock items that open purchase orders do not already cover. */
    @Transactional(readOnly = true)
    public List<ReorderSuggestion> suggestions() {
        Map<Long, Long> onOrder = lineRepo.pendingByItem(OPEN).stream()
                .collect(Collectors.toMap(ItemQty::itemId, ItemQty::qty));
        List<ReorderSuggestion> result = new ArrayList<>();
        for (StockItem s : items.findAllByOrderByIdAsc()) {
            if (!s.isActive() || s.getQuantity() > s.getReorderLevel()) continue;
            long ordered = onOrder.getOrDefault(s.getId(), 0L);
            long projected = s.getQuantity() + ordered;
            if (projected > s.getReorderLevel()) continue;           // already covered by an open order
            long target = Math.max(2L * s.getReorderLevel(), 1L);    // aim for twice the reorder level
            int suggested = (int) Math.max(1L, target - projected);
            result.add(new ReorderSuggestion(s.getItemCode(), s.getName(), s.getUnit(), s.getQuantity(),
                    s.getReorderLevel(), ordered, suggested, s.getUnitPrice()));
        }
        return result;
    }

    // ------------------------------------------------------------ draft handling

    @Transactional
    public PurchaseOrderResponse create(PurchaseOrderRequest r, String actorEmail) {
        PurchaseOrder p = new PurchaseOrder();
        p.setStatus(PurchaseOrderStatus.DRAFT);
        p.setCreatedBy(actorName(actorEmail));
        fill(p, r);
        p = orders.save(p);
        p.setPoNumber(String.format("PO-%04d", p.getId()));   // saved when the transaction commits
        return detail(p);
    }

    @Transactional
    public PurchaseOrderResponse update(String poNumber, PurchaseOrderRequest r) {
        PurchaseOrder p = lock(poNumber);
        if (p.getStatus() != PurchaseOrderStatus.DRAFT) throw conflict("Only draft orders can be edited.");
        fill(p, r);
        return detail(p);
    }

    @Transactional
    public void delete(String poNumber) {
        PurchaseOrder p = lock(poNumber);
        if (p.getStatus() != PurchaseOrderStatus.DRAFT)
            throw conflict("Only draft orders can be deleted. Cancel the order instead.");
        orders.delete(p);
    }

    // ------------------------------------------------------------ workflow

    /** DRAFT -> ORDERED */
    @Transactional
    public PurchaseOrderResponse place(String poNumber) {
        PurchaseOrder p = lock(poNumber);
        if (p.getStatus() != PurchaseOrderStatus.DRAFT) throw conflict("Only draft orders can be placed.");
        if (p.getLines().isEmpty()) throw bad("Add at least one item before placing the order.");
        if (!p.getSupplier().isActive())
            throw conflict(p.getSupplier().getName() + " is inactive. Activate the supplier first.");
        p.setStatus(PurchaseOrderStatus.ORDERED);
        return detail(p);
    }

    /**
     * Goods arrive: adds the quantities to stock (a RECEIVED stock movement per line, referenced to the PO),
     * records a receipt, and moves the order to PARTIALLY_RECEIVED or RECEIVED. All or nothing.
     */
    @Transactional
    public PurchaseOrderResponse receive(String poNumber, PurchaseReceiveRequest r, String actorEmail) {
        PurchaseOrder p = lock(poNumber);
        if (p.getStatus() != PurchaseOrderStatus.ORDERED && p.getStatus() != PurchaseOrderStatus.PARTIALLY_RECEIVED)
            throw conflict("Goods can only be received against a placed order.");

        LocalDate when = blank(r.receivedDate()) ? LocalDate.now() : date("Received date", r.receivedDate());
        if (when.isAfter(LocalDate.now())) throw bad("Received date cannot be in the future.");
        if (when.isBefore(p.getOrderDate())) throw bad("Received date cannot be before the order date.");
        if (r.lines() == null || r.lines().isEmpty())
            throw bad("Enter the quantity received for at least one item.");

        Map<Long, PurchaseOrderLine> byId = p.getLines().stream()
                .collect(Collectors.toMap(PurchaseOrderLine::getId, l -> l));
        Set<Long> seen = new HashSet<>();
        for (PurchaseReceiveRequest.Line l : r.lines()) {          // validate everything before changing anything
            if (l == null || l.lineId() == null || l.quantity() == null)
                throw bad("Each received line needs an item and a quantity.");
            PurchaseOrderLine line = byId.get(l.lineId());
            if (line == null) throw bad("Line " + l.lineId() + " does not belong to " + p.getPoNumber() + ".");
            if (!seen.add(l.lineId())) throw bad(line.getItem().getName() + " is listed twice.");
            if (l.quantity() > line.pendingQty())
                throw bad("Cannot receive " + l.quantity() + " " + line.getItem().getUnit() + " of "
                        + line.getItem().getName() + ": only " + line.pendingQty() + " still pending.");
        }

        String invoice = clean(r.invoiceNo());
        String reference = invoice == null ? p.getPoNumber() : p.getPoNumber() + " / " + invoice;
        String remarks = "Received against " + p.getPoNumber() + " from " + p.getSupplier().getName();
        if (remarks.length() > 255) remarks = remarks.substring(0, 255);
        String actor = actorName(actorEmail);

        for (PurchaseReceiveRequest.Line l : r.lines()) {
            PurchaseOrderLine line = byId.get(l.lineId());
            // goes through the stock service so locking, validation and history work exactly as for a manual receipt
            stock.move(line.getItem().getItemCode(),
                    new StockMovementRequest("RECEIVED", l.quantity(), null, null, reference, remarks), actorEmail);
            line.setReceivedQty(line.getReceivedQty() + l.quantity());

            PurchaseReceipt receipt = new PurchaseReceipt();
            receipt.setOrder(p);
            receipt.setLine(line);
            receipt.setQuantity(l.quantity());
            receipt.setReceivedDate(when);
            receipt.setInvoiceNo(invoice);
            receipt.setRemarks(clean(r.remarks()));
            receipt.setReceivedBy(actor);
            receiptRepo.save(receipt);
        }

        boolean complete = p.getLines().stream().allMatch(l -> l.pendingQty() == 0);
        p.setStatus(complete ? PurchaseOrderStatus.RECEIVED : PurchaseOrderStatus.PARTIALLY_RECEIVED);
        return detail(p);
    }

    /** PARTIALLY_RECEIVED -> CLOSED: the supplier will not deliver the rest. */
    @Transactional
    public PurchaseOrderResponse close(String poNumber) {
        PurchaseOrder p = lock(poNumber);
        if (p.getStatus() != PurchaseOrderStatus.PARTIALLY_RECEIVED)
            throw conflict("Only partially received orders can be closed short.");
        p.setStatus(PurchaseOrderStatus.CLOSED);
        return detail(p);
    }

    /** DRAFT or ORDERED (nothing received yet) -> CANCELLED */
    @Transactional
    public PurchaseOrderResponse cancel(String poNumber) {
        PurchaseOrder p = lock(poNumber);
        if (p.getStatus() != PurchaseOrderStatus.DRAFT && p.getStatus() != PurchaseOrderStatus.ORDERED)
            throw conflict("Only draft or placed orders with nothing received can be cancelled. "
                    + "Close a partly received order instead.");
        p.setStatus(PurchaseOrderStatus.CANCELLED);
        return detail(p);
    }

    // ------------------------------------------------------------ helpers

    /** Validates the request and copies supplier, dates, notes and lines onto the (draft) order. */
    private void fill(PurchaseOrder p, PurchaseOrderRequest r) {
        if (blank(r.supplierId())) throw bad("Select the supplier.");
        Supplier supplier = suppliers.findBySupplierCodeIgnoreCase(r.supplierId().trim())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Supplier " + r.supplierId() + " not found."));
        if (!supplier.isActive())
            throw conflict(supplier.getName() + " is inactive. Activate the supplier first.");

        LocalDate order = blank(r.orderDate()) ? LocalDate.now() : date("Order date", r.orderDate());
        if (order.isAfter(LocalDate.now())) throw bad("Order date cannot be in the future.");
        LocalDate expected = blank(r.expectedDate()) ? null : date("Expected delivery date", r.expectedDate());
        if (expected != null && expected.isBefore(order))
            throw bad("Expected delivery cannot be before the order date.");
        if (r.lines() == null || r.lines().isEmpty()) throw bad("Add at least one item.");

        List<PurchaseOrderLine> built = new ArrayList<>();
        Set<String> seen = new HashSet<>();
        for (PurchaseOrderLineRequest lr : r.lines()) {
            if (lr == null || blank(lr.itemId())) throw bad("Select an item on every line.");
            String code = lr.itemId().trim().toUpperCase();
            if (!seen.add(code)) throw bad(code + " is listed twice. Combine the quantities into one line.");
            if (lr.quantity() == null) throw bad("Enter a quantity for " + code + ".");
            StockItem item = items.findByItemCodeIgnoreCase(code)
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Stock item " + code + " not found."));
            if (!item.isActive()) throw conflict(item.getName() + " is inactive and cannot be ordered.");

            PurchaseOrderLine line = new PurchaseOrderLine();
            line.setOrder(p);
            line.setItem(item);
            line.setOrderedQty(lr.quantity());
            line.setUnitPrice(lr.unitPrice() != null ? lr.unitPrice() : item.getUnitPrice());
            built.add(line);
        }

        p.setSupplier(supplier);
        p.setOrderDate(order);
        p.setExpectedDate(expected);
        p.setNotes(clean(r.notes()));
        p.getLines().clear();
        p.getLines().addAll(built);
    }

    private PurchaseOrderResponse detail(PurchaseOrder p) {
        return PurchaseOrderResponse.from(p, receiptRepo.findByOrder_IdOrderByIdAsc(p.getId()));
    }

    private PurchaseOrder find(String no) {
        return orders.findByPoNumberIgnoreCase(no)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Purchase order " + no + " not found."));
    }

    private PurchaseOrder lock(String no) {
        return orders.findForUpdate(no)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Purchase order " + no + " not found."));
    }

    private String actorName(String email) {
        return users.findByEmailIgnoreCase(email).map(User::getFullName).orElse(email);
    }

    private static LocalDate date(String field, String v) {
        try {
            return LocalDate.parse(v.trim());
        } catch (DateTimeParseException ex) {
            throw bad(field + " must be a valid date (yyyy-MM-dd).");
        }
    }

    private static boolean blank(String v) {
        return v == null || v.isBlank();
    }

    private static String clean(String v) {
        return blank(v) ? null : v.trim();
    }

    private static ApiException bad(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }

    private static ApiException conflict(String message) {
        return new ApiException(HttpStatus.CONFLICT, message);
    }
}
