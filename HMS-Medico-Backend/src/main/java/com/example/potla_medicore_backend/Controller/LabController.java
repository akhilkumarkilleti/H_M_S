package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.StaffPatientDTO;
import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.ActivityLogService;
import com.example.potla_medicore_backend.Service.FileStorageService;
import com.example.potla_medicore_backend.Service.BillingService;
import org.springframework.core.io.*;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.Authentication;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/lab")
@CrossOrigin(origins="http://localhost:3000")
public class LabController {

    private final PatientRepository patients;
    private final LabReportRepository reports;
    private final LabTestRepository tests;
    private final UserRepository users;
    private final FileStorageService storage;
    private final ActivityLogService activityLogService;
    private final BillingService billingService;


    public LabController(PatientRepository p,LabReportRepository r,LabTestRepository t,UserRepository u,FileStorageService s,ActivityLogService activityLogService,BillingService billingService){
        patients=p;reports=r;tests=t;users=u;storage=s;this.activityLogService=activityLogService;this.billingService=billingService;
    }

    @GetMapping("/patients")
    public List<StaffPatientDTO> patients(){
        List<Long> ids=tests.findAllByOrderBySuggestedAtDesc().stream()
                .filter(t -> "SUGGESTED".equalsIgnoreCase(t.getStatus()) || "WAITING_FOR_RESULT".equalsIgnoreCase(t.getStatus()))
                .peek(t -> t.setPaymentStatus(billingService.getServiceInvoiceStatus("LAB_TEST", t.getId())))
                .map(LabTest::getPatientId).distinct().toList();
        return ids.stream().map(patients::findById).filter(java.util.Optional::isPresent).map(java.util.Optional::get).map(this::dto).toList();
    }

    @GetMapping("/history")
    public List<LabTest> history(){ return tests.findAllByOrderBySuggestedAtDesc().stream().filter(t -> billingService.isServiceInvoicePaid("LAB_TEST", t.getId())).toList(); }

    @GetMapping("/doctors/active")
    public List<?> activeDoctors(){
        return java.util.List.of();
    }

    @GetMapping("/patients/{id}/reports")
    public List<LabReport> reports(@PathVariable Long id){
        ensureAssigned(id);
        return reports.findByPatientIdOrderByUploadedAtDesc(id);
    }

    @GetMapping("/tests")
    public List<LabTest> pendingTests(){
        return tests.findByStatusOrderBySuggestedAtDesc("SUGGESTED").stream().peek(t -> t.setPaymentStatus(billingService.getServiceInvoiceStatus("LAB_TEST", t.getId()))).toList();
    }

    @GetMapping("/patients/{id}/tests")
    public List<LabTest> patientTests(@PathVariable Long id){
        ensureAssigned(id);
        return tests.findByPatientIdOrderBySuggestedAtDesc(id).stream()
                .filter(t -> "SUGGESTED".equalsIgnoreCase(t.getStatus())
                        || "WAITING_FOR_RESULT".equalsIgnoreCase(t.getStatus()))
                .peek(t -> t.setPaymentStatus(billingService.getServiceInvoiceStatus("LAB_TEST", t.getId())))
                .toList();
    }


    @PostMapping(value="/reports",consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestParam Long patientId,@RequestParam String reportName,@RequestParam(required=false) Long labTestId,@RequestParam MultipartFile file,Authentication a) {
        try {
            ensureAssigned(patientId);
            if(labTestId==null) throw new RuntimeException("Select the assigned lab test before uploading the report");
            if(file==null||file.isEmpty()) throw new RuntimeException("Report photo is required");
            String ct=file.getContentType()==null?"":file.getContentType().toLowerCase();
            if(!ct.equals("image/jpeg")&&!ct.equals("image/png")&&!ct.equals("image/webp")&&!ct.equals("application/pdf")) throw new RuntimeException("Only JPG, PNG, WEBP or PDF reports are allowed");
            if(file.getSize()>10*1024*1024) throw new RuntimeException("Report must be 10 MB or smaller");
            User lab=users.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            LabReport r=new LabReport();r.setPatientId(patientId);r.setLabUserId(lab.getId());r.setLabTestId(labTestId);r.setReportName(reportName.trim());r.setFileName(storage.saveFile(file));r.setContentType(ct);
            if(labTestId!=null){
                LabTest t=tests.findById(labTestId).orElseThrow(()->new RuntimeException("Lab test not found"));
                if(!t.getPatientId().equals(patientId)) throw new RuntimeException("Lab test does not belong to this patient");
                if(!billingService.isServiceInvoicePaid("LAB_TEST",t.getId())) throw new RuntimeException("Patient payment is required before uploading this report");
                if(!"WAITING_FOR_RESULT".equalsIgnoreCase(t.getStatus())) throw new RuntimeException("Initialize the lab test after sample collection before uploading the result");
                t.setStatus("DONE"); t.setCompletedAt(java.time.LocalDateTime.now()); tests.save(t);
            }
            LabReport saved=reports.save(r); activityLogService.log(a,patientId,"LAB","REPORT_UPLOADED","Lab report " + reportName.trim() + " uploaded" + (labTestId!=null?" and lab test completed":"")); return ResponseEntity.ok(saved);
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }
    @PutMapping(value="/reports/{id}/replace", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> replaceReport(@PathVariable Long id,@RequestParam String reportName,@RequestParam MultipartFile file,Authentication a){
        try {
            User lab=users.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            LabReport r=reports.findById(id).orElseThrow(()->new RuntimeException("Report not found"));
            if(!r.getLabUserId().equals(lab.getId())) throw new RuntimeException("You can replace only reports uploaded by your lab account");
            if(file==null || file.isEmpty()) throw new RuntimeException("Replacement report file is required");
            String ct=file.getContentType()==null?"":file.getContentType().toLowerCase();
            if(!ct.equals("image/jpeg")&&!ct.equals("image/png")&&!ct.equals("image/webp")&&!ct.equals("application/pdf")) throw new RuntimeException("Only JPG, PNG, WEBP or PDF reports are allowed");
            if(file.getSize()>10*1024*1024) throw new RuntimeException("Report must be 10 MB or smaller");
            Path old=Paths.get("uploads").resolve(r.getFileName()).normalize();
            try { Files.deleteIfExists(old); } catch(Exception ignored) {}
            r.setReportName(reportName.trim()); r.setFileName(storage.saveFile(file)); r.setContentType(ct);
            LabReport saved=reports.save(r);
            activityLogService.log(a,r.getPatientId(),"LAB","REPORT_REPLACED","Lab report replaced: "+r.getReportName());
            return ResponseEntity.ok(saved);
        } catch(Exception e){ return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); }
    }

    @DeleteMapping("/reports/{id}")
    public ResponseEntity<?> deleteReport(@PathVariable Long id, Authentication a){
        try {
            User lab=users.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            LabReport r=reports.findById(id).orElseThrow(()->new RuntimeException("Report not found"));
            if(!r.getLabUserId().equals(lab.getId())) throw new RuntimeException("You can delete only reports uploaded by your lab account");
            Path path=Paths.get("uploads").resolve(r.getFileName()).normalize();
            try { Files.deleteIfExists(path); } catch(Exception ignored) {}
            reports.delete(r);
            activityLogService.log(a,r.getPatientId(),"LAB","REPORT_DELETED","Lab report deleted: " + r.getReportName());
            return ResponseEntity.ok(Map.of("message","Lab report deleted successfully"));
        } catch(Exception e){ return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); }
    }

    @GetMapping("/reports/{id}/file")
    public ResponseEntity<Resource> file(@PathVariable Long id) throws Exception {
        LabReport r=reports.findById(id).orElseThrow(()->new RuntimeException("Report not found"));
        Path path=Paths.get("uploads").resolve(r.getFileName()).normalize();
        if(!Files.exists(path)) throw new RuntimeException("Report file not found");
        Resource resource=new FileSystemResource(path);
        return ResponseEntity.ok().contentType(MediaType.parseMediaType(r.getContentType())).header(HttpHeaders.CONTENT_DISPOSITION,"inline; filename=\""+r.getFileName()+"\"").body(resource);
    }


    private void ensureAssigned(Long patientId){
        boolean assigned=tests.findByPatientIdOrderBySuggestedAtDesc(patientId).stream()
                .anyMatch(t -> billingService.isServiceInvoicePaid("LAB_TEST",t.getId()));
        if(assigned) return;
        patients.findById(patientId).orElseThrow(()->new RuntimeException("Patient not found"));
        throw new RuntimeException("This patient has no paid lab tests assigned to your laboratory");
    }

    private StaffPatientDTO dto(Patient p){return new StaffPatientDTO(p.getId(),p.getPatientName(),p.getPhoneNumber(),p.getPatientGender(),p.getPatientAge(),p.getEmail());}
}
