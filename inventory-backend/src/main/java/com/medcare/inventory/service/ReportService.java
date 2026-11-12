package com.medcare.inventory.service;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.dto.ReportResponse.Column;
import com.medcare.inventory.dto.ReportResponse.Stat;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.*;
import com.medcare.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private static final int MAX_ROWS = 5000;
    private static final int MAX_DAYS = 1096;                       // three years
    private static final DateTimeFormatter STAMP = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");

    private static final Set<String> ADMIN_MGR = Set.of("ROLE_ADMIN", "ROLE_INVENTORY_MANAGER");
    private static final Set<String> STORE = Set.of("ROLE_ADMIN", "ROLE_INVENTORY_MANAGER", "ROLE_STORE_KEEPER");
    private static final Set<String> MAINT = Set.of("ROLE_ADMIN", "ROLE_INVENTORY_MANAGER", "ROLE_MAINTENANCE_ENGINEER");
    private static final Set<String> EVERYONE = Set.of("ROLE_ADMIN", "ROLE_INVENTORY_MANAGER",
            "ROLE_STORE_KEEPER", "ROLE_MAINTENANCE_ENGINEER");

    private record Spec(String key, String title, String description, boolean dates,
                        String filterLabel, List<String> options, Set<String> roles) {
        ReportInfo info() {
            return new ReportInfo(key, title, description, dates, filterLabel, options);
        }
    }

    private static final List<Spec> SPECS = List.of(
            new Spec("equipment", "Equipment report",
                    "Every piece of equipment with status, location, warranty and maintenance dates.",
                    false, "Status", names(EquipmentStatus.values()), EVERYONE),
            new Spec("stock", "Stock report",
                    "Quantity, reorder level, value and expiry of every active stock item.",
                    false, "Stock status",
                    List.of("IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "EXPIRING_SOON", "EXPIRED"), STORE),
            new Spec("movements", "Issue / return report",
                    "Stock received, issued, returned and transferred during a period.",
                    true, "Movement type", names(MovementType.values()), STORE),
            new Spec("assignments", "Equipment assignment report",
                    "Who received which equipment, when, and whether it came back.",
                    true, "Status", names(AssignmentStatus.values()), STORE),
            new Spec("maintenance", "Maintenance report",
                    "Maintenance jobs scheduled during a period, with status and cost.",
                    true, "Status", names(MaintenanceStatus.values()), MAINT),
            new Spec("purchases", "Purchase report",
                    "Purchase orders placed during a period, with received and pending quantities.",
                    true, "Status", names(PurchaseOrderStatus.values()), ADMIN_MGR),
            new Spec("valuation", "Inventory valuation",
                    "Value of equipment (purchase price) and stock (quantity x unit price) by category.",
                    false, null, List.of(), ADMIN_MGR));

    private final EquipmentRepository equipment;
    private final StockItemRepository items;
    private final StockMovementRepository movements;
    private final AssignmentRepository assignments;
    private final MaintenanceRepository maintenance;
    private final PurchaseOrderRepository orders;

    // ------------------------------------------------------------ entry points

    /** The reports this user may open. roles = granted authorities such as ROLE_ADMIN. */
    public List<ReportInfo> catalog(Collection<String> roles) {
        return SPECS.stream().filter(s -> !Collections.disjoint(s.roles(), roles)).map(Spec::info).toList();
    }

    public ReportResponse run(String key, String fromText, String toText, String filter, Collection<String> roles) {
        Spec spec = SPECS.stream().filter(s -> s.key().equals(key)).findFirst()
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Unknown report: " + key));
        if (Collections.disjoint(spec.roles(), roles))
            throw new ApiException(HttpStatus.FORBIDDEN, "You do not have access to this report.");

        String f = blank(filter) ? null : filter.trim().toUpperCase();
        if (f != null && !spec.options().contains(f)) throw bad("Unknown filter value: " + filter);

        LocalDate today = LocalDate.now();
        LocalDate to = blank(toText) ? today : date("To date", toText);
        LocalDate from = blank(fromText) ? to.minusDays(29) : date("From date", fromText);
        if (from.isAfter(to)) throw bad("The from date cannot be after the to date.");
        if (ChronoUnit.DAYS.between(from, to) > MAX_DAYS) throw bad("Choose a period of three years or less.");
        String period = spec.dates() ? from + " to " + to : "As of " + today;

        return switch (key) {
            case "equipment" -> equipmentReport(spec, period, f);
            case "stock" -> stockReport(spec, period, f);
            case "movements" -> movementReport(spec, period, f, from, to);
            case "assignments" -> assignmentReport(spec, period, f, from, to);
            case "maintenance" -> maintenanceReport(spec, period, f, from, to);
            case "purchases" -> purchaseReport(spec, period, f, from, to);
            default -> valuationReport(spec, period);
        };
    }

    // ------------------------------------------------------------ reports

    private ReportResponse equipmentReport(Spec spec, String period, String f) {
        List<Equipment> list = equipment.findAllByOrderByIdAsc().stream()
                .filter(e -> f == null || e.getStatus().name().equals(f)).toList();

        BigDecimal value = BigDecimal.ZERO;
        long available = 0, inUse = 0, maint = 0, damaged = 0;
        List<Map<String, Object>> rows = new ArrayList<>();
        for (Equipment e : list) {
            value = value.add(price(e));
            switch (e.getStatus()) {
                case AVAILABLE -> available++;
                case IN_USE -> inUse++;
                case UNDER_MAINTENANCE -> maint++;
                case DAMAGED -> damaged++;
                default -> { }
            }
            rows.add(row("id", e.getEquipmentId(), "name", e.getName(), "category", e.getCategory(),
                    "serial", e.getSerialNumber(), "model", e.getModelNumber(), "manufacturer", e.getManufacturer(),
                    "location", e.getLocation(), "status", e.getStatus().name(),
                    "condition", e.getCondition() == null ? null : pretty(e.getCondition().name()),
                    "assignedTo", e.getAssignedTo(),
                    "purchaseDate", e.getPurchaseDate(), "price", price(e),
                    "warranty", e.getWarrantyUntil(), "lastMaint", e.getLastMaintenance(),
                    "nextMaint", e.getNextMaintenance()));
        }
        return build(spec, period, List.of(
                        col("id", "ID", "text"), col("name", "Equipment", "text"), col("category", "Category", "text"),
                        col("serial", "Serial no.", "text"), col("model", "Model", "text"),
                        col("manufacturer", "Manufacturer", "text"), col("location", "Location", "text"),
                        col("status", "Status", "status"), col("condition", "Condition", "text"),
                        col("assignedTo", "Assigned to", "text"), col("purchaseDate", "Purchased", "date"),
                        col("price", "Purchase price", "money"), col("warranty", "Warranty until", "date"),
                        col("lastMaint", "Last maintenance", "date"), col("nextMaint", "Next maintenance", "date")),
                rows, List.of(stat("Items", list.size(), "int"), stat("Purchase value", value, "money"),
                        stat("Available", available, "int"), stat("In use", inUse, "int"),
                        stat("Under maintenance", maint, "int"), stat("Damaged", damaged, "int")));
    }

    private ReportResponse stockReport(Spec spec, String period, String f) {
        List<StockItem> list = items.findAllByOrderByIdAsc().stream()
                .filter(StockItem::isActive)
                .filter(s -> f == null || s.stockStatus().equals(f) || s.expiryStatus().equals(f)).toList();

        BigDecimal total = BigDecimal.ZERO;
        long low = 0, out = 0, expiry = 0;
        List<Map<String, Object>> rows = new ArrayList<>();
        for (StockItem s : list) {
            BigDecimal value = s.getUnitPrice().multiply(BigDecimal.valueOf(s.getQuantity()));
            total = total.add(value);
            if (s.stockStatus().equals("LOW_STOCK")) low++;
            if (s.stockStatus().equals("OUT_OF_STOCK")) out++;
            if (s.expiryStatus().equals("EXPIRED") || s.expiryStatus().equals("EXPIRING_SOON")) expiry++;
            rows.add(row("id", s.getItemCode(), "name", s.getName(), "category", s.getCategory(),
                    "unit", s.getUnit(), "qty", s.getQuantity(), "reorder", s.getReorderLevel(),
                    "price", s.getUnitPrice(), "value", value, "status", s.stockStatus(),
                    "expiry", s.getExpiryDate(), "expiryStatus", "NO_EXPIRY".equals(s.expiryStatus()) ? null : s.expiryStatus(),
                    "location", s.getLocation()));
        }
        return build(spec, period, List.of(
                        col("id", "Code", "text"), col("name", "Item", "text"), col("category", "Category", "text"),
                        col("unit", "Unit", "text"), col("qty", "Quantity", "int"), col("reorder", "Reorder level", "int"),
                        col("price", "Unit price", "money"), col("value", "Stock value", "money"),
                        col("status", "Stock status", "status"), col("expiry", "Expiry date", "date"),
                        col("expiryStatus", "Expiry status", "status"), col("location", "Location", "text")),
                rows, List.of(stat("Items", list.size(), "int"), stat("Low stock", low, "int"),
                        stat("Out of stock", out, "int"), stat("Expired / expiring soon", expiry, "int"),
                        stat("Stock value", total, "money")));
    }

    private ReportResponse movementReport(Spec spec, String period, String f, LocalDate from, LocalDate to) {
        List<StockMovement> list = movements
                .findByCreatedAtBetweenOrderByIdDesc(from.atStartOfDay(), to.atTime(LocalTime.MAX)).stream()
                .filter(m -> f == null || m.getType().name().equals(f)).toList();

        Map<MovementType, Long> units = new EnumMap<>(MovementType.class);
        List<Map<String, Object>> rows = new ArrayList<>();
        for (StockMovement m : list) {
            units.merge(m.getType(), (long) m.getQuantity(), Long::sum);
            rows.add(row("date", m.getCreatedAt().format(STAMP), "id", m.getItem().getItemCode(),
                    "name", m.getItem().getName(), "type", m.getType().name(), "qty", m.getQuantity(),
                    "after", m.getQuantityAfter(), "from", m.getFromDepartment(), "to", m.getToDepartment(),
                    "reference", m.getReference(), "remarks", m.getRemarks(), "by", m.getPerformedBy()));
        }
        return build(spec, period, List.of(
                        col("date", "Date & time", "text"), col("id", "Item code", "text"), col("name", "Item", "text"),
                        col("type", "Movement", "status"), col("qty", "Quantity", "int"),
                        col("after", "Stock after", "int"), col("from", "From", "text"), col("to", "To", "text"),
                        col("reference", "Reference", "text"), col("remarks", "Remarks", "text"),
                        col("by", "Recorded by", "text")),
                rows, List.of(stat("Movements", list.size(), "int"),
                        stat("Units received", units.getOrDefault(MovementType.RECEIVED, 0L), "int"),
                        stat("Units issued", units.getOrDefault(MovementType.ISSUED, 0L), "int"),
                        stat("Units returned", units.getOrDefault(MovementType.RETURNED, 0L), "int"),
                        stat("Units transferred", units.getOrDefault(MovementType.TRANSFERRED, 0L), "int")));
    }

    private ReportResponse assignmentReport(Spec spec, String period, String f, LocalDate from, LocalDate to) {
        List<AssignmentResponse> list = assignments.findByAssignedDateBetweenOrderByIdDesc(from, to).stream()
                .map(AssignmentResponse::from)
                .filter(a -> f == null || a.status().name().equals(f)).toList();

        long active = 0, returned = 0, transferred = 0, overdue = 0;
        List<Map<String, Object>> rows = new ArrayList<>();
        for (AssignmentResponse a : list) {
            switch (a.status()) {
                case ACTIVE -> active++;
                case RETURNED -> returned++;
                case TRANSFERRED -> transferred++;
            }
            if (a.overdue()) overdue++;
            rows.add(row("id", a.id(), "equipmentId", a.equipmentId(), "equipment", a.equipmentName(),
                    "assignee", a.staffName() != null ? a.staffName() : a.department(),
                    "department", a.department(), "location", a.location(), "assigned", a.assignedDate(),
                    "expected", a.expectedReturnDate(), "returned", a.returnedDate(),
                    "status", a.status().name(), "days", a.daysOut(), "overdue", a.overdue() ? "Yes" : "",
                    "condition", a.returnCondition() == null ? null : pretty(a.returnCondition().name())));
        }
        return build(spec, period, List.of(
                        col("id", "Assignment", "text"), col("equipmentId", "Equipment ID", "text"),
                        col("equipment", "Equipment", "text"), col("assignee", "Assigned to", "text"),
                        col("department", "Department", "text"), col("location", "Location", "text"),
                        col("assigned", "Assigned on", "date"), col("expected", "Expected return", "date"),
                        col("returned", "Returned / transferred", "date"), col("status", "Status", "status"),
                        col("days", "Days out", "int"), col("overdue", "Overdue", "text"),
                        col("condition", "Condition on return", "text")),
                rows, List.of(stat("Assignments", list.size(), "int"), stat("Still active", active, "int"),
                        stat("Returned", returned, "int"), stat("Transferred", transferred, "int"),
                        stat("Overdue returns", overdue, "int")));
    }

    private ReportResponse maintenanceReport(Spec spec, String period, String f, LocalDate from, LocalDate to) {
        List<MaintenanceResponse> list = maintenance.findByScheduledDateBetweenOrderByIdDesc(from, to).stream()
                .map(MaintenanceResponse::from)
                .filter(m -> f == null || m.status().name().equals(f)).toList();

        long completed = 0, open = 0, overdue = 0;
        BigDecimal cost = BigDecimal.ZERO;
        List<Map<String, Object>> rows = new ArrayList<>();
        for (MaintenanceResponse m : list) {
            if (m.status() == MaintenanceStatus.COMPLETED) {
                completed++;
                if (m.cost() != null) cost = cost.add(m.cost());
            }
            if (m.status() == MaintenanceStatus.SCHEDULED || m.status() == MaintenanceStatus.IN_PROGRESS) open++;
            if (m.overdue()) overdue++;
            rows.add(row("id", m.id(), "equipmentId", m.equipmentId(), "equipment", m.equipmentName(),
                    "type", pretty(m.type().name()), "priority", pretty(m.priority().name()),
                    "status", m.status().name(), "scheduled", m.scheduledDate(), "started", m.startedDate(),
                    "completed", m.completedDate(), "assignedTo", m.assignedTo(), "cost", m.cost(),
                    "requestedBy", m.requestedBy(), "description", m.description()));
        }
        return build(spec, period, List.of(
                        col("id", "Job", "text"), col("equipmentId", "Equipment ID", "text"),
                        col("equipment", "Equipment", "text"), col("type", "Type", "text"),
                        col("priority", "Priority", "text"), col("status", "Status", "status"),
                        col("scheduled", "Scheduled", "date"), col("started", "Started", "date"),
                        col("completed", "Completed", "date"), col("assignedTo", "Assigned to", "text"),
                        col("cost", "Cost", "money"), col("requestedBy", "Requested by", "text"),
                        col("description", "Work / fault", "text")),
                rows, List.of(stat("Jobs", list.size(), "int"), stat("Completed", completed, "int"),
                        stat("Open", open, "int"), stat("Overdue", overdue, "int"),
                        stat("Cost of completed work", cost, "money")));
    }

    private ReportResponse purchaseReport(Spec spec, String period, String f, LocalDate from, LocalDate to) {
        List<PurchaseOrderResponse> list = orders.findByOrderDateBetweenOrderByIdDesc(from, to).stream()
                .map(p -> PurchaseOrderResponse.from(p, List.of()))
                .filter(p -> f == null || p.status().name().equals(f)).toList();

        BigDecimal ordered = BigDecimal.ZERO, received = BigDecimal.ZERO;
        long pendingUnits = 0, overdue = 0;
        List<Map<String, Object>> rows = new ArrayList<>();
        for (PurchaseOrderResponse p : list) {
            boolean placed = p.status() != PurchaseOrderStatus.DRAFT && p.status() != PurchaseOrderStatus.CANCELLED;
            if (placed) ordered = ordered.add(p.totalAmount());
            received = received.add(p.receivedAmount());
            if (p.status() == PurchaseOrderStatus.ORDERED || p.status() == PurchaseOrderStatus.PARTIALLY_RECEIVED)
                pendingUnits += p.pendingQty();
            if (p.overdue()) overdue++;
            rows.add(row("id", p.id(), "supplier", p.supplierName(), "orderDate", p.orderDate(),
                    "expected", p.expectedDate(), "status", p.status().name(), "orderedQty", p.orderedQty(),
                    "receivedQty", p.receivedQty(), "pendingQty", p.pendingQty(), "total", p.totalAmount(),
                    "receivedValue", p.receivedAmount(), "overdue", p.overdue() ? "Yes" : "",
                    "createdBy", p.createdBy()));
        }
        return build(spec, period, List.of(
                        col("id", "PO", "text"), col("supplier", "Supplier", "text"), col("orderDate", "Order date", "date"),
                        col("expected", "Expected", "date"), col("status", "Status", "status"),
                        col("orderedQty", "Units ordered", "int"), col("receivedQty", "Units received", "int"),
                        col("pendingQty", "Units pending", "int"), col("total", "Order value", "money"),
                        col("receivedValue", "Received value", "money"), col("overdue", "Overdue", "text"),
                        col("createdBy", "Created by", "text")),
                rows, List.of(stat("Orders", list.size(), "int"), stat("Value ordered", ordered, "money"),
                        stat("Value received", received, "money"), stat("Units still pending", pendingUnits, "int"),
                        stat("Overdue orders", overdue, "int")));
    }

    private ReportResponse valuationReport(Spec spec, String period) {
        Map<String, Agg> equipmentByCategory = new TreeMap<>();
        for (Equipment e : equipment.findAllByOrderByIdAsc()) {
            if (e.getStatus() == EquipmentStatus.LOST || e.getStatus() == EquipmentStatus.RETIRED
                    || e.getStatus() == EquipmentStatus.DISPOSED) continue;
            equipmentByCategory.computeIfAbsent(e.getCategory(), k -> new Agg()).add(1, price(e));
        }
        Map<String, Agg> stockByCategory = new TreeMap<>();
        for (StockItem s : items.findAllByOrderByIdAsc()) {
            if (!s.isActive()) continue;
            stockByCategory.computeIfAbsent(s.getCategory(), k -> new Agg())
                    .add(s.getQuantity(), s.getUnitPrice().multiply(BigDecimal.valueOf(s.getQuantity())));
        }

        List<Map<String, Object>> rows = new ArrayList<>();
        BigDecimal equipmentValue = BigDecimal.ZERO, stockValue = BigDecimal.ZERO;
        long equipmentCount = 0, stockUnits = 0;
        for (Map.Entry<String, Agg> en : equipmentByCategory.entrySet()) {
            Agg a = en.getValue();
            equipmentValue = equipmentValue.add(a.value);
            equipmentCount += a.units;
            rows.add(row("kind", "Equipment", "category", en.getKey(), "units", a.units, "value", a.value));
        }
        for (Map.Entry<String, Agg> en : stockByCategory.entrySet()) {
            Agg a = en.getValue();
            stockValue = stockValue.add(a.value);
            stockUnits += a.units;
            rows.add(row("kind", "Stock", "category", en.getKey(), "units", a.units, "value", a.value));
        }
        return build(spec, period, List.of(
                        col("kind", "Type", "text"), col("category", "Category", "text"),
                        col("units", "Items / units", "int"), col("value", "Value", "money")),
                rows, List.of(stat("Equipment value", equipmentValue, "money"), stat("Stock value", stockValue, "money"),
                        stat("Total inventory value", equipmentValue.add(stockValue), "money"),
                        stat("Equipment items", equipmentCount, "int"), stat("Stock units", stockUnits, "int")));
    }

    // ------------------------------------------------------------ helpers

    private static BigDecimal price(Equipment e) {
        return e.getPurchasePrice() == null ? BigDecimal.ZERO : e.getPurchasePrice();
    }

    private static final class Agg {
        long units;
        BigDecimal value = BigDecimal.ZERO;

        void add(long u, BigDecimal v) {
            units += u;
            value = value.add(v);
        }
    }

    private ReportResponse build(Spec spec, String period, List<Column> columns,
                                 List<Map<String, Object>> rows, List<Stat> summary) {
        boolean truncated = rows.size() > MAX_ROWS;
        return new ReportResponse(spec.key(), spec.title(), period, LocalDateTime.now().format(STAMP), columns,
                truncated ? new ArrayList<>(rows.subList(0, MAX_ROWS)) : rows, summary, truncated);
    }

    private static Map<String, Object> row(Object... keyValues) {
        Map<String, Object> m = new LinkedHashMap<>();
        for (int i = 0; i < keyValues.length; i += 2) m.put((String) keyValues[i], keyValues[i + 1]);
        return m;
    }

    private static Column col(String key, String label, String type) {
        return new Column(key, label, type);
    }

    private static Stat stat(String label, Object value, String type) {
        return new Stat(label, value, type);
    }

    private static <E extends Enum<E>> List<String> names(E[] values) {
        return Arrays.stream(values).map(Enum::name).toList();
    }

    /** IN_USE -> "In Use" */
    private static String pretty(String enumName) {
        StringBuilder sb = new StringBuilder();
        for (String part : enumName.toLowerCase().split("_")) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
        }
        return sb.toString();
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

    private static ApiException bad(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}