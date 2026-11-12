package com.example.potla_medicore_backend.Repository;
import com.example.potla_medicore_backend.Entity.Prescription;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatientIdOrderByPrescribedAtDesc(Long patientId);
    List<Prescription> findByDoctorIdOrderByPrescribedAtDesc(Long doctorId);
    List<Prescription> findAllByOrderByPrescribedAtDesc();
    void deleteByDoctorId(Long doctorId);
}
