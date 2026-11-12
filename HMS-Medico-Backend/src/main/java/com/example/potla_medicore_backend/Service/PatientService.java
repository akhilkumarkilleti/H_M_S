package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Dto.PatientLoginDTO;
import com.example.potla_medicore_backend.Dto.PatientProfileUpdateDTO;
import com.example.potla_medicore_backend.Dto.PatientRegisterDTO;
import com.example.potla_medicore_backend.Entity.Patient;
import com.example.potla_medicore_backend.Repository.PatientRepository;
import jakarta.validation.constraints.Email;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PatientService {
    private final PatientRepository patientRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    public PatientService(PatientRepository patientRepository, PasswordEncoder passwordEncoder, EmailService emailService) {
        this.patientRepository = patientRepository;
        this.passwordEncoder = passwordEncoder;
        this.emailService=emailService;
    }

    //register method for patient
    public Patient register(PatientRegisterDTO dto) {
        validate(dto.getPatientName(),
                dto.getPhoneNumber(),
                dto.getPatientGender(),
                dto.getPatientAge(),
                dto.getEmail(),
                dto.getPassword());
        String email = dto.getEmail().trim().toLowerCase();
        String phone = dto.getPhoneNumber().trim();

        if (patientRepository.existsByEmail(email)){
            throw new RuntimeException("Email is already registered.Please login.");
        }
        if (patientRepository.existsByPhoneNumber(phone)) {
            throw new RuntimeException("Mobile number is already registered.");
        }

        //above checks patients already exists or not
        //creates a new patient in repo
        Patient p = new Patient();
        p.setPatientName(dto.getPatientName().trim());
        p.setPhoneNumber(phone);
        p.setPatientGender(dto.getPatientGender().trim());
        p.setPatientAge(dto.getPatientAge());
        p.setEmail(email);
        p.setPassword(passwordEncoder.encode(dto.getPassword()));

        //here we are saving into our database
        Patient savedPatient= patientRepository.save(p);

        //now send to email which is registered email
        try{
            emailService.sendSignupConfirmation(savedPatient.getEmail(),savedPatient.getPatientName());
        }
        catch (Exception e){
            System.err.println("Patient registered, but confirmation email failed: " + e.getMessage());
        }

        return savedPatient;
    }

    //login method for patient that to check in repo
    public Patient login(PatientLoginDTO dto) {
        if (dto == null || dto.getEmail() == null || dto.getEmail().isBlank() || dto.getPassword() == null || dto.getPassword().isBlank())
            throw new RuntimeException("Email and password are required");
        Patient p = patientRepository.findByEmail(dto.getEmail().trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("Invalid email "));
        if (!passwordEncoder.matches(dto.getPassword(), p.getPassword()))
            throw new RuntimeException("Invalid  password");
        return p;
    }

    public void resetPassword(String email, String newPassword) {
        if (email == null || email.isBlank())
            throw new RuntimeException("Email is required");
        if (newPassword == null || newPassword.length() < 6)
            throw new RuntimeException("Password must contain at least 6 characters");

        Patient patient = patientRepository.findByEmail(email.trim().toLowerCase())
                .orElseThrow(() -> new RuntimeException("No patient account is registered with this email"));
        patient.setPassword(passwordEncoder.encode(newPassword));
        patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAllByOrderByIdDesc();
    }
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElseThrow(() -> new RuntimeException("Patient profile not found"));
    }
    //update the patient details as per our convienent
    public Patient updateProfile(Long id, PatientProfileUpdateDTO dto) {
        Patient p = getPatientById(id);
        String name = dto.getPatientName() == null ? "" : dto.getPatientName().trim();
        String email = dto.getEmail() == null ? "" : dto.getEmail().trim().toLowerCase();
        String phone = dto.getPhoneNumber() == null ? "" : dto.getPhoneNumber().trim();
        validate(name, phone, dto.getPatientGender(), dto.getPatientAge(), email, dto.getPassword() == null || dto.getPassword().isBlank() ? "temporary-valid" : dto.getPassword());
        patientRepository.findByEmail(email).ifPresent(x -> { if (!x.getId().equals(id))
            throw new RuntimeException("Email is already registered"); });
        patientRepository.findAll().stream().filter(x -> !x.getId().equals(id) && phone.equals(x.getPhoneNumber())).findFirst().ifPresent(x -> {
            throw new RuntimeException("Mobile number is already registered"); });
        p.setPatientName(name); p.setEmail(email); p.setPhoneNumber(phone); p.setPatientGender(dto.getPatientGender().trim()); p.setPatientAge(dto.getPatientAge());
        if (dto.getPassword() != null && !dto.getPassword().isBlank()) p.setPassword(passwordEncoder.encode(dto.getPassword()));
        return patientRepository.save(p);
    }

    private void validate(String name, String phone, String gender, Integer age, String email, String password) {
        if (name == null || name.isBlank()) throw new RuntimeException("Patient name is required");
        if (gender == null || gender.isBlank()) throw new RuntimeException("Patient Gender is required");
        if (age == null || age < 1 || age > 120) throw new RuntimeException("Patient age must be between 1 and 120");
        if (email == null || !email.trim().matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) throw new RuntimeException("Enter a valid email address");
        if (phone == null || !phone.trim().matches("[6-9]\\d{9}"))
            throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number");
        if (password == null || password.length() < 6)
            throw new RuntimeException("Password must contain at least 6 characters");
    }
}
