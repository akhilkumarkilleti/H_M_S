package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.AdminAppointmentDTO;
import com.example.potla_medicore_backend.Dto.BillingInvoiceDTO;
import com.example.potla_medicore_backend.Dto.StaffPatientDTO;
import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.UserRepository;
import com.example.potla_medicore_backend.Repository.DoctorRepository;
import com.example.potla_medicore_backend.Service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import java.util.*;
import com.example.potla_medicore_backend.Dto.AdminDoctorUpdateDTO;
import com.example.potla_medicore_backend.Dto.AdminUserUpdateDTO;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins="http://localhost:3000")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder encoder;
    private final JwtService jwtService;
    private final PatientService patientService;
    private final AppointmentService appointmentService;
    private final ActivityLogService activityLogService;
    private final DoctorService doctorService;
    private final BillingService billingService;
    private final com.example.potla_medicore_backend.Repository.ActivityLogRepository activityLogRepository;
    public AdminController(AdminService a,UserRepository u,DoctorRepository doctorRepository,PasswordEncoder e,JwtService j,PatientService p,AppointmentService ap,ActivityLogService activityLogService,com.example.potla_medicore_backend.Repository.ActivityLogRepository activityLogRepository, DoctorService doctorService, BillingService billingService){
        adminService=a;userRepository=u;this.doctorRepository=doctorRepository;encoder=e;jwtService=j;patientService=p;appointmentService=ap;this.activityLogService=activityLogService;this.activityLogRepository=activityLogRepository;this.doctorService=doctorService;this.billingService=billingService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginRequest r){
        User u=r.email()==null?null:userRepository.findByEmail(r.email().trim().toLowerCase()).orElse(null);
        if(u==null || u.getRole()==Role.PATIENT || r.password()==null || !encoder.matches(r.password(),u.getPassword()))
            return ResponseEntity.status(401).body(Map.of("message","Invalid staff email or password"));
        Long loginId = u.getId();
        Map<String,Object> response = new LinkedHashMap<>();
        String status = "ACTIVE";
        if (u.getRole() == Role.DOCTOR) {
            Doctor doctor = doctorService.getDoctorByEmail(u.getEmail());
            loginId = doctor.getId();
            status = doctor.getStatus().name();
        }
        String token=jwtService.generateToken(loginId,u.getEmail(),u.getRole().name(),status);
        response.put("token",token); response.put("id",loginId); response.put("userId",u.getId()); response.put("email",u.getEmail()); response.put("fullName",u.getFullName()); response.put("phoneNumber",u.getPhoneNumber()); response.put("role",u.getRole().name()); response.put("mainAdmin",u.isMainAdmin()); response.put("status",status);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> resetStaffPassword(@RequestBody StaffPasswordResetRequest request){
        if(request == null || request.email() == null || request.email().isBlank())
            return ResponseEntity.badRequest().body(Map.of("message", "Email is required"));
        if(request.newPassword() == null || request.newPassword().length() < 6)
            return ResponseEntity.badRequest().body(Map.of("message", "Password must contain at least 6 characters"));

        User user = userRepository.findByEmail(request.email().trim().toLowerCase()).orElse(null);
        if(user == null || user.getRole() == Role.PATIENT)
            return ResponseEntity.badRequest().body(Map.of("message", "No staff account is registered with this email"));

        String encodedPassword = encoder.encode(request.newPassword());
        user.setPassword(encodedPassword);
        userRepository.save(user);
        if(user.getRole() == Role.DOCTOR){
            doctorRepository.findByEmail(user.getEmail()).ifPresent(doctor -> {
                doctor.setPassword(encodedPassword);
                doctorRepository.save(doctor);
            });
        }
        return ResponseEntity.ok(Map.of("message", "Password updated successfully. You can now log in."));
    }

    public record StaffPasswordResetRequest(String email, String newPassword) { }

    @PostMapping("/admins")
    public ResponseEntity<?> createAdmin(@RequestBody CreateStaffRequest r,Authentication a){
        try {
            User creator=userRepository.findByEmail(a.getName()).
                    orElseThrow(()->new RuntimeException("Admin account not found"));
            User u=adminService.createStaff(r.email(),r.password(),Role.ADMIN,creator,r.fullName(),r.phoneNumber());
            activityLogService.log(a,null,"ADMIN","STAFF_CREATED","Administrator created staff account: " + r.email());
            return ResponseEntity.ok(Map.of("message","Account created","id",u.getId(),"email",u.getEmail(),"role",u.getRole().name()));
        }
        catch(Exception e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    @GetMapping("/billing/invoices")
    public ResponseEntity<?> billingInvoices(Authentication auth) {
        requireAdmin(auth);
        return ResponseEntity.ok(billingService.getAllInvoices());
    }

    @PostMapping("/billing/invoices/{invoiceId}/renew")
    public ResponseEntity<?> renewInvoice(@PathVariable Long invoiceId, Authentication auth) {
        try {
            requireAdmin(auth);
            BillingInvoiceDTO renewed = billingService.renewInvoice(invoiceId);
            activityLogService.log(auth, renewed.patientId(), "BILLING", "INVOICE_RENEWED",
                    "Renewed invoice " + renewed.invoiceNumber() + " for another 24 hours");
            return ResponseEntity.ok(renewed);
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/activity")
    public ResponseEntity<?> activity(){
        return ResponseEntity.ok(activityLogRepository.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/activity/module/{module}")
    public ResponseEntity<?> activityByModule(@PathVariable String module){
        String normalized = module == null ? "ALL" : module.trim().toUpperCase(Locale.ROOT);
        if ("ALL".equals(normalized)) {
            return ResponseEntity.ok(activityLogRepository.findAllByOrderByCreatedAtDesc());
        }

        List<String> modules;
        switch (normalized) {
            case "DOCTOR" -> modules = List.of("DOCTOR", "PRESCRIPTION");
            case "APPOINTMENT", "APPOINTMENTS" -> modules = List.of("APPOINTMENT");
            case "LAB", "LABORATORY" -> modules = List.of("LAB");
            case "NURSE" -> modules = List.of("NURSE");
            case "PHARMACY" -> modules = List.of("PHARMACY");
            case "HEALTH_CHECKUP", "HEALTH", "HEALTH CHECKUPS" -> modules = List.of("HEALTH_CHECKUP");
            case "BILLING", "PAYMENT", "PAYMENTS" -> modules = List.of("BILLING");
            default -> {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Unsupported activity module: " + module));
            }
        }

        return ResponseEntity.ok(
                activityLogRepository.findByModuleInOrderByCreatedAtDesc(modules)
        );
    }

    @GetMapping("/patients")
    public ResponseEntity<?> patients(){
        return ResponseEntity.ok(patientService.getAllPatients().stream()
                .map(p->new StaffPatientDTO(p.getId(),p.getPatientName(),p.getPhoneNumber(),p.getPatientGender(),p.getPatientAge(),p.getEmail())).toList());
    }
    @GetMapping("/appointments")
    public ResponseEntity<List<AdminAppointmentDTO>> appointments(){
        return ResponseEntity.ok(appointmentService.getAllAppointmentsForAdmin());
    }
    @PostMapping(value="/doctors", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createDoctor(@ModelAttribute com.example.potla_medicore_backend.Dto.DoctorSignupDTO dto, Authentication auth){
        try {
            if (auth == null || !auth.isAuthenticated()) return ResponseEntity.status(401).body(Map.of("message","Please login as the main admin"));
            User creator = userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Admin account not found"));
            if (!creator.isMainAdmin() || creator.getRole() != Role.MAIN_ADMIN) return ResponseEntity.status(403).body(Map.of("message","Only the Main Admin can add doctors"));
            Doctor doctor = doctorService.createByAdmin(dto);
            activityLogService.log(auth, null, "DOCTOR", "CREATED", "Main Admin created doctor: " + doctor.getEmail());
            return ResponseEntity.status(201).body(Map.of("id",doctor.getId(),"message","Doctor added successfully","status",doctor.getStatus().name()));
        } catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); } catch (Exception e) { return ResponseEntity.internalServerError().body(Map.of("message","Unable to add doctor")); }
    }

    @GetMapping("/doctors")
    public ResponseEntity<List<Doctor>> doctors(){
        return ResponseEntity.ok(adminService.getAllDoctors());
    }
    @GetMapping("/doctors/pending")
    public ResponseEntity<List<Doctor>> pending(){
        return ResponseEntity.ok(adminService.getPendingDoctors());
    }
    @GetMapping("/doctors/approved")
    public ResponseEntity<List<Doctor>> approved(){
        return ResponseEntity.ok(adminService.getApprovedDoctors());
    }
    @GetMapping("/doctors/rejected")
    public ResponseEntity<List<Doctor>> rejected(){
        return ResponseEntity.ok(adminService.getRejectedDoctors());
    }
    @PutMapping("/doctors/{id}/approve")
    public ResponseEntity<?> approve(@PathVariable Long id,Authentication auth){
        Doctor d=adminService.approveDoctor(id);
        activityLogService.log(auth, null, "DOCTOR", "APPROVED", "Doctor #" + id + " approved by administrator"); 
        return ResponseEntity.ok(d);
    }
    @PutMapping("/doctors/{id}/reject")
    public ResponseEntity<?> reject(@PathVariable Long id,Authentication auth){
        Doctor d=adminService.rejectDoctor(id);
        activityLogService.log(auth, null, "DOCTOR", "REJECTED", "Doctor #" + id + " rejected by administrator");
        return ResponseEntity.ok(d);
    }
    private User requireAdmin(Authentication auth) {
        if (auth == null || !auth.isAuthenticated()) throw new RuntimeException("Please login as administrator");
        User u=userRepository.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Admin account not found"));
        if(u.getRole()!=Role.MAIN_ADMIN && u.getRole()!=Role.ADMIN) throw new RuntimeException("Administrator access required");
        return u;
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id,@RequestBody AdminUserUpdateDTO dto,Authentication auth){
        try {
            requireAdmin(auth); User saved=adminService.updateUser(id,dto);
            activityLogService.log(auth,null,"ADMIN","STAFF_UPDATED","Administrator updated staff account #"+id);
            return ResponseEntity.ok(Map.of("message","Staff account updated successfully","user",saved));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id,Authentication auth){
        try {
            requireAdmin(auth); adminService.deleteUser(id);
            activityLogService.log(auth,null,"ADMIN","STAFF_DELETED","Administrator removed staff account #"+id);
            return ResponseEntity.ok(Map.of("message","Staff account removed successfully"));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    @PutMapping("/doctors/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id,@RequestBody AdminDoctorUpdateDTO dto,Authentication auth){
        try {
            requireAdmin(auth); Doctor saved=adminService.updateDoctor(id,dto);
            activityLogService.log(auth,null,"ADMIN","DOCTOR_UPDATED","Administrator updated doctor #"+id);
            return ResponseEntity.ok(Map.of("message","Doctor updated successfully","doctor",saved));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    @DeleteMapping("/doctors/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id,Authentication auth){
        try {
            requireAdmin(auth);
            adminService.deleteDoctor(id);
            activityLogService.log(auth,null,"ADMIN","DOCTOR_DELETED","Administrator removed doctor #"+id);
            return ResponseEntity.ok(Map.of("message","Doctor removed successfully"));
        }
        catch(RuntimeException e){
            return ResponseEntity.badRequest().body(Map.of("message",e.getMessage()));
        }
    }

    public record AdminLoginRequest(String email,String password){}
    public record CreateStaffRequest(String email,String password,Role role,String fullName,String phoneNumber){}
}
