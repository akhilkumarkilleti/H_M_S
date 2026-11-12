package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.HealthCheckupBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface HealthCheckupBookingRepository extends JpaRepository<HealthCheckupBooking, Long> {
    List<HealthCheckupBooking> findByPatientIdOrderByCreatedAtDesc(Long patientId);
    List<HealthCheckupBooking> findAllByOrderByCreatedAtDesc();
    List<HealthCheckupBooking> findByStatusOrderByCreatedAtDesc(String status);
}
