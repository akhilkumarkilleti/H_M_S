package com.example.potla_medicore_backend.Repository;
import com.example.potla_medicore_backend.Entity.LabReport;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LabReportRepository extends JpaRepository<LabReport, Long> {
    List<LabReport> findByPatientIdOrderByUploadedAtDesc(Long patientId);
    List<LabReport> findAllByOrderByUploadedAtDesc();
}
