package com.medcare.inventory.controller;

import com.medcare.inventory.dto.*;
import com.medcare.inventory.service.AssignmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@RequiredArgsConstructor
public class AssignmentController {

    // who can hand equipment out, take it back and move it between departments
    private static final String CAN_MANAGE = "hasAnyRole('ADMIN','INVENTORY_MANAGER','STORE_KEEPER')";

    private final AssignmentService service;

    // ----- reads (everyone logged in)
    @GetMapping
    public List<AssignmentResponse> list(@RequestParam(required = false) String equipmentId) {
        return service.list(equipmentId);
    }

    @GetMapping("/summary")
    public AssignmentSummaryResponse summary() {
        return service.summary();
    }

    @GetMapping("/assignees")
    public List<AssigneeResponse> assignees() {
        return service.assignees();
    }

    @GetMapping("/{id}")
    public AssignmentResponse get(@PathVariable String id) {
        return service.get(id);
    }

    // ----- workflow
    @PostMapping
    @PreAuthorize(CAN_MANAGE)
    @ResponseStatus(HttpStatus.CREATED)
    public AssignmentResponse create(@Valid @RequestBody AssignmentRequest request, Authentication auth) {
        return service.create(request, auth.getName());
    }

    @PutMapping("/{id}/return")
    @PreAuthorize(CAN_MANAGE)
    public AssignmentResponse returnEquipment(@PathVariable String id,
                                              @Valid @RequestBody AssignmentReturnRequest request,
                                              Authentication auth) {
        return service.returnEquipment(id, request, auth.getName());
    }

    @PutMapping("/{id}/transfer")
    @PreAuthorize(CAN_MANAGE)
    public AssignmentResponse transfer(@PathVariable String id, @Valid @RequestBody AssignmentRequest request,
                                       Authentication auth) {
        return service.transfer(id, request, auth.getName());
    }
}