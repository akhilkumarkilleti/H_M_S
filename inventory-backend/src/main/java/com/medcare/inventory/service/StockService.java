package com.medcare.inventory.service;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.MovementType;
import com.medcare.inventory.model.StockItem;
import com.medcare.inventory.model.StockMovement;
import com.medcare.inventory.model.User;
import com.medcare.inventory.repository.StockItemRepository;
import com.medcare.inventory.repository.StockMovementRepository;
import com.medcare.inventory.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.medcare.inventory.repository.PurchaseOrderLineRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StockService {

    private final StockItemRepository items;
    private final StockMovementRepository movements;
    private final UserRepository users;
    private final PurchaseOrderLineRepository orderLines;
    // ------------------------------------------------------------ reads

    public List<StockItemResponse> listItems() {
        return items.findAllByOrderByIdAsc().stream().map(StockItemResponse::from).toList();
    }

    public StockItemResponse getItem(String code) {
        return StockItemResponse.from(find(code));
    }

    /** itemCode == null returns the latest 200 movements of all items. */
    public List<StockMovementResponse> listMovements(String itemCode) {
        List<StockMovement> result;
        if (itemCode == null || itemCode.isBlank()) {
            result = movements.findTop200ByOrderByIdDesc();
        } else {
            find(itemCode);   // 404 if the item does not exist
            result = movements.findTop200ByItem_ItemCodeIgnoreCaseOrderByIdDesc(itemCode);
        }
        return result.stream().map(StockMovementResponse::from).toList();
    }

    public StockSummaryResponse summary() {
        long inStock = 0, low = 0, out = 0, expired = 0, soon = 0, total = 0;
        BigDecimal value = BigDecimal.ZERO;
        for (StockItem s : items.findAllByOrderByIdAsc()) {
            if (!s.isActive()) continue;
            total++;
            switch (s.stockStatus()) {
                case "OUT_OF_STOCK" -> out++;
                case "LOW_STOCK" -> low++;
                default -> inStock++;
            }
            switch (s.expiryStatus()) {
                case "EXPIRED" -> expired++;
                case "EXPIRING_SOON" -> soon++;
                default -> { }
            }
            value = value.add(s.getUnitPrice().multiply(BigDecimal.valueOf(s.getQuantity())));
        }
        return new StockSummaryResponse(total, inStock, low, out, expired, soon, value);
    }

    // ------------------------------------------------------------ items

    @Transactional
    public StockItemResponse createItem(StockItemRequest r, String actorEmail) {
        if (isBlank(r.name())) throw bad("Item name is required.");
        if (isBlank(r.category())) throw bad("Category is required.");
        if (isBlank(r.unit())) throw bad("Unit is required (e.g. pcs, box, ml).");

        StockItem s = new StockItem();
        apply(s, r);
        s = items.save(s);
        s.setItemCode(String.format("ST-%04d", s.getId()));   // saved when the transaction commits

        int opening = r.openingQuantity() == null ? 0 : r.openingQuantity();
        if (opening > 0) {
            s.setQuantity(opening);
            record(s, MovementType.RECEIVED, opening, null, null, "Opening stock", "Opening stock", actorEmail);
        }
        return StockItemResponse.from(s);
    }

    @Transactional
    public StockItemResponse updateItem(String code, StockItemRequest r) {
        if (r.openingQuantity() != null)
            throw bad("Quantity can only be changed by recording a stock movement.");
        StockItem s = find(code);
        apply(s, r);
        return StockItemResponse.from(s);
    }

    @Transactional
    public void deleteItem(String code) {
        StockItem s = find(code);
        if (orderLines.existsByItem_Id(s.getId()))
            throw new ApiException(HttpStatus.CONFLICT,
                    "This item is used in purchase orders and cannot be deleted. Deactivate it instead.");
        if (movements.existsByItem_Id(s.getId()))
            throw new ApiException(HttpStatus.CONFLICT,
                    "This item has stock history and cannot be deleted. Deactivate it instead.");
        items.delete(s);
    }

    // ------------------------------------------------------------ movements

    @Transactional
    public StockMovementResponse move(String code, StockMovementRequest r, String actorEmail) {
        MovementType type = parseType(r.type());
        StockItem s = items.findForUpdate(code)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Stock item " + code + " not found."));
        if (!s.isActive())
            throw new ApiException(HttpStatus.CONFLICT, "This item is inactive. Activate it before recording movements.");

        int qty = r.quantity();
        String from = clean(r.fromDepartment());
        String to = clean(r.toDepartment());

        switch (type) {
            case RECEIVED -> s.setQuantity(add(s.getQuantity(), qty));
            case RETURNED -> {
                if (from == null) throw bad("Enter the department the stock is returned from.");
                s.setQuantity(add(s.getQuantity(), qty));
            }
            case ISSUED -> {
                if (to == null) throw bad("Enter the department the stock is issued to.");
                if (s.getExpiryDate() != null && s.getExpiryDate().isBefore(LocalDate.now()))
                    throw new ApiException(HttpStatus.CONFLICT, "This item has expired and cannot be issued.");
                ensureAvailable(s, qty);
                s.setQuantity(s.getQuantity() - qty);
            }
            case TRANSFERRED -> {
                if (from == null || to == null) throw bad("Enter both the 'from' and 'to' departments.");
                if (from.equalsIgnoreCase(to)) throw bad("'From' and 'to' departments must be different.");
                ensureAvailable(s, qty);   // total quantity stays the same, the move is recorded in history
            }
        }
        return StockMovementResponse.from(
                record(s, type, qty, from, to, clean(r.reference()), clean(r.remarks()), actorEmail));
    }

    // ------------------------------------------------------------ helpers

    private StockMovement record(StockItem s, MovementType type, int qty, String from, String to,
                                 String reference, String remarks, String actorEmail) {
        StockMovement m = new StockMovement();
        m.setItem(s);
        m.setType(type);
        m.setQuantity(qty);
        m.setQuantityAfter(s.getQuantity());
        m.setFromDepartment(from);
        m.setToDepartment(to);
        m.setReference(reference);
        m.setRemarks(remarks);
        m.setPerformedBy(users.findByEmailIgnoreCase(actorEmail).map(User::getFullName).orElse(actorEmail));
        return movements.save(m);
    }

    private void apply(StockItem s, StockItemRequest r) {
        if (r.name() != null) {
            String n = r.name().trim();
            if (n.isEmpty()) throw bad("Item name cannot be empty.");
            if (items.existsByNameIgnoreCaseAndIdNot(n, s.getId() == null ? -1L : s.getId()))
                throw new ApiException(HttpStatus.CONFLICT, "An item named \"" + n + "\" already exists.");
            s.setName(n);
        }
        if (r.category() != null) {
            if (r.category().isBlank()) throw bad("Category cannot be empty.");
            s.setCategory(r.category().trim());
        }
        if (r.unit() != null) {
            if (r.unit().isBlank()) throw bad("Unit cannot be empty.");
            s.setUnit(r.unit().trim());
        }
        if (r.reorderLevel() != null) s.setReorderLevel(r.reorderLevel());
        if (r.unitPrice() != null) s.setUnitPrice(r.unitPrice());
        if (r.expiryDate() != null) s.setExpiryDate(date("Expiry date", r.expiryDate()));
        if (r.location() != null) s.setLocation(clean(r.location()));
        if (r.active() != null) s.setActive(r.active());
    }

    private StockItem find(String code) {
        return items.findByItemCodeIgnoreCase(code)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Stock item " + code + " not found."));
    }

    private static void ensureAvailable(StockItem s, int qty) {
        if (qty > s.getQuantity())
            throw new ApiException(HttpStatus.CONFLICT,
                    "Not enough stock. Only " + s.getQuantity() + " " + s.getUnit() + " available.");
    }

    private static int add(int a, int b) {
        try {
            return Math.addExact(a, b);
        } catch (ArithmeticException e) {
            throw bad("Quantity is too large.");
        }
    }

    private static MovementType parseType(String v) {
        try {
            return MovementType.valueOf(v.trim().toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            throw bad("Invalid movement type. Use RECEIVED, ISSUED, RETURNED or TRANSFERRED.");
        }
    }

    private static boolean isBlank(String v) {
        return v == null || v.isBlank();
    }

    private static String clean(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }

    private static LocalDate date(String field, String v) {
        if (v == null || v.isBlank()) return null;
        try {
            return LocalDate.parse(v.trim());
        } catch (DateTimeParseException ex) {
            throw bad(field + " must be a valid date (yyyy-MM-dd).");
        }
    }

    private static ApiException bad(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}