package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.StaffPatientDTO;
import com.example.potla_medicore_backend.Entity.Patient;
import com.example.potla_medicore_backend.Entity.Prescription;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.BillingService;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/pharmacy")
@CrossOrigin(origins="http://localhost:3000")
public class PharmacyController {

 private final PatientRepository patients;
 private final PrescriptionRepository prescriptions;
 private final BillingService billingService;
 public PharmacyController(PatientRepository p,PrescriptionRepository r,BillingService billingService){
     patients=p;prescriptions=r;this.billingService=billingService;
 }



 @GetMapping("/patients")
 public List<StaffPatientDTO> patients(){
     List<Long> ids=prescriptions.findAllByOrderByPrescribedAtDesc().stream().filter(p->!p.isDispensed())
             .peek(p->p.setPaymentStatus(billingService.getServiceInvoiceStatus("MEDICINE",p.getId()))).map(Prescription::getPatientId).distinct().toList();
     return ids.stream().map(patients::findById).filter(java.util.Optional::isPresent).map(java.util.Optional::get).map(this::dto).toList();
 }

 @GetMapping("/patients/{id}")
 public Map<String,Object> patient(@PathVariable Long id){
   Patient p=patients.findById(id).orElseThrow(()->new RuntimeException("Patient not found"));
   List<Prescription> assigned=prescriptions.findByPatientIdOrderByPrescribedAtDesc(id).stream().filter(prescription->!prescription.isDispensed())
           .peek(prescription->prescription.setPaymentStatus(billingService.getServiceInvoiceStatus("MEDICINE",prescription.getId()))).toList();
   if(assigned.isEmpty()) throw new RuntimeException("Patient is not assigned to your pharmacy work");
   return Map.of("patient",dto(p),"prescriptions",assigned);
 }

 @GetMapping("/prescriptions")
 public List<?> prescriptions(){
     return prescriptions.findAllByOrderByPrescribedAtDesc().stream().filter(p->!p.isDispensed())
             .peek(p->p.setPaymentStatus(billingService.getServiceInvoiceStatus("MEDICINE",p.getId()))).toList();
 }

 @GetMapping("/history")
 public List<Prescription> history(){
     return prescriptions.findAllByOrderByPrescribedAtDesc().stream().filter(Prescription::isDispensed).toList();
 }

 private StaffPatientDTO dto(Patient p){
     return new StaffPatientDTO(p.getId(),p.getPatientName(),p.getPhoneNumber(),p.getPatientGender(),p.getPatientAge(),p.getEmail());
 }


}
