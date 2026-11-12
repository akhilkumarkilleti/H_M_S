package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.StaffPatientDTO;
import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.ActivityLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import java.util.*;

@RestController
@RequestMapping("/api/nurse")
@CrossOrigin(origins="http://localhost:3000")
public class NurseController {

 private final PatientRepository patients;
 private final VitalSignRepository vitals;
 private final UserRepository users;
 private final ActivityLogService activityLogService;
 private final AppointmentRepository appointments;
 private final DoctorRepository doctors;
 private final DoctorAvailabilityRepository availability;

 public NurseController(PatientRepository p,VitalSignRepository v,UserRepository u,ActivityLogService activityLogService,AppointmentRepository appointments,DoctorRepository doctors,DoctorAvailabilityRepository availability){
     patients=p;vitals=v;users=u;this.activityLogService=activityLogService;this.appointments=appointments;this.doctors=doctors;this.availability=availability;
 }


 @GetMapping("/patients")
 public List<StaffPatientDTO> getPatients(){
     return patients.findAll().stream().map(this::dto).toList();
 }

 @GetMapping("/doctors/active")
 public List<?> activeDoctors(){
     return availability.findByAvailabilityDateAndActiveTrue(java.time.LocalDate.now())
             .stream()
             .filter(a->a.getDoctor().getStatus()==DoctorStatus.APPROVED)
             .map(a->java.util.Map.of("id",a.getDoctor().getId(),"fullName",a.getDoctor().getFullName(),"specialization",a.getDoctor().getSpecialization(),"hospitalName",a.getDoctor().getHospitalName(),"city",a.getDoctor().getCity(),"startTime",a.getStartTime(),"endTime",a.getEndTime())).toList();
 }

 @GetMapping("/patients/{id}")
 public StaffPatientDTO getPatient(@PathVariable Long id){
     ensureAssigned(id); return dto(patients.findById(id).orElseThrow(()->new RuntimeException("Patient not found")));
 }

 @GetMapping("/patients/{id}/vitals")
 public List<VitalSign> getVitals(@PathVariable Long id){
     ensureAssigned(id); return vitals.findByPatientIdOrderByRecordedAtDesc(id);
 }

 @PostMapping("/vitals")
 public ResponseEntity<?> add(@RequestBody VitalRequest r,Authentication a){
   if(r.patientId()==null||r.bpSystolic()==null||r.bpDiastolic()==null||r.weightKg()==null) return ResponseEntity.badRequest().body(Map.of("message","Patient, BP and weight are required"));
   if(r.bpSystolic()<50||r.bpSystolic()>300||r.bpDiastolic()<20||r.bpDiastolic()>200||r.weightKg()<=0||r.weightKg()>500) return ResponseEntity.badRequest().body(Map.of("message","Invalid vital values"));
   ensureAssigned(r.patientId());
   User n=users.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Nurse not found"));
   VitalSign v=new VitalSign();v.setPatientId(r.patientId());v.setNurseId(n.getId());v.setBpSystolic(r.bpSystolic());v.setBpDiastolic(r.bpDiastolic());v.setWeightKg(r.weightKg());
   VitalSign saved=vitals.save(v); activityLogService.log(a,r.patientId(),"NURSE","VITALS_RECORDED","Nurse recorded BP and weight"); return ResponseEntity.ok(saved);
 }

 private StaffPatientDTO dto(Patient p){
     return new StaffPatientDTO(p.getId(),p.getPatientName(),p.getPhoneNumber(),p.getPatientGender(),p.getPatientAge(),p.getEmail());
 }

 private void ensureAssigned(Long patientId){ patients.findById(patientId).orElseThrow(()->new RuntimeException("Patient not found")); }

 public record VitalRequest(Long patientId,Integer bpSystolic,Integer bpDiastolic,Double weightKg){}


}
