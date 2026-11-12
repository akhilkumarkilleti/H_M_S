package com.example.potla_medicore_backend.Repository;
import com.example.potla_medicore_backend.Entity.VitalSign;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface VitalSignRepository extends JpaRepository<VitalSign, Long> {
    List<VitalSign> findByPatientIdOrderByRecordedAtDesc(Long patientId);
    List<VitalSign> findAllByOrderByRecordedAtDesc();
}
