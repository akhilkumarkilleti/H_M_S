package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Dto.DoctorLoginDTO;
import com.example.potla_medicore_backend.Dto.DoctorSignupDTO;
import com.example.potla_medicore_backend.Dto.DoctorProfileUpdateDTO;
import com.example.potla_medicore_backend.Entity.Doctor;
import com.example.potla_medicore_backend.Entity.DoctorStatus;
import com.example.potla_medicore_backend.Entity.Role;
import com.example.potla_medicore_backend.Repository.DoctorRepository;
import com.example.potla_medicore_backend.Repository.UserRepository;
import com.example.potla_medicore_backend.Entity.User;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final EmailService emailService;

    // Upload directory
    private final Path uploadDirectory =
            Paths.get("uploads/doctors");

    public DoctorService(DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, UserRepository userRepository, EmailService emailService) {
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    @Transactional
    public Doctor createByAdmin(DoctorSignupDTO dto) throws IOException {
        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();
        String phone = dto.getPhoneNumber() == null ? "" : dto.getPhoneNumber().trim();
        if (email.isBlank() || dto.getPassword() == null || dto.getPassword().length() < 6)
            throw new RuntimeException("Valid email and password (minimum 6 characters) are required");
        if (!phone.matches("[6-9]\\d{9}"))
            throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number");
        if (doctorRepository.existsByEmail(email) || userRepository.findByEmail(email).isPresent())
            throw new RuntimeException("Email already registered");
        if (doctorRepository.existsByPhoneNumber(phone))
            throw new RuntimeException("Mobile number already registered");
        if (dto.getFullName() == null || dto.getFullName().trim().isEmpty())
            throw new RuntimeException("Full name is required");
        if (dto.getQualification() == null || dto.getQualification().trim().isEmpty())
            throw new RuntimeException("Qualification is required");
        if (dto.getSpecialization() == null || dto.getSpecialization().trim().isEmpty())
            throw new RuntimeException("Specialization is required");
        if (dto.getExperienceYears() == null || dto.getExperienceYears() < 0 || dto.getExperienceYears() > 70)
            throw new RuntimeException("Experience must be between 0 and 70 years");
        if (dto.getLicenseDocument() == null || dto.getLicenseDocument().trim().isEmpty())
            throw new RuntimeException("License document number is required");

        Doctor doctor = new Doctor();
        doctor.setFullName(dto.getFullName().trim());
        doctor.setPhoneNumber(phone);
        doctor.setEmail(email);
        doctor.setPassword(passwordEncoder.encode(dto.getPassword()));
        doctor.setQualification(dto.getQualification().trim());
        doctor.setSpecialization(dto.getSpecialization().trim());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee() == null ? 0D : dto.getConsultationFee());
        doctor.setCity(dto.getCity() == null ? "" : dto.getCity().trim());
        doctor.setHospitalName(dto.getHospitalName() == null ? "" : dto.getHospitalName().trim());
        doctor.setAvailableTimings(dto.getAvailableTimings() == null ? "" : dto.getAvailableTimings().trim());
        doctor.setLanguagesKnown(dto.getLanguagesKnown() == null ? "" : dto.getLanguagesKnown().trim());
        doctor.setAbout(dto.getAbout() == null ? "" : dto.getAbout().trim());
        doctor.setLicenseDocument(dto.getLicenseDocument().trim());
        doctor.setRole(Role.DOCTOR);
        doctor.setStatus(DoctorStatus.APPROVED);

        MultipartFile photo = dto.getProfilePhoto();
        if (photo != null && !photo.isEmpty()) {
            validateImage(photo);
            doctor.setProfilePhoto(saveProfilePhoto(photo));
            doctor.setProfilePhotoType(photo.getContentType());
        }

        Doctor saved = doctorRepository.save(doctor);

        User user = new User();
        user.setEmail(email);
        user.setFullName(doctor.getFullName());
        user.setPhoneNumber(doctor.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.DOCTOR);
        user.setMainAdmin(false);
        userRepository.save(user);
        try {
            emailService.sendStaffCredentials(saved.getEmail(), saved.getFullName(), Role.DOCTOR.name(), dto.getPassword());
        } catch (Exception e) {
            System.err.println("Doctor account created, but credentials email failed: " + e.getMessage());
        }
        return saved;
    }

    // SAVE PROFILE PHOTO
    private String saveProfilePhoto(MultipartFile file) throws IOException {
        // Create directory if not exists in path
        Files.createDirectories(uploadDirectory);
        // Generate unique filename
        String fileName = UUID.randomUUID().toString() + ".jpg";

        Path filePath = uploadDirectory.resolve(fileName);

        // Saves the uploaded file in the specific path
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        return fileName;
    }


    // VALIDATE IMAGE
    private void validateImage(MultipartFile file) {
        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new RuntimeException("Only image files are allowed");
        }

        // 5 MB limit
        long maxSize =
                5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new RuntimeException("Profile photo must be less than 5 MB");
        }
    }


    // GET DOCTOR
    public Doctor getDoctorByEmail(String email) {
        return doctorRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    public Doctor getDoctorById(Long id) {
        return doctorRepository
                .findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }

    // UPDATE LOGGED-IN DOCTOR PROFILE
    public Doctor updateProfile(String currentEmail, DoctorProfileUpdateDTO dto) throws IOException {
        Doctor doctor = doctorRepository.findByEmail(currentEmail)
                .orElseThrow(() -> new RuntimeException("Doctor profile not found"));

        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();
        String phone = dto.getPhoneNumber() == null ? "" : dto.getPhoneNumber().trim();

        if (dto.getFullName() == null || dto.getFullName().trim().isEmpty())
            throw new RuntimeException("Full name is required");
        if (!phone.matches("[6-9]\\d{9}"))
            throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number");
        if (!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"))
            throw new RuntimeException("Enter a valid email address");
        if (dto.getQualification() == null || dto.getQualification().trim().isEmpty())
            throw new RuntimeException("Qualification is required");
        if (dto.getSpecialization() == null || dto.getSpecialization().trim().isEmpty())
            throw new RuntimeException("Specialization is required");
        if (dto.getExperienceYears() == null || dto.getExperienceYears() < 0 || dto.getExperienceYears() > 70)
            throw new RuntimeException("Experience must be between 0 and 70 years");
        if (dto.getPassword() != null && !dto.getPassword().isBlank() && dto.getPassword().length() < 6)
            throw new RuntimeException("Password must contain at least 6 characters");

        doctorRepository.findByEmail(email).ifPresent(existing -> {
            if (!existing.getId().equals(doctor.getId()))
                throw new RuntimeException("Email already registered");
        });
        doctorRepository.findById(doctor.getId()).ifPresent(existing -> {
            if (!existing.getPhoneNumber().equals(phone)) {
                doctorRepository.findAll().stream()
                        .filter(d -> !d.getId().equals(doctor.getId()) && phone.equals(d.getPhoneNumber()))
                        .findFirst()
                        .ifPresent(d -> { throw new RuntimeException("Mobile number already registered"); });
            }
        });

        String oldDoctorEmail = doctor.getEmail();
        doctor.setFullName(dto.getFullName().trim());
        doctor.setPhoneNumber(phone);
        doctor.setEmail(email);
        doctor.setQualification(dto.getQualification().trim());
        doctor.setSpecialization(dto.getSpecialization().trim());
        doctor.setExperienceYears(dto.getExperienceYears());
        doctor.setConsultationFee(dto.getConsultationFee() == null ? 0D : dto.getConsultationFee());
        doctor.setCity(dto.getCity() == null ? "" : dto.getCity().trim());
        doctor.setHospitalName(dto.getHospitalName() == null ? "" : dto.getHospitalName().trim());
        doctor.setAvailableTimings(dto.getAvailableTimings() == null ? "" : dto.getAvailableTimings().trim());
        doctor.setLanguagesKnown(dto.getLanguagesKnown() == null ? "" : dto.getLanguagesKnown().trim());
        doctor.setAbout(dto.getAbout() == null ? "" : dto.getAbout().trim());
        if (dto.getLicenseDocument() != null && !dto.getLicenseDocument().isBlank())
            doctor.setLicenseDocument(dto.getLicenseDocument().trim());
        if (dto.getPassword() != null && !dto.getPassword().isBlank())
            doctor.setPassword(passwordEncoder.encode(dto.getPassword()));

        User linkedUser = userRepository.findByEmail(oldDoctorEmail).orElseGet(User::new);
        linkedUser.setEmail(email);
        linkedUser.setFullName(doctor.getFullName());
        linkedUser.setPhoneNumber(phone);
        linkedUser.setRole(Role.DOCTOR);
        linkedUser.setMainAdmin(false);
        if (dto.getPassword() != null && !dto.getPassword().isBlank())
            linkedUser.setPassword(passwordEncoder.encode(dto.getPassword()));
        else if (linkedUser.getPassword() == null || linkedUser.getPassword().isBlank())
            linkedUser.setPassword(doctor.getPassword());
        userRepository.save(linkedUser);

        MultipartFile photo = dto.getProfilePhoto();
        if (photo != null && !photo.isEmpty()) {
            validateImage(photo);
            doctor.setProfilePhoto(saveProfilePhoto(photo));
            doctor.setProfilePhotoType(photo.getContentType());
        }
        return doctorRepository.save(doctor);
    }

    // LOGIN
    public Doctor login(DoctorLoginDTO dto) {
        Doctor doctor = doctorRepository
                        .findByEmail(dto.getEmail())
                        .orElseThrow(() -> new RuntimeException("Invalid email or password"));
        boolean passwordMatches = passwordEncoder.matches(dto.getPassword(), doctor.getPassword());

        if (!passwordMatches) {
            throw new RuntimeException("Invalid email or password");
        }
        return doctor;
    }

    // GET APPROVED DOCTORS FOR PATIENTS
        public java.util.List<Doctor> getApprovedDoctors() {
        return doctorRepository.findByStatusOrderByFullNameAsc(DoctorStatus.APPROVED);
    }

}
