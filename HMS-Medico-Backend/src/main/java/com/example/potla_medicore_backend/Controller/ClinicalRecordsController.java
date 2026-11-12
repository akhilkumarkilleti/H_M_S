package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/clinical-records")
@CrossOrigin(origins = "http://localhost:3000")
public class ClinicalRecordsController {

    private final PatientRepository patients;
    private final MedicalReportsRepository oldRecords;
    private final LabReportRepository labReports;
    private final LabTestRepository labTests;
    private final PrescriptionRepository prescriptions;
    private final VitalSignRepository vitals;
    private final AppointmentRepository appointments;
    private final DoctorRepository doctors;
    private final UserRepository users;
    private final HealthCheckupBookingRepository healthCheckups;
    private final com.example.potla_medicore_backend.Service.BillingService billingService;

    public ClinicalRecordsController(PatientRepository patients, MedicalReportsRepository oldRecords, LabReportRepository labReports, LabTestRepository labTests, PrescriptionRepository prescriptions, VitalSignRepository vitals, AppointmentRepository appointments, DoctorRepository doctors, UserRepository users, HealthCheckupBookingRepository healthCheckups, com.example.potla_medicore_backend.Service.BillingService billingService) {
        this.patients = patients;
        this.oldRecords = oldRecords;
        this.labReports = labReports;
        this.labTests = labTests;
        this.prescriptions = prescriptions;
        this.vitals = vitals;
        this.appointments = appointments;
        this.doctors = doctors;
        this.users = users;
        this.healthCheckups = healthCheckups;
        this.billingService = billingService;
    }


    @GetMapping("/doctor/patient/{patientId}")
    public ResponseEntity<?> getDoctorPatientRecords(@PathVariable Long patientId, Authentication authentication) {

        Doctor doctor = doctors.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (!appointments.existsByDoctorIdAndPatientIdAndStatus(
                doctor.getId(), patientId, AppointmentStatus.CONFIRMED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("message",
                            "Patient records are available only for your confirmed patients"));
        }

        return ResponseEntity.ok(buildPatientRecords(patientId));
    }


    @GetMapping("/admin/patient/{patientId}")
    public ResponseEntity<?> getAdminPatientRecords(@PathVariable Long patientId) {
        return ResponseEntity.ok(buildPatientRecords(patientId));
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<?> getPatientRecords(@PathVariable Long patientId, Authentication authentication) {

        if (authentication == null || !authentication.isAuthenticated())
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message","Please login"));
        String role=authentication.getAuthorities().stream().findFirst().map(a->a.getAuthority().replace("ROLE_","")).orElse("");
        boolean allowed = "ADMIN".equals(role) || "MAIN_ADMIN".equals(role);
        if ("DOCTOR".equals(role)) {
            Doctor doctor = doctors.findByEmail(authentication.getName()).orElse(null);
            allowed = doctor != null && appointments.existsByDoctorIdAndPatientIdAndStatus(doctor.getId(), patientId, AppointmentStatus.CONFIRMED);
        } else if ("NURSE".equals(role)) {
            allowed = patients.findById(patientId).isPresent();
        } else if ("RECEPTION".equals(role)) {
            allowed = appointments.findByAppointmentDateGreaterThanEqualOrderByAppointmentDateAscAppointmentTimeAsc(java.time.LocalDate.now()).stream().anyMatch(a->a.getPatientId().equals(patientId));
        } else if ("LAB".equals(role)) {
            allowed = !labTests.findByPatientIdOrderBySuggestedAtDesc(patientId).isEmpty();
        } else if ("PHARMACY".equals(role)) {
            allowed = prescriptions.findByPatientIdOrderByPrescribedAtDesc(patientId).stream().findFirst().isPresent();
        }
        if (!allowed) return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of("message","This patient is not assigned to your current staff work"));
        return ResponseEntity.ok(buildPatientRecords(patientId));
    }

    private Map<String, Object> buildPatientRecords(Long patientId) {
        Patient p = patients.findById(patientId)
                .orElseThrow(() -> new RuntimeException("Patient not found"));

        Map<String, Object> patient = new LinkedHashMap<>();
        patient.put("id", p.getId());
        patient.put("patientName", p.getPatientName());
        patient.put("phoneNumber", p.getPhoneNumber());
        patient.put("patientGender", p.getPatientGender());
        patient.put("patientAge", p.getPatientAge());
        patient.put("email", p.getEmail());


        List<Map<String, Object>> old = oldRecords.findByPatientId(patientId)
                .stream()
                .map(r -> {
                    Map<String, Object> m = new LinkedHashMap<>();
                    m.put("id", r.getId());
                    m.put("fileName", r.getFileName());
                    m.put("file", r.getFile());
                    m.put("createdAt", r.getCreatedAt());
                    return m;
                })
                .toList();

        Map<String, Object> out = new LinkedHashMap<>();
        out.put("patient", patient);
        out.put("oldMedicalRecords", old);
        out.put("labTests", labTests.findByPatientIdOrderBySuggestedAtDesc(patientId).stream()
                .peek(test -> test.setPaymentStatus(billingService.getServiceInvoiceStatus("LAB_TEST", test.getId()))).toList());
        out.put("healthCheckups", healthCheckups.findByPatientIdOrderByCreatedAtDesc(patientId).stream()
                .peek(checkup -> checkup.setPaymentStatus(billingService.getServiceInvoiceStatus("HEALTH_CHECKUP", checkup.getId()))).toList());
        out.put("prescriptions", prescriptions.findByPatientIdOrderByPrescribedAtDesc(patientId).stream()
                .peek(prescription -> prescription.setPaymentStatus(billingService.getServiceInvoiceStatus("MEDICINE", prescription.getId()))).toList());
        out.put("labReports", labReports.findByPatientIdOrderByUploadedAtDesc(patientId));
        out.put("vitals", vitals.findByPatientIdOrderByRecordedAtDesc(patientId));
        return out;
    }

    @GetMapping("/admin/old-records/{id}/file")
    public ResponseEntity<Resource> adminOldRecordFile(@PathVariable Long id) throws Exception {
        MedicalReports report = oldRecords.findById(id).orElseThrow(() -> new RuntimeException("Medical record not found"));
        return fileResponse(report.getFile(), report.getFileName());
    }

    @GetMapping("/admin/lab-reports/{id}/file")
    public ResponseEntity<Resource> adminLabReportFile(@PathVariable Long id) throws Exception {
        LabReport report = labReports.findById(id).orElseThrow(() -> new RuntimeException("Lab report not found"));
        Path path = Paths.get("uploads").resolve(report.getFileName()).normalize();
        if (!Files.exists(path))
            return ResponseEntity.notFound().build();
        String contentType = report.getContentType();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (contentType != null && !contentType.isBlank()) {
            try {
                mediaType = MediaType.parseMediaType(contentType);
            } catch (Exception ignored) {} }
        return ResponseEntity.ok().contentType(mediaType).header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + path.getFileName() + "\"").body(new FileSystemResource(path));
    }

    @GetMapping("/doctor/old-records/{id}/file")
    public ResponseEntity<Resource> doctorOldRecordFile(@PathVariable Long id, Authentication authentication) throws Exception {

        Doctor doctor = doctors.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        MedicalReports report = oldRecords.findById(id)
                .orElseThrow(() -> new RuntimeException("Medical record not found"));

        Long patientId = report.getPatient().getId();

        if (!appointments.existsByDoctorIdAndPatientIdAndStatus(
                doctor.getId(), patientId, AppointmentStatus.CONFIRMED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        return fileResponse(report.getFile(), report.getFileName());
    }

    @GetMapping("/doctor/lab-reports/{id}/file")
    public ResponseEntity<Resource> doctorLabReportFile(@PathVariable Long id, Authentication authentication) throws Exception {

        Doctor doctor = doctors.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        LabReport report = labReports.findById(id)
                .orElseThrow(() -> new RuntimeException("Lab report not found"));

        if (!appointments.existsByDoctorIdAndPatientIdAndStatus(
                doctor.getId(), report.getPatientId(), AppointmentStatus.CONFIRMED)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Path path = Paths.get("uploads")
                .resolve(report.getFileName())
                .normalize();

        if (!Files.exists(path)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = report.getContentType();
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
        if (contentType != null && !contentType.isBlank()) {
            try {
                mediaType = MediaType.parseMediaType(contentType);
            } catch (Exception ignored) {
                // Keep application/octet-stream for unknown types.
            }
        }

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + path.getFileName() + "\"")
                .body(new FileSystemResource(path));
    }

    private ResponseEntity<Resource> fileResponse(String storedFileName, String originalFileName) throws Exception {

        if (storedFileName == null || storedFileName.isBlank()) {
            return ResponseEntity.notFound().build();
        }

        Path path = Paths.get("uploads")
                .resolve(storedFileName)
                .normalize();

        if (!Files.exists(path)) {
            path = Paths.get("uploads")
                    .resolve("medical-reports")
                    .resolve(storedFileName)
                    .normalize();
        }

        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(path);
        MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;

        if (contentType != null) {
            try {
                mediaType = MediaType.parseMediaType(contentType);
            } catch (Exception ignored) {
            }
        }

        String displayName = (originalFileName == null || originalFileName.isBlank())
                ? path.getFileName().toString()
                : originalFileName.replace("\"", "");

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + displayName + "\"")
                .body(new FileSystemResource(path));
    }
}
