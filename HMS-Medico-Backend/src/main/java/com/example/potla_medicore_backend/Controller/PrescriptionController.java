package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.ActivityLogService;
import com.example.potla_medicore_backend.Service.BillingCatalog;
import com.example.potla_medicore_backend.Service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/prescriptions")
@CrossOrigin(origins="http://localhost:3000")
public class PrescriptionController {
 private final PrescriptionRepository prescriptions;
 private final AppointmentRepository appointments;
 private final DoctorRepository doctors;
 private final PatientRepository patients;
 private final UserRepository users;
 private final ActivityLogService activityLogService;
 private final BillingService billingService;
 public PrescriptionController(PrescriptionRepository p,AppointmentRepository a,DoctorRepository d,PatientRepository pa,UserRepository users,ActivityLogService activityLogService,BillingService billingService){
  prescriptions=p;appointments=a;doctors=d;patients=pa;this.users=users;this.activityLogService=activityLogService;this.billingService=billingService;
 }


 @PostMapping
 @Transactional
 public ResponseEntity<?> create(@RequestBody PrescriptionRequest r,Authentication auth){
  try{
   if(r.appointmentId()==null) throw new RuntimeException("Appointment is required");
   List<MedicineLine> requested = r.medicines()!=null && !r.medicines().isEmpty()
           ? r.medicines()
           : (r.medicine()==null ? List.of() : List.of(new MedicineLine(r.medicine(),r.dosage(),r.duration(),List.of("Morning"))));
   if(requested.isEmpty()) throw new RuntimeException("Select at least one medicine");
   List<BillingCatalog.CatalogItem> priced = new ArrayList<>();
   Set<String> seen = new HashSet<>();
   for (MedicineLine line : requested) {
    if (line==null || line.medicine()==null || line.medicine().isBlank() || line.dosage()==null || line.dosage().isBlank() || line.duration()==null || line.duration().isBlank() || line.dosingTimes()==null || line.dosingTimes().isEmpty())
     throw new RuntimeException("Each medicine requires a dosage, duration and at least one dosing time");
    if (!Set.of("Morning", "Afternoon", "Evening").containsAll(line.dosingTimes()))
     throw new RuntimeException("Dosing times must be Morning, Afternoon or Evening");
    if (!seen.add(line.medicine().trim())) throw new RuntimeException("A medicine can only be selected once");
    BillingCatalog.CatalogItem item=BillingCatalog.find(BillingCatalog.MEDICINES,line.medicine().trim());
    if(item==null) throw new RuntimeException("Choose medicines from the priced pharmacy catalogue");
    priced.add(item);
   }
   Doctor d=doctors.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Doctor not found"));
   Appointment a=appointments.findById(r.appointmentId()).orElseThrow(()->new RuntimeException("Appointment not found"));
   if(!a.getDoctor().getId().equals(d.getId())) throw new RuntimeException("You can prescribe only for your own appointments");
   if(a.getStatus()!=AppointmentStatus.CONFIRMED) throw new RuntimeException("Prescription can be added only to a confirmed appointment");
   List<Prescription> savedPrescriptions = new ArrayList<>();
   for (int i=0; i<requested.size(); i++) {
    MedicineLine line=requested.get(i);
    BillingCatalog.CatalogItem item=priced.get(i);
    Prescription p=new Prescription(); p.setAppointmentId(a.getId()); p.setPatientId(a.getPatientId());
    p.setDoctorId(d.getId()); p.setPatientName(a.getPatientName()); p.setMedicine(item.name());
    p.setPricePaise(item.pricePaise()); p.setDosage(line.dosage().trim()); p.setDuration(line.duration().trim());
    p.setDosingTimes(String.join(", ", line.dosingTimes()));
    p.setInstructions(r.instructions()); p.setPharmacyName(r.pharmacyName()==null?null:r.pharmacyName().trim());
    Prescription saved=prescriptions.save(p);
    billingService.createInvoiceForPrescription(saved);
    activityLogService.log(auth,a.getPatientId(),"PRESCRIPTION","PRESCRIBED","Doctor prescribed " + p.getMedicine());
    savedPrescriptions.add(saved);
   }
   return ResponseEntity.ok(savedPrescriptions);
  }catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()==null?"Unable to create prescription":e.getMessage()));}
 }

 @GetMapping("/doctor/my")
 public List<Prescription> doctor(Authentication a){
  Doctor d=doctors.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Doctor not found"));
  return prescriptions.findByDoctorIdOrderByPrescribedAtDesc(d.getId());
 }

 @GetMapping("/patient/my") public List<Prescription> patient(Authentication a){
   Patient p=patients.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Patient not found"));return prescriptions.findByPatientIdOrderByPrescribedAtDesc(p.getId());
 }

 @GetMapping("/pharmacy/all")
 public List<Prescription> pharmacy(){
  return prescriptions.findAllByOrderByPrescribedAtDesc().stream()
          .peek(p -> p.setPaymentStatus(billingService.getServiceInvoiceStatus("MEDICINE", p.getId()))).toList();
 }

 @GetMapping("/pharmacy/patient/{patientId}")
 public List<Prescription> pharmacyPatient(@PathVariable Long patientId){
  return prescriptions.findByPatientIdOrderByPrescribedAtDesc(patientId).stream()
          .peek(p -> p.setPaymentStatus(billingService.getServiceInvoiceStatus("MEDICINE", p.getId()))).toList();
 }

 public record PrescriptionRequest(Long appointmentId,String medicine,String dosage,String duration,String instructions,String pharmacyName,List<MedicineLine> medicines){}
 public record MedicineLine(String medicine,String dosage,String duration,List<String> dosingTimes){}


 @PutMapping("/{id}/dispense")
 public ResponseEntity<?> dispense(@PathVariable Long id,Authentication auth){
   try{
     User pharmacy=users.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Pharmacy user not found"));
     Prescription p=prescriptions.findById(id).orElseThrow(()->new RuntimeException("Prescription not found"));
     if(!billingService.isServiceInvoicePaid("MEDICINE",p.getId())) throw new RuntimeException("Patient payment is required before dispensing this medicine");
     if(p.isDispensed()) throw new RuntimeException("Prescription is already dispensed");
     p.setDispensed(true); p.setDispensedByUserId(pharmacy.getId()); p.setDispensedAt(java.time.LocalDateTime.now());
     Prescription saved=prescriptions.save(p);
     activityLogService.log(auth,p.getPatientId(),"PHARMACY","MEDICINE_DISPENSED","Pharmacy member dispensed " + p.getMedicine());
     return ResponseEntity.ok(saved);
   }catch(Exception e){return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));}
 }

}
