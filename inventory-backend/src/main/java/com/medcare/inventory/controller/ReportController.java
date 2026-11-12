package com.medcare.inventory.controller;

import com.medcare.inventory.dto.ReportInfo;
import com.medcare.inventory.dto.ReportResponse;
import com.medcare.inventory.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('ADMIN','INVENTORY_MANAGER','STORE_KEEPER','MAINTENANCE_ENGINEER')")
public class ReportController {

    private final ReportService service;

    /** The reports this user is allowed to open (the service decides per report). */
    @GetMapping
    public List<ReportInfo> catalog(Authentication auth) {
        return service.catalog(roles(auth));
    }

    @GetMapping("/{key}")
    public ReportResponse run(@PathVariable String key,
                              @RequestParam(required = false) String from,
                              @RequestParam(required = false) String to,
                              @RequestParam(required = false) String filter,
                              Authentication auth) {
        return service.run(key, from, to, filter, roles(auth));
    }

    private static Set<String> roles(Authentication auth) {
        return auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    }
}