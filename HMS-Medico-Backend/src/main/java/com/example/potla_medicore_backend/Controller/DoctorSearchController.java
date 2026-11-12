package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.Doctor;
import com.example.potla_medicore_backend.Service.DoctorSearchService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/doctors")
@CrossOrigin(origins="http://localhost:3000")
public class DoctorSearchController {

    private final DoctorSearchService doctorSearchService;
    public DoctorSearchController(DoctorSearchService doctorSearchService) {
        this.doctorSearchService = doctorSearchService;
    }

    @GetMapping
    public ResponseEntity<List<Doctor>> getApprovedDoctors() {
        return ResponseEntity.ok(doctorSearchService.getApprovedDoctors());
    }
}
