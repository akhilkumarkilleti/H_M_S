package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.DoctorAvailability;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DoctorAvailabilityRepository extends JpaRepository<DoctorAvailability,Long> {
    Optional<DoctorAvailability> findByDoctorIdAndAvailabilityDate(Long doctorId, LocalDate date);
    List<DoctorAvailability> findByDoctorIdAndAvailabilityDateBetweenOrderByAvailabilityDateAsc(Long doctorId, LocalDate from, LocalDate to);
    List<DoctorAvailability> findByAvailabilityDateAndActiveTrue(LocalDate date);
}
