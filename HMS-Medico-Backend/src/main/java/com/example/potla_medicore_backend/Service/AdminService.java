package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Dto.AdminDoctorUpdateDTO;
import com.example.potla_medicore_backend.Dto.AdminUserUpdateDTO;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AdminService {

    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AppointmentRepository appointmentRepository;
    private final PrescriptionRepository prescriptionRepository;
    private final LabTestRepository labTestRepository;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final EmailService emailService;

    public AdminService(DoctorRepository doctorRepository, UserRepository userRepository, PasswordEncoder passwordEncoder,
                        AppointmentRepository appointmentRepository, PrescriptionRepository prescriptionRepository,
                        LabTestRepository labTestRepository, DoctorAvailabilityRepository availabilityRepository, EmailService emailService) {
        this.doctorRepository=doctorRepository; this.userRepository=userRepository; this.passwordEncoder=passwordEncoder;
        this.appointmentRepository=appointmentRepository; this.prescriptionRepository=prescriptionRepository;
        this.labTestRepository=labTestRepository; this.availabilityRepository=availabilityRepository; this.emailService=emailService;
    }


    public List<Doctor> getPendingDoctors(){
        return doctorRepository.findByStatusOrderByCreatedAtDesc(DoctorStatus.PENDING);
    }
    public List<Doctor> getAllDoctors(){
        List<Doctor> list=doctorRepository.findAll(); applyToday(list); return list;
    }
    public List<Doctor> getApprovedDoctors(){
        List<Doctor> list=doctorRepository.findByStatusOrderByFullNameAsc(DoctorStatus.APPROVED); applyToday(list);
        return list;
    }
    public List<Doctor> getRejectedDoctors(){
        List<Doctor> list=doctorRepository.findByStatusOrderByFullNameAsc(DoctorStatus.REJECTED); applyToday(list);
        return list;
    }
    private void applyToday(List<Doctor> doctors){
        java.time.LocalDate today=java.time.LocalDate.now();
        // Availability is ACTIVE by default. A saved INACTIVE row represents
        // an explicit leave/unavailable date.
        for(Doctor d:doctors) {
            d.setActiveToday(
                    availabilityRepository.findByDoctorIdAndAvailabilityDate(d.getId(), today)
                            .map(DoctorAvailability::isActive)
                            .orElse(true)
            );
        }
    }

    public Doctor approveDoctor(Long id){
        Doctor d=doctorRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Doctor not found"));
        d.setStatus(DoctorStatus.APPROVED);
        return doctorRepository.save(d);
    }
    public Doctor rejectDoctor(Long id){
        Doctor d=doctorRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Doctor not found"));
        d.setStatus(DoctorStatus.REJECTED);
        return doctorRepository.save(d);
    }
    public List<User> getStaffAndAdmins(){
        return userRepository.findByRoleIn(List.of(Role.MAIN_ADMIN,Role.ADMIN,Role.DOCTOR,Role.NURSE,Role.RECEPTION,Role.LAB,Role.PHARMACY));
    }

    public User createStaff(String email,String password,Role role,User creator,String fullName,String phoneNumber){
        if(creator==null || !creator.isMainAdmin() || creator.getRole()!=Role.MAIN_ADMIN) throw new RuntimeException("Only the main admin can create staff accounts");
        if(role==null || !(role==Role.ADMIN||role==Role.NURSE||role==Role.RECEPTION||role==Role.LAB||role==Role.PHARMACY)) throw new RuntimeException("Allowed roles: ADMIN, NURSE, RECEPTION, LAB, PHARMACY");
        if(fullName==null||fullName.isBlank()) throw new RuntimeException("Full name is required");
        if(phoneNumber==null||!phoneNumber.trim().matches("[6-9]\\d{9}")) throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number");
        if(email==null||email.isBlank()) throw new RuntimeException("Email is required");
        if(password==null||password.length()<6) throw new RuntimeException("Password must contain at least 6 characters");
        String normalized=email.trim().toLowerCase();
        if(userRepository.findByEmail(normalized).isPresent()) throw new RuntimeException("User with this email already exists");
        User u=new User(); u.setEmail(normalized); u.setFullName(fullName.trim()); u.setPhoneNumber(phoneNumber.trim()); u.setPassword(passwordEncoder.encode(password)); u.setRole(role); u.setMainAdmin(false);
        User saved=userRepository.save(u);
        try {
            emailService.sendStaffCredentials(saved.getEmail(), saved.getFullName(), saved.getRole().name(), password);
        } catch (Exception e) {
            System.err.println("Staff account created, but credentials email failed: " + e.getMessage());
        }
        return saved;
    }

    public User updateUser(Long id, AdminUserUpdateDTO dto) {
        User u=userRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        if(u.isMainAdmin() || u.getRole()==Role.MAIN_ADMIN) throw new RuntimeException("Main Admin account cannot be edited here");
        String email=dto.email()==null?u.getEmail():dto.email().trim().toLowerCase();
        if(!email.matches("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$")) throw new RuntimeException("Enter a valid email address");
        userRepository.findByEmail(email).ifPresent(x->{if(!x.getId().equals(id)) throw new RuntimeException("Email already registered");});
        String phone=dto.phoneNumber()==null?u.getPhoneNumber():dto.phoneNumber().trim();
        if(phone==null || !phone.matches("[6-9]\\d{9}")) throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number");
        if(dto.fullName()==null || dto.fullName().isBlank()) throw new RuntimeException("Full name is required");
        if(dto.password()!=null && !dto.password().isBlank() && dto.password().length()<6) throw new RuntimeException("Password must contain at least 6 characters");
        if(dto.role()!=null && !dto.role().isBlank()) {
            Role r=Role.valueOf(dto.role().trim().toUpperCase());
            if(r==Role.MAIN_ADMIN || r==Role.DOCTOR || r==Role.PATIENT) throw new RuntimeException("This role cannot be assigned from staff management");
            u.setRole(r);
        }
        u.setFullName(dto.fullName().trim()); u.setPhoneNumber(phone); u.setEmail(email);
        if(dto.password()!=null && !dto.password().isBlank()) u.setPassword(passwordEncoder.encode(dto.password()));
        return userRepository.save(u);
    }

    public void deleteUser(Long id) {
        User u=userRepository.findById(id).orElseThrow(()->new RuntimeException("User not found"));
        if(u.isMainAdmin() || u.getRole()==Role.MAIN_ADMIN) throw new RuntimeException("Main Admin account cannot be deleted");
        if(u.getRole()==Role.DOCTOR) throw new RuntimeException("Use doctor delete option for doctor accounts");
        userRepository.delete(u);
    }

    public Doctor updateDoctor(Long id, AdminDoctorUpdateDTO dto) {
        Doctor d=doctorRepository.findById(id).orElseThrow(()->new RuntimeException("Doctor not found"));
        String email=dto.email()==null?d.getEmail():dto.email().trim().toLowerCase();
        String phone=dto.phoneNumber()==null?d.getPhoneNumber():dto.phoneNumber().trim();
        if(dto.fullName()==null||dto.fullName().isBlank()) throw new RuntimeException("Full name is required");
        if(!phone.matches("[6-9]\\d{9}")) throw new RuntimeException("Mobile number must be a valid 10-digit Indian mobile number");
        doctorRepository.findByEmail(email).ifPresent(x->{if(!x.getId().equals(id)) throw new RuntimeException("Email already registered");});
        if(dto.password()!=null&&!dto.password().isBlank()&&dto.password().length()<6) throw new RuntimeException("Password must contain at least 6 characters");
        String oldEmail=d.getEmail();
        d.setFullName(dto.fullName().trim()); d.setPhoneNumber(phone); d.setEmail(email);
        if(dto.qualification()!=null) d.setQualification(dto.qualification().trim()); if(dto.specialization()!=null) d.setSpecialization(dto.specialization().trim());
        if(dto.experienceYears()!=null) d.setExperienceYears(dto.experienceYears()); if(dto.consultationFee()!=null) d.setConsultationFee(dto.consultationFee());
        if(dto.city()!=null) d.setCity(dto.city().trim()); if(dto.hospitalName()!=null) d.setHospitalName(dto.hospitalName().trim());
        if(dto.availableTimings()!=null) d.setAvailableTimings(dto.availableTimings().trim()); if(dto.languagesKnown()!=null) d.setLanguagesKnown(dto.languagesKnown().trim());
        if(dto.about()!=null) d.setAbout(dto.about().trim()); if(dto.licenseDocument()!=null&&!dto.licenseDocument().isBlank()) d.setLicenseDocument(dto.licenseDocument().trim());
        if(dto.status()!=null&&!dto.status().isBlank()) d.setStatus(DoctorStatus.valueOf(dto.status().trim().toUpperCase()));
        if(dto.password()!=null&&!dto.password().isBlank()) d.setPassword(passwordEncoder.encode(dto.password()));
        Doctor saved=doctorRepository.save(d);
        User u=userRepository.findByEmail(oldEmail).orElseGet(User::new); u.setEmail(email); u.setFullName(d.getFullName()); u.setPhoneNumber(phone); u.setRole(Role.DOCTOR); u.setMainAdmin(false); if(dto.password()!=null&&!dto.password().isBlank()) u.setPassword(passwordEncoder.encode(dto.password())); else if(u.getPassword()==null||u.getPassword().isBlank()) u.setPassword(d.getPassword()); userRepository.save(u);
        return saved;
    }

    public void deleteDoctor(Long id) {
        Doctor d=doctorRepository.findById(id)
                .orElseThrow(()->new RuntimeException("Doctor not found"));
        prescriptionRepository.deleteByDoctorId(id);
        labTestRepository.deleteByDoctorId(id);
        appointmentRepository.deleteByDoctorId(id);
        availabilityRepository.deleteAll(availabilityRepository.findByDoctorIdAndAvailabilityDateBetweenOrderByAvailabilityDateAsc(id, java.time.LocalDate.of(2000,1,1), java.time.LocalDate.of(2100,12,31)));
        userRepository.findByEmail(d.getEmail()).ifPresent(userRepository::delete);
        doctorRepository.delete(d);
    }
}
