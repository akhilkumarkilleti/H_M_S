package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.*;
import com.example.potla_medicore_backend.Entity.Doctor;
import com.example.potla_medicore_backend.Service.DoctorService;

import com.example.potla_medicore_backend.Service.JwtService;
import com.example.potla_medicore_backend.Repository.DoctorAvailabilityRepository;
import com.example.potla_medicore_backend.Entity.DoctorAvailability;
import com.example.potla_medicore_backend.Dto.DoctorAvailabilityDTO;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import jakarta.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins="http://localhost:3000")
public class DoctorController {

    private final DoctorService doctorService;

    private final Path uploadDirectory =
            Paths.get("uploads/doctors");

    private final JwtService jwtService;
    private final DoctorAvailabilityRepository availabilityRepository;

    public DoctorController(DoctorService doctorService, JwtService jwtService, DoctorAvailabilityRepository availabilityRepository) {
        this.doctorService = doctorService;
        this.jwtService= jwtService;
        this.availabilityRepository=availabilityRepository;
    }

    //Get the dashboard redirecting after login
    @GetMapping("/{id}/dashboard")
    public ResponseEntity<?> dashboard(@PathVariable Long id) {
        Doctor doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Doctor dashboard data", "status", doctor.getStatus(), "doctor", doctor));
    }




    // LOGGED-IN DOCTOR PROFILE
    @GetMapping("/me")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        try {
            if (authentication == null || !authentication.isAuthenticated())
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message", "Please login as a doctor"));

            return ResponseEntity.ok(doctorService.getDoctorByEmail(authentication.getName()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMyProfile(Authentication authentication, @ModelAttribute DoctorProfileUpdateDTO dto) {
        try {
            if (authentication == null || !authentication.isAuthenticated())
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of("message", "Please login as a doctor"));

            Doctor doctor = doctorService.updateProfile(authentication.getName(), dto);
            String token = jwtService.generateToken(doctor.getId(), doctor.getEmail(), doctor.getRole().name(), doctor.getStatus().name());

            return ResponseEntity.ok(java.util.Map.of("message", "Doctor profile updated successfully", "token", token, "id", doctor.getId(), "email", doctor.getEmail(), "doctor", doctor));
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
        catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(java.util.Map.of("message", "Unable to update doctor profile"));
        }
    }

    @GetMapping("/active-today")
    public ResponseEntity<?> activeToday(){
        LocalDate today = LocalDate.now();
        List<Map<String,Object>> out = doctorService.getApprovedDoctors().stream()
                .map(d -> {
                    DoctorAvailability row = availabilityRepository
                            .findByDoctorIdAndAvailabilityDate(d.getId(), today)
                            .orElse(null);
                    boolean active = row == null || row.isActive();
                    if (!active) return null;

                    Map<String,Object> m = new java.util.LinkedHashMap<>();
                    m.put("id", d.getId());
                    m.put("fullName", d.getFullName());
                    m.put("specialization", d.getSpecialization());
                    m.put("hospitalName", d.getHospitalName());
                    m.put("city", d.getCity());
                    m.put("startTime", row == null ? null : row.getStartTime());
                    m.put("endTime", row == null ? null : row.getEndTime());
                    m.put("active", true);
                    return m;
                })
                .filter(java.util.Objects::nonNull)
                .toList();
        return ResponseEntity.ok(out);
    }

    @GetMapping("/availability")
    public ResponseEntity<?> myAvailability(Authentication authentication,@RequestParam String from,@RequestParam String to){
        Doctor d=doctorService.getDoctorByEmail(authentication.getName());
        return ResponseEntity.ok(availabilityRepository.findByDoctorIdAndAvailabilityDateBetweenOrderByAvailabilityDateAsc(d.getId(),LocalDate.parse(from),LocalDate.parse(to)));
    }

    @PutMapping("/availability")
    public ResponseEntity<?> saveAvailability(Authentication authentication,@RequestBody DoctorAvailabilityDTO dto){
        try {
            Doctor d=doctorService.getDoctorByEmail(authentication.getName());
            LocalDate date=LocalDate.parse(dto.date());
            DoctorAvailability a=availabilityRepository.findByDoctorIdAndAvailabilityDate(d.getId(),date).orElseGet(DoctorAvailability::new);
            a.setDoctor(d); a.setAvailabilityDate(date); a.setActive(dto.active());
            if(dto.startTime()!=null&&!dto.startTime().isBlank()) a.setStartTime(LocalTime.parse(dto.startTime())); else a.setStartTime(null);
            if(dto.endTime()!=null&&!dto.endTime().isBlank()) a.setEndTime(LocalTime.parse(dto.endTime())); else a.setEndTime(null);
            if(a.isActive() && (a.getStartTime()==null || a.getEndTime()==null || !a.getEndTime().isAfter(a.getStartTime()))) throw new RuntimeException("Active doctor timing must have a valid start and end time");
            return ResponseEntity.ok(availabilityRepository.save(a));
        } catch(Exception e){ return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); }
    }

    // APPROVED DOCTORS FOR PATIENTS
    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedDoctors() {
        try {
            return ResponseEntity.ok(doctorService.getApprovedDoctors());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Unable to load available doctors");
        }
    }
    // Profile photo because of image we consider as multipart file
    @GetMapping("/{id}/profile-photo")
    public ResponseEntity<Resource> getProfilePhoto(@PathVariable Long id) {

        try {

            Doctor doctor = doctorService.getDoctorById(id);
            if (doctor.getProfilePhoto() == null || doctor.getProfilePhoto().isBlank()) {
                return ResponseEntity.notFound().build();
            }

            Path filePath = uploadDirectory.resolve(doctor.getProfilePhoto());
            Resource resource = new UrlResource(filePath.toAbsolutePath().toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(resource);

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    // Login form
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody DoctorLoginDTO dto) {
        try {

            Doctor doctor = doctorService.login(dto);
            String token = jwtService.generateToken(doctor.getId(), doctor.getEmail(), doctor.getRole().name(), doctor.getStatus().name());
            return ResponseEntity.ok(new LoginResponseDTO(token, doctor.getId(), doctor.getEmail(), doctor.getRole().name(), doctor.getStatus().name()));
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }


}
