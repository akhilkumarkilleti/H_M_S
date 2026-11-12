package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.StaffPatientDTO;
import com.example.potla_medicore_backend.Entity.Patient;
import com.example.potla_medicore_backend.Entity.Appointment;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.BillingService;
import com.example.potla_medicore_backend.Entity.DoctorStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/reception")
@CrossOrigin(origins="http://localhost:3000")
public class ReceptionController {

 private final PatientRepository patients;
 private final AppointmentRepository appointments;
 private final DoctorAvailabilityRepository availability;
 private final BillingService billingService;
 public ReceptionController(PatientRepository p,AppointmentRepository a,DoctorAvailabilityRepository availability,BillingService billingService){
  patients=p;appointments=a;this.availability=availability;this.billingService=billingService;
 }


 @GetMapping("/patients")
 public List<StaffPatientDTO> patients(){
  return patients.findAll().stream().map(this::dto).toList();
 }

 @GetMapping("/doctors/active")
 public List<?> activeDoctors(){
  return availability.findByAvailabilityDateAndActiveTrue(java.time.LocalDate.now()).stream().filter(a->a.getDoctor().getStatus()==DoctorStatus.APPROVED).map(a->java.util.Map.of("id",a.getDoctor().getId(),"fullName",a.getDoctor().getFullName(),"specialization",a.getDoctor().getSpecialization(),"hospitalName",a.getDoctor().getHospitalName(),"city",a.getDoctor().getCity(),"startTime",a.getStartTime(),"endTime",a.getEndTime())).toList();
 }

 @GetMapping("/appointments")
 public List<Appointment> appointments(){
  return appointments.findAll().stream().map(billingService::attachAppointmentPaymentStatus).toList();
 }

 private StaffPatientDTO dto(Patient p){
  return new StaffPatientDTO(p.getId(),p.getPatientName(),p.getPhoneNumber(),p.getPatientGender(),p.getPatientAge(),p.getEmail());
 }


}
