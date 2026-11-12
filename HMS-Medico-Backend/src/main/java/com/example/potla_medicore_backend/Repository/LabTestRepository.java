package com.example.potla_medicore_backend.Repository;
import com.example.potla_medicore_backend.Entity.LabTest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface LabTestRepository extends JpaRepository<LabTest, Long> {
    List<LabTest> findByPatientIdOrderBySuggestedAtDesc(Long patientId);
    List<LabTest> findByDoctorIdOrderBySuggestedAtDesc(Long doctorId);
    List<LabTest> findByStatusOrderBySuggestedAtDesc(String status);
    List<LabTest> findAllByOrderBySuggestedAtDesc();
    void deleteByDoctorId(Long doctorId);
}
