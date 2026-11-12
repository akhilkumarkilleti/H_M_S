package com.medcare.inventory.controller;

import com.medcare.inventory.dto.EquipmentRequest;
import com.medcare.inventory.dto.EquipmentResponse;
import com.medcare.inventory.service.EquipmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/equipment")
@RequiredArgsConstructor
public class EquipmentController {

    // who can add / edit
    private static final String CAN_EDIT =
            "hasAnyRole('ADMIN','INVENTORY_MANAGER','STORE_KEEPER','MAINTENANCE_ENGINEER')";
    // who can delete permanently
    private static final String CAN_DELETE = "hasAnyRole('ADMIN','INVENTORY_MANAGER')";

    private final EquipmentService service;

    @GetMapping
    public List<EquipmentResponse> list() {
        return service.list();
    }

    @GetMapping("/{id}")
    public EquipmentResponse get(@PathVariable String id) {
        return service.get(id);
    }

    @PostMapping
    @PreAuthorize(CAN_EDIT)
    @ResponseStatus(HttpStatus.CREATED)
    public EquipmentResponse create(@Valid @RequestBody EquipmentRequest request) {
        return service.create(request);
    }

    @PutMapping("/{id}")
    @PreAuthorize(CAN_EDIT)
    public EquipmentResponse update(@PathVariable String id, @Valid @RequestBody EquipmentRequest request) {
        return service.update(id, request);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize(CAN_DELETE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String id) {
        service.delete(id);
    }
}