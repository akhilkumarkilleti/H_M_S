package com.medcare.inventory.controller;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.service.StockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stock")
@RequiredArgsConstructor
public class StockController {

    // who can add/edit items and record movements
    private static final String CAN_EDIT = "hasAnyRole('ADMIN','INVENTORY_MANAGER','STORE_KEEPER')";
    // who can delete items
    private static final String CAN_DELETE = "hasAnyRole('ADMIN','INVENTORY_MANAGER')";

    private final StockService service;

    // ----- items (everyone logged in can read)
    @GetMapping("/items")
    public List<StockItemResponse> items() {
        return service.listItems();
    }

    @GetMapping("/items/{id}")
    public StockItemResponse item(@PathVariable String id) {
        return service.getItem(id);
    }

    @PostMapping("/items")
    @PreAuthorize(CAN_EDIT)
    @ResponseStatus(HttpStatus.CREATED)
    public StockItemResponse create(@Valid @RequestBody StockItemRequest request, Authentication auth) {
        return service.createItem(request, auth.getName());
    }

    @PutMapping("/items/{id}")
    @PreAuthorize(CAN_EDIT)
    public StockItemResponse update(@PathVariable String id, @Valid @RequestBody StockItemRequest request) {
        return service.updateItem(id, request);
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize(CAN_DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.deleteItem(id);
    }

    // ----- movements: received / issued / returned / transferred
    @PostMapping("/items/{id}/movements")
    @PreAuthorize(CAN_EDIT)
    @ResponseStatus(HttpStatus.CREATED)
    public StockMovementResponse move(@PathVariable String id, @Valid @RequestBody StockMovementRequest request,
                                      Authentication auth) {
        return service.move(id, request, auth.getName());
    }

    @GetMapping("/items/{id}/movements")
    public List<StockMovementResponse> itemMovements(@PathVariable String id) {
        return service.listMovements(id);
    }

    @GetMapping("/movements")
    public List<StockMovementResponse> movements() {
        return service.listMovements(null);
    }

    // ----- dashboard numbers
    @GetMapping("/summary")
    public StockSummaryResponse summary() {
        return service.summary();
    }
}
