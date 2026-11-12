package com.medcare.inventory.controller;

import com.medcare.inventory.dto.SupplierRequest;
import com.medcare.inventory.dto.SupplierResponse;
import com.medcare.inventory.service.SupplierService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','INVENTORY_MANAGER','STORE_KEEPER')")
public class SupplierController {

    // who can add and change suppliers (a method-level rule replaces the class-level one)
    private static final String CAN_BUY = "hasAnyRole('ADMIN','INVENTORY_MANAGER')";

    private final SupplierService service;

    @GetMapping
    public List<SupplierResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public SupplierResponse get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @PreAuthorize(CAN_BUY)
    @ResponseStatus(HttpStatus.CREATED)
    public SupplierResponse create(@Valid @RequestBody SupplierRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize(CAN_BUY)
    public SupplierResponse update(@PathVariable String id, @Valid @RequestBody SupplierRequest request) {
        return service.update(id, request);
    }
}