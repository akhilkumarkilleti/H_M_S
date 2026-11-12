package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.MedicalReports;
import com.example.potla_medicore_backend.Service.MedicalReportsService;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/api/medical-reports")
@CrossOrigin(origins = "http://localhost:3000")
public class MedicalReportsController {

    private final MedicalReportsService medicalReportsService;

    public MedicalReportsController(
            MedicalReportsService medicalReportsService) {
        this.medicalReportsService = medicalReportsService;
    }


    @PostMapping("/upload/{patientId}")
    public ResponseEntity<MedicalReports> uploadReport(@PathVariable Long patientId, @RequestParam("file") MultipartFile file, Authentication authentication) throws IOException {

        MedicalReports report = medicalReportsService.uploadReport(patientId, file, authentication);
        return ResponseEntity.ok(report);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<MedicalReports>> getPatientReports(@PathVariable Long patientId) {

        List<MedicalReports> reports = medicalReportsService.getPatientReports(patientId);
        return ResponseEntity.ok(reports);
    }

    @GetMapping("/file/{fileName:.+}")
    public ResponseEntity<Resource> file(@PathVariable String fileName) throws IOException {

        Path path = Paths.get("uploads").resolve(fileName).normalize();


        if (!Files.exists(path)) {
            path = Paths.get("uploads")
                    .resolve("medical-reports")
                    .resolve(fileName)
                    .normalize();
        }

        if (!Files.exists(path) || !Files.isRegularFile(path)) {
            return ResponseEntity.notFound().build();
        }

        String contentType = Files.probeContentType(path);

        MediaType mediaType;

        if (contentType == null) {
            mediaType = MediaType.APPLICATION_OCTET_STREAM;
        } else {
            try {
                mediaType = MediaType.parseMediaType(contentType);
            } catch (Exception e) {
                mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }
        }

        Resource resource = new FileSystemResource(path);

        return ResponseEntity.ok()
                .contentType(mediaType)
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + path.getFileName() + "\""
                )
                .body(resource);
    }
}