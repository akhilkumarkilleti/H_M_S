package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.ActivityLogService;
import com.example.potla_medicore_backend.Service.BillingCatalog;
import com.example.potla_medicore_backend.Service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/lab-tests")
@CrossOrigin(origins = "http://localhost:3000")
public class LabTestController {
    private final LabTestRepository tests;
    private final AppointmentRepository appointments;
    private final DoctorRepository doctors;
    private final PatientRepository patients;
    private final UserRepository users;
    private final ActivityLogService activityLogService;
    private final BillingService billingService;

    public LabTestController(LabTestRepository tests, AppointmentRepository appointments, DoctorRepository doctors, PatientRepository patients, UserRepository users, ActivityLogService activityLogService, BillingService billingService){
        this.tests=tests; this.appointments=appointments; this.doctors=doctors; this.patients=patients; this.users=users; this.activityLogService=activityLogService; this.billingService=billingService;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> suggest(@RequestBody LabTestRequest r, Authentication auth){
        try{
            if(r.appointmentId()==null) throw new RuntimeException("Appointment is required");
            List<String> requestedNames = r.testNames()!=null && !r.testNames().isEmpty()
                    ? r.testNames().stream().filter(Objects::nonNull).map(String::trim).filter(name -> !name.isBlank()).distinct().toList()
                    : (r.testName()==null || r.testName().isBlank() ? List.of() : List.of(r.testName().trim()));
            if(requestedNames.isEmpty()) throw new RuntimeException("Select at least one lab test");
            List<BillingCatalog.CatalogItem> pricedTests = requestedNames.stream()
                    .map(name -> BillingCatalog.find(BillingCatalog.LAB_TESTS,name))
                    .toList();
            if(pricedTests.stream().anyMatch(Objects::isNull)) throw new RuntimeException("Choose lab tests from the priced catalogue");
            Doctor doctor=doctors.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Doctor not found"));
            Appointment appointment=appointments.findById(r.appointmentId()).orElseThrow(()->new RuntimeException("Appointment not found"));
            if(!appointment.getDoctor().getId().equals(doctor.getId())) throw new RuntimeException("You can suggest tests only for your own appointments");
            if(appointment.getStatus()!=AppointmentStatus.CONFIRMED) throw new RuntimeException("Lab test can be suggested only for a confirmed appointment");
            List<LabTest> savedTests = new ArrayList<>();
            for (BillingCatalog.CatalogItem pricedTest : pricedTests) {
                LabTest test=new LabTest();
                test.setAppointmentId(appointment.getId()); test.setPatientId(appointment.getPatientId());
                test.setDoctorId(doctor.getId()); test.setPatientName(appointment.getPatientName());
                test.setTestName(pricedTest.name()); test.setPricePaise(pricedTest.pricePaise());
                test.setInstructions(r.instructions()); test.setStatus("SUGGESTED");
                LabTest saved=tests.save(test);
                billingService.createInvoiceForLabTest(saved);
                activityLogService.log(auth,test.getPatientId(),"LAB","TEST_SUGGESTED","Doctor suggested lab test: " + test.getTestName());
                savedTests.add(saved);
            }
            return ResponseEntity.ok(savedTests);
        }catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()==null?"Unable to suggest lab test":e.getMessage()));}
    }

    @GetMapping("/doctor/my")
    public List<LabTest> doctor(Authentication auth){
        Doctor d=doctors.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Doctor not found"));
        return tests.findByDoctorIdOrderBySuggestedAtDesc(d.getId());
    }

    @GetMapping("/patient/my")
    public List<LabTest> patient(Authentication auth){
        Patient p=patients.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Patient not found"));
        return tests.findByPatientIdOrderBySuggestedAtDesc(p.getId());
    }

    @GetMapping("/lab/pending")
    public List<LabTest> pending(){
        return tests.findAllByOrderBySuggestedAtDesc().stream()
                .filter(t -> "SUGGESTED".equalsIgnoreCase(t.getStatus()) || "WAITING_FOR_RESULT".equalsIgnoreCase(t.getStatus()))
                .peek(t -> t.setPaymentStatus(billingService.getServiceInvoiceStatus("LAB_TEST", t.getId())))
                .toList();
    }

    @GetMapping("/lab/all")
    public List<LabTest> all(){
        return tests.findAllByOrderBySuggestedAtDesc().stream()
                .peek(t -> t.setPaymentStatus(billingService.getServiceInvoiceStatus("LAB_TEST", t.getId()))).toList();
    }

    @PutMapping("/{id}/initialize")
    public ResponseEntity<?> initialize(@PathVariable Long id, Authentication auth){
        try{
            User lab=users.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            LabTest t=tests.findById(id).orElseThrow(()->new RuntimeException("Lab test not found"));
            if (!billingService.isServiceInvoicePaid("LAB_TEST", t.getId())) throw new RuntimeException("Patient payment is required before initializing this lab test");
            if (!"SUGGESTED".equalsIgnoreCase(t.getStatus())) throw new RuntimeException("Only suggested tests can be initialized");
            t.setStatus("WAITING_FOR_RESULT");
            LabTest saved=tests.save(t);
            activityLogService.log(auth,t.getPatientId(),"LAB","TEST_INITIALIZED","Lab initialized test after sample collection: " + t.getTestName());
            return ResponseEntity.ok(saved);
        }catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()==null?"Unable to initialize test":e.getMessage()));}
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id, Authentication auth){
        try{
            User lab=users.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            LabTest t=tests.findById(id).orElseThrow(()->new RuntimeException("Lab test not found"));
            if (!billingService.isServiceInvoicePaid("LAB_TEST", t.getId())) throw new RuntimeException("Patient payment is required before completing this lab test");
            t.setStatus("DONE"); t.setCompletedAt(LocalDateTime.now());
            LabTest saved=tests.save(t); activityLogService.log(auth,t.getPatientId(),"LAB","TEST_COMPLETED","Lab member completed lab test: " + t.getTestName()); return ResponseEntity.ok(saved);
        }catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()==null?"Unable to complete test":e.getMessage()));}
    }

    public record LabTestRequest(Long appointmentId,String testName,List<String> testNames,String instructions){}
}
