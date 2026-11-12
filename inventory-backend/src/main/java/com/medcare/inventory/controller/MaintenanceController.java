package com.medcare.inventory.controller;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.service.MaintenanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
@RequiredArgsConstructor
public class MaintenanceController {

    // who can schedule, edit, start, complete and cancel work
    private static final String CAN_MANAGE = "hasAnyRole('ADMIN','INVENTORY_MANAGER','MAINTENANCE_ENGINEER')";

    private final MaintenanceService service;

    // ----- reads (everyone logged in)
    @GetMapping
    public List<MaintenanceResponse> list(@RequestParam(required = false) String equipmentId) {
        return service.list(equipmentId);
    }

    @GetMapping("/summary")
    public MaintenanceSummaryResponse summary() {
        return service.summary();
    }

    @GetMapping("/{id}")
    public MaintenanceResponse get(@PathVariable String id) {
        return service.get(id);
    }

    // ----- fault report: any logged-in user (doctors and nurses see problems first)
    @PostMapping("/repair-requests")
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceResponse repairRequest(@Valid @RequestBody RepairRequest request, Authentication auth) {
        return service.createRepairRequest(request, auth.getName());
    }

    // ----- scheduling and workflow: managers and maintenance engineers
    @PostMapping
    @PreAuthorize(CAN_MANAGE)
    @ResponseStatus(HttpStatus.CREATED)
    public MaintenanceResponse create(@Valid @RequestBody MaintenanceRequest request, Authentication auth) {
        return service.create(request, auth.getName());
    }

    @PutMapping("/{id}")
    @PreAuthorize(CAN_MANAGE)
    public MaintenanceResponse update(@PathVariable String id, @Valid @RequestBody MaintenanceRequest request) {
        return service.update(id, request);
    }

    @PutMapping("/{id}/start")
    @PreAuthorize(CAN_MANAGE)
    public MaintenanceResponse start(@PathVariable String id) {
        return service.start(id);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize(CAN_MANAGE)
    public MaintenanceResponse complete(@PathVariable String id,
                                        @Valid @RequestBody MaintenanceCompleteRequest request) {
        return service.complete(id, request);
    }

    @PutMapping("/{id}/cancel")
    @PreAuthorize(CAN_MANAGE)
    public MaintenanceResponse cancel(@PathVariable String id) {
        return service.cancel(id);
    }
}