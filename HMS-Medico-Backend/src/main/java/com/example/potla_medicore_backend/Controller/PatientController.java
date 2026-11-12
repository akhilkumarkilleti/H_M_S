package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.PatientLoginDTO;
import com.example.potla_medicore_backend.Dto.PatientProfileUpdateDTO;
import com.example.potla_medicore_backend.Dto.PatientRegisterDTO;
import com.example.potla_medicore_backend.Entity.Patient;
import com.example.potla_medicore_backend.Service.EmailService;
import com.example.potla_medicore_backend.Service.JwtService;
import com.example.potla_medicore_backend.Service.PatientService;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.*;


@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins="http://localhost:3000")
public class PatientController {

    private final PatientService patientService;
    private final JwtService jwtService;
    private final EmailService emailService;
    public PatientController(PatientService patientService, JwtService jwtService, EmailService emailService){this.patientService=patientService;this.jwtService=jwtService;this.emailService = emailService;}

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody PatientRegisterDTO dto ){
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(response(patientService.register(dto), "Patient registered successfully"));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody PatientLoginDTO dto){
        try {
            return ResponseEntity.ok(response(patientService.login(dto), "Patient login successful"));
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message",e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> resetPassword(@RequestBody PasswordResetRequest request){
        try {
            patientService.resetPassword(request.email(), request.newPassword());
            return ResponseEntity.ok(Map.of("message", "Password updated successfully. You can now log in."));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<List<PatientAdminResponse>> getAll(){
        return ResponseEntity.ok(patientService.getAllPatients().stream().map(PatientAdminResponse::from).toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id){
        try{
            return ResponseEntity.ok(PatientAdminResponse.from(patientService.getPatientById(id)));
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message",e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication){
        try {
            Patient p = authenticated(authentication); return ResponseEntity.ok(PatientAdminResponse.from(p));
        }
        catch(RuntimeException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message",e.getMessage()));
        }
    }

    @PutMapping("/me")
    public ResponseEntity<?> update(@RequestBody PatientProfileUpdateDTO dto,Authentication authentication){
        try {
            Patient p=authenticated(authentication);
            return ResponseEntity.ok(response(patientService.updateProfile(p.getId(),dto),"Patient profile updated successfully"));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    private Patient authenticated(Authentication a){
        if(a==null || !a.isAuthenticated())
            throw new RuntimeException("Please login as a patient");
        return patientService.getAllPatients().stream().filter(p->p.getEmail().equalsIgnoreCase(a.getName())).findFirst().orElseThrow(()->new RuntimeException("Patient account not found. Please login again."));
    }

    private Map<String,Object> response(Patient p,String message){
        String token=jwtService.generateToken(p.getId(),p.getEmail(),"PATIENT","ACTIVE");
        Map<String,Object> m=new LinkedHashMap<>(); m.put("message",message); m.put("token",token); m.put("id",p.getId()); m.put("patientId",p.getId()); m.put("email",p.getEmail()); m.put("role","PATIENT"); m.put("patientName",p.getPatientName()); m.put("patientGender",p.getPatientGender()); m.put("patientAge",p.getPatientAge()); m.put("mobileNumber",p.getPhoneNumber()); return m;
    }

    public record PatientAdminResponse(Long id,String patientName,String email,String phoneNumber,Integer patientAge,String patientGender,String role){
        static PatientAdminResponse from(Patient p){return new PatientAdminResponse(p.getId(),p.getPatientName(),p.getEmail(),p.getPhoneNumber(),p.getPatientAge(),p.getPatientGender(),"PATIENT");}
    }
    public record PasswordResetRequest(String email, String newPassword) { }
}
