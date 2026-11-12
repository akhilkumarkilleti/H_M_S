package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Entity.Doctor;
import com.example.potla_medicore_backend.Entity.DoctorStatus;
import com.example.potla_medicore_backend.Repository.DoctorRepository;
import com.example.potla_medicore_backend.Repository.DoctorAvailabilityRepository;
import java.time.LocalDate;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorSearchService {

    private final DoctorRepository doctorRepository;
    private final DoctorAvailabilityRepository availabilityRepository;

    public DoctorSearchService(DoctorRepository doctorRepository, DoctorAvailabilityRepository availabilityRepository) {
        this.doctorRepository = doctorRepository;
        this.availabilityRepository = availabilityRepository;
    }

    public List<Doctor> getApprovedDoctors() {
        LocalDate today = LocalDate.now();
        return doctorRepository.findByStatusOrderByCreatedAtDesc(DoctorStatus.APPROVED)
                .stream()
                .filter(doctor -> availabilityRepository
                        .findByDoctorIdAndAvailabilityDate(doctor.getId(), today)
                        .map(a -> a.isActive())
                        .orElse(true))
                .toList();
    }
}
