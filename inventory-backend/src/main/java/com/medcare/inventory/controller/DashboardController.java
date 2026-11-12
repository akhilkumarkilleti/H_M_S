package com.medcare.inventory.controller;

import com.medcare.inventory.dto.DashboardResponse;
import com.medcare.inventory.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService service;

    /** Open to every logged-in user; the service hides prices and purchasing from roles that may not see them. */
    @GetMapping
    public DashboardResponse dashboard(Authentication auth) {
        Set<String> roles = auth.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
        return service.build(roles);
    }
}