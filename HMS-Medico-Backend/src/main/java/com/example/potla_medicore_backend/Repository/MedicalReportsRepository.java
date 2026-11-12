package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.MedicalReports;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MedicalReportsRepository extends JpaRepository<MedicalReports, Long> {


    List<MedicalReports> findByPatientId(Long patientId);
}
