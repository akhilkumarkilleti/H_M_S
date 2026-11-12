package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Entity.MedicalReports;
import com.example.potla_medicore_backend.Entity.Patient;
import com.example.potla_medicore_backend.Repository.MedicalReportsRepository;
import com.example.potla_medicore_backend.Repository.PatientRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class MedicalReportsService {

    private final MedicalReportsRepository medicalReportsRepository;
    private final PatientRepository patientRepository;
    private final FileStorageService fileStorageService;

    public MedicalReportsService(MedicalReportsRepository medicalReportsRepository, PatientRepository patientRepository, FileStorageService fileStorageService) {
        this.medicalReportsRepository = medicalReportsRepository;
        this.patientRepository = patientRepository;
        this.fileStorageService = fileStorageService;
    }

    public MedicalReports uploadReport(Long patientId, MultipartFile file, Authentication authentication) throws IOException {

        // 1. Find patient and make sure the logged-in patient owns the record
        Patient patient = patientRepository
                .findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        if (authentication == null || authentication.getName() == null
                || !patient.getEmail().equalsIgnoreCase(authentication.getName())) {
            throw new RuntimeException("You can upload records only to your own patient account");
        }

        // 2. Validate file
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("Please select a file");
        }

        // 3. Save file using existing FileStorageService
        String savedFileName = fileStorageService.saveFile(file);

        // 4. Create MedicalReports object
        MedicalReports report = new MedicalReports();
        report.setFileName(file.getOriginalFilename());
        report.setFile(savedFileName);
        report.setCreatedAt(LocalDateTime.now());

        report.setPatient(patient);

        // 5. Save database record
        return medicalReportsRepository.save(report);
    }

    public List<MedicalReports> getPatientReports(Long patientId) {
        return medicalReportsRepository.findByPatientId(patientId);
    }
}
