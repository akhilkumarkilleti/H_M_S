package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.Doctor;
import com.example.potla_medicore_backend.Entity.DoctorStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByEmail(String email);
    boolean existsByEmail(String email);
    boolean existsByPhoneNumber(String phoneNumber);
    List<Doctor> findByStatus(DoctorStatus status);
    List<Doctor> findByStatusOrderByCreatedAtDesc(DoctorStatus status);
    List<Doctor> findByStatusOrderByFullNameAsc(DoctorStatus status);
}
