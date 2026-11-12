package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.*;
import org.springframework.http.*;
import java.nio.file.*;
import org.springframework.security.core.Authentication;
import java.util.*;

@RestController
@RequestMapping("/api/patient-records")
@CrossOrigin(origins="http://localhost:3000")
public class PatientRecordsController {
 private final PatientRepository patients;
 private final VitalSignRepository vitals;
 private final LabReportRepository reports;
 private final PrescriptionRepository prescriptions;
 private final LabTestRepository tests;
 public PatientRecordsController(PatientRepository p,VitalSignRepository v,LabReportRepository r,PrescriptionRepository pr,LabTestRepository t){
     patients=p;vitals=v;reports=r;prescriptions=pr;tests=t;
 }
 private Patient patient(Authentication a){
     return patients.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Patient not found"));
 }

 @GetMapping("/vitals")
 public List<VitalSign> vitals(Authentication a){
     return vitals.findByPatientIdOrderByRecordedAtDesc(patient(a).getId());
 }

 @GetMapping("/reports")
 public List<LabReport> reports(Authentication a){
     return reports.findByPatientIdOrderByUploadedAtDesc(patient(a).getId());
 }

 @GetMapping("/lab-tests")
 public List<LabTest> labTests(Authentication a){
     return tests.findByPatientIdOrderBySuggestedAtDesc(patient(a).getId());
 }

 @GetMapping("/reports/{id}/file")
 public ResponseEntity<Resource> reportFile(@PathVariable Long id,Authentication a) throws Exception {
   Patient p=patient(a); LabReport r=reports.findById(id).orElseThrow(()->new RuntimeException("Report not found"));
   if(!r.getPatientId().equals(p.getId())) throw new RuntimeException("Report does not belong to this patient");
   Path path=Paths.get("uploads").resolve(r.getFileName()).normalize(); if(!Files.exists(path)) throw new RuntimeException("Report file not found");
   return ResponseEntity.ok().contentType(MediaType.parseMediaType(r.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION,"inline").body(new FileSystemResource(path));
 }

 @GetMapping("/reports/file/{id}")
 public ResponseEntity<Resource> viewReportForAuthenticatedUser(@PathVariable Long id) throws Exception {
   LabReport r=reports.findById(id).orElseThrow(()->new RuntimeException("Report not found"));
   Path path=Paths.get("uploads").resolve(r.getFileName()).normalize();
   if(!Files.exists(path)) throw new RuntimeException("Report file not found");
   return ResponseEntity.ok().contentType(MediaType.parseMediaType(r.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION,"inline").body(new FileSystemResource(path));
 }

 @GetMapping("/prescriptions")
 public List<Prescription> prescriptions(Authentication a){
     return prescriptions.findByPatientIdOrderByPrescribedAtDesc(patient(a).getId());
 }


}
