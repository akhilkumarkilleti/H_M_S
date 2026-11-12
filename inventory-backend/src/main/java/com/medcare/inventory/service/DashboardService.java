package com.medcare.inventory.service;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.dto.DashboardResponse.Activity;
import com.medcare.inventory.dto.DashboardResponse.Alert;
import com.medcare.inventory.dto.DashboardResponse.EquipmentStats;
import com.medcare.inventory.model.*;
import com.medcare.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

    /** Roles that may see purchasing figures and prices. */
    private static final Set<String> MONEY = Set.of("ROLE_ADMIN", "ROLE_INVENTORY_MANAGER", "ROLE_STORE_KEEPER");
    private static final DateTimeFormatter STAMP = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private static final Map<String, Integer> LEVEL_RANK = Map.of("DANGER", 0, "WARN", 1, "INFO", 2);

    private final EquipmentRepository equipment;
    private final StockMovementRepository movements;
    private final MaintenanceRepository maintenance;
    private final AssignmentRepository assignments;
    private final PurchaseOrderRepository orders;
    private final MaintenanceService maintenanceService;
    private final AssignmentService assignmentService;
    private final StockService stockService;
    private final PurchaseOrderService purchaseService;

    public DashboardResponse build(Collection<String> roles) {
        boolean money = !Collections.disjoint(MONEY, roles);

        EquipmentStats eq = equipmentStats(money);
        MaintenanceSummaryResponse mt = maintenanceService.summary();
        AssignmentSummaryResponse as = assignmentService.summary();
        StockSummaryResponse st = stockService.summary();
        PurchaseSummaryResponse po = money ? purchaseService.summary() : null;

        List<MaintenanceResponse> upcoming = maintenance
                .findTop5ByStatusOrderByScheduledDateAscIdAsc(MaintenanceStatus.SCHEDULED).stream()
                .map(MaintenanceResponse::from).toList();

        List<StockItemResponse> lowStock = stockService.listItems().stream()
                .filter(i -> i.active() && ("LOW_STOCK".equals(i.stockStatus()) || "OUT_OF_STOCK".equals(i.stockStatus())))
                .sorted(Comparator.comparingInt(StockItemResponse::quantity).thenComparing(StockItemResponse::name))
                .limit(6).toList();

        return new DashboardResponse(LocalDateTime.now().format(STAMP), eq, mt, as, st, po,
                alerts(eq, mt, as, st, po), upcoming, lowStock, activity(money));
    }

    // ------------------------------------------------------------ equipment

    private EquipmentStats equipmentStats(boolean money) {
        LocalDate today = LocalDate.now();
        LocalDate in90 = today.plusDays(90);

        Map<String, Long> byStatus = new LinkedHashMap<>();
        for (EquipmentStatus s : EquipmentStatus.values()) byStatus.put(s.name(), 0L);
        Map<String, Long> byCategory = new TreeMap<>();
        BigDecimal value = BigDecimal.ZERO;
        long warranty = 0, total = 0;

        for (Equipment e : equipment.findAll()) {
            total++;
            byStatus.merge(e.getStatus().name(), 1L, Long::sum);
            boolean live = e.getStatus() != EquipmentStatus.LOST && e.getStatus() != EquipmentStatus.RETIRED
                    && e.getStatus() != EquipmentStatus.DISPOSED;
            if (!live) continue;
            byCategory.merge(e.getCategory(), 1L, Long::sum);
            if (e.getPurchasePrice() != null) value = value.add(e.getPurchasePrice());
            LocalDate w = e.getWarrantyUntil();
            if (w != null && !w.isBefore(today) && !w.isAfter(in90)) warranty++;
        }

        long inUse = byStatus.get("IN_USE"), available = byStatus.get("AVAILABLE");
        int utilization = inUse + available == 0 ? 0 : (int) Math.round(inUse * 100.0 / (inUse + available));
        List<CountItem> cats = byCategory.entrySet().stream().map(en -> new CountItem(en.getKey(), en.getValue())).toList();
        return new EquipmentStats(total, byStatus, cats, utilization, warranty, money ? value : null);
    }

    // ------------------------------------------------------------ alerts

    private List<Alert> alerts(EquipmentStats eq, MaintenanceSummaryResponse mt, AssignmentSummaryResponse as,
                               StockSummaryResponse st, PurchaseSummaryResponse po) {
        List<Alert> list = new ArrayList<>();
        add(list, mt.overdue(), "DANGER", "maintenance job", "overdue", "Scheduled work is past its date.", "/maintenance?tab=OVERDUE");
        add(list, eq.byStatus().get("DAMAGED"), "DANGER", "equipment item", "damaged", "Needs repair or replacement.", "/equipment?status=DAMAGED");
        add(list, st.outOfStock(), "DANGER", "stock item", "out of stock", "Nothing left to issue.", "/stock?status=OUT_OF_STOCK");
        add(list, st.expired(), "DANGER", "stock item", "expired", "Remove from circulation.", "/stock?status=EXPIRED");
        if (po != null)
            add(list, po.overdue(), "DANGER", "purchase order", "overdue", "Delivery date has passed.", "/purchase-orders");
        add(list, mt.dueNext7Days(), "WARN", "maintenance job", "due this week", "Plan the work and the technician.", "/maintenance?tab=SCHEDULED");
        add(list, mt.openRepairs(), "WARN", "open repair request", "waiting", "Reported faults not yet fixed.", "/maintenance");
        add(list, as.overdueReturns(), "WARN", "equipment item", "not returned on time", "Past the expected return date.", "/assignments?tab=OVERDUE");
        add(list, st.lowStock(), "WARN", "stock item", "low on stock", "At or below the reorder level.", "/stock?status=LOW_STOCK");
        add(list, st.expiringSoon(), "WARN", "stock item", "expiring soon", "Use or return before the date.", "/stock?status=EXPIRING_SOON");
        add(list, eq.byStatus().get("LOST"), "WARN", "equipment item", "reported lost", "Trace it or write it off.", "/equipment?status=LOST");
        add(list, eq.warrantyEnding(), "INFO", "warranty", "ending within 90 days", "Claim any repairs before it lapses.", "/equipment");
        list.sort(Comparator.comparing(a -> LEVEL_RANK.get(a.level())));
        return list;
    }

    private static void add(List<Alert> list, long count, String level, String noun, String what, String detail, String link) {
        if (count <= 0) return;
        String title = count == 1 ? "1 " + noun + " " + what : count + " " + plural(noun) + " " + what;
        list.add(new Alert(level, title, detail, link));
    }

    private static String plural(String noun) {
        return noun.endsWith("y") ? noun.substring(0, noun.length() - 1) + "ies" : noun + "s";
    }

    // ------------------------------------------------------------ recent activity

    private List<Activity> activity(boolean money) {
        Pageable latest = PageRequest.of(0, 8, Sort.by(Sort.Direction.DESC, "id"));
        List<Activity> list = new ArrayList<>();

        for (StockMovement m : movements.findAll(latest).getContent()) {
            list.add(new Activity(m.getCreatedAt(), "STOCK",
                    pretty(m.getType().name()) + " " + m.getQuantity() + " " + m.getItem().getUnit()
                            + " of " + m.getItem().getName(), "/stock"));
        }
        for (MaintenanceRecord m : maintenance.findAll(latest).getContent()) {
            list.add(new Activity(m.getCreatedAt(), "MAINTENANCE",
                    pretty(m.getType().name()) + " maintenance " + m.getRecordNo() + " for "
                            + m.getEquipment().getName() + " (" + pretty(m.getStatus().name()) + ")", "/maintenance"));
        }
        for (EquipmentAssignment a : assignments.findAll(latest).getContent()) {
            String to = a.getStaffName() != null ? a.getStaffName() : a.getDepartment();
            list.add(new Activity(a.getCreatedAt(), "ASSIGNMENT",
                    a.getEquipment().getName() + " assigned to " + to + " (" + a.getAssignmentNo() + ")", "/assignments"));
        }
        if (money) {
            for (PurchaseOrder p : orders.findAll(latest).getContent()) {
                list.add(new Activity(p.getCreatedAt(), "PURCHASE",
                        "Purchase order " + p.getPoNumber() + " for " + p.getSupplier().getName()
                                + " (" + pretty(p.getStatus().name()) + ")", "/purchase-orders"));
            }
        }
        list.sort(Comparator.comparing(Activity::at).reversed());
        return list.size() > 10 ? new ArrayList<>(list.subList(0, 10)) : list;
    }

    /** IN_PROGRESS -> "In Progress" */
    private static String pretty(String enumName) {
        StringBuilder sb = new StringBuilder();
        for (String part : enumName.toLowerCase().split("_")) {
            if (sb.length() > 0) sb.append(' ');
            sb.append(Character.toUpperCase(part.charAt(0))).append(part.substring(1));
        }
        return sb.toString();
    }
}