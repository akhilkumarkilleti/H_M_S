package com.medcare.inventory.controller;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.service.PurchaseOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/purchase-orders")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','INVENTORY_MANAGER','STORE_KEEPER')")   // prices are not for everyone
public class PurchaseOrderController {

    // who can create, place, cancel and close orders (a method-level rule replaces the class-level one);
    // receiving goods is also open to the store keeper
    private static final String CAN_BUY = "hasAnyRole('ADMIN','INVENTORY_MANAGER')";

    private final PurchaseOrderService service;

    @GetMapping
    public List<PurchaseOrderResponse> list() {
        return service.list();
    }

    @GetMapping("/summary")
    public PurchaseSummaryResponse summary() {
        return service.summary();
    }

    @GetMapping("/suggestions")
    public List<ReorderSuggestion> suggestions() {
        return service.suggestions();
    }

    @GetMapping("/{id}")
    public PurchaseOrderResponse get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @PreAuthorize(CAN_BUY)
    @ResponseStatus(HttpStatus.CREATED)
    public PurchaseOrderResponse create(@Valid @RequestBody PurchaseOrderRequest request, Authentication auth) {
        return service.create(request, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize(CAN_BUY)
    public PurchaseOrderResponse update(@PathVariable String id, @Valid @RequestBody PurchaseOrderRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(CAN_BUY)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }

    @PutMapping("/{id}/place")
    @PreAuthorize(CAN_BUY)
    public PurchaseOrderResponse place(@PathVariable String id) {
        return service.place(id);
    }

    @PutMapping("/{id}/receive")
    public PurchaseOrderResponse receive(@PathVariable String id, @Valid @RequestBody PurchaseReceiveRequest request,
                                         Authentication auth) {
        return service.receive(id, request, auth.getName());
    }

    @PutMapping("/{id}/close")
    @PreAuthorize(CAN_BUY)
    public PurchaseOrderResponse close(@PathVariable String id) {
        return service.close(id);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize(CAN_BUY)
    public PurchaseOrderResponse cancel(@PathVariable String id) {
        return service.cancel(id);
    }
}
