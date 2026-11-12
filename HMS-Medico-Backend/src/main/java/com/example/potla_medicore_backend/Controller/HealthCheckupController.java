package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.*;
import com.example.potla_medicore_backend.Service.ActivityLogService;
import com.example.potla_medicore_backend.Service.FileStorageService;
import com.example.potla_medicore_backend.Service.BillingCatalog;
import com.example.potla_medicore_backend.Service.BillingService;
import org.springframework.core.io.*;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/health-checkups")
@CrossOrigin(origins="http://localhost:3000")
public class HealthCheckupController {
    private final HealthCheckupBookingRepository bookings;
    private final PatientRepository patients;
    private final UserRepository users;
    private final ActivityLogService activityLogs;
    private final FileStorageService storage;
    private final BillingService billingService;

    public HealthCheckupController(HealthCheckupBookingRepository b, PatientRepository p, UserRepository u,
                                   ActivityLogService a, FileStorageService s, BillingService billingService) {
        bookings=b; patients=p; users=u; activityLogs=a; storage=s; this.billingService=billingService;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> book(@RequestBody BookingRequest r, Authentication auth) {
        try {
            Patient p = patient(auth);
            if (r.packageName()==null || r.packageName().isBlank()) throw new RuntimeException("Health checkup package is required");
            BillingCatalog.CatalogItem pricedPackage=BillingCatalog.find(BillingCatalog.HEALTH_CHECKUPS,r.packageName());
            if(pricedPackage==null) throw new RuntimeException("Choose a health checkup from the priced catalogue");
            if (r.visitDate()==null || r.visitDate().isBefore(LocalDate.now())) throw new RuntimeException("Choose today or a future date");
            if (r.visitTime()==null || r.visitTime().isBlank()) throw new RuntimeException("Visit time is required");
            String type = r.visitType()==null ? "" : r.visitType().trim().toUpperCase(Locale.ROOT);
            if (!type.equals("HOSPITAL") && !type.equals("HOME")) throw new RuntimeException("Choose Hospital Visit or Home Visit");
            if (type.equals("HOME") && !BillingCatalog.supportsHomeVisit(pricedPackage.name()))
                throw new RuntimeException("Home visit is not available for this health checkup. Please choose Hospital Visit.");
            if (type.equals("HOME") && (r.homeAddress()==null || r.homeAddress().isBlank())) throw new RuntimeException("Home address is required for a home visit");

            HealthCheckupBooking b = new HealthCheckupBooking();
            b.setPatientId(p.getId()); b.setPatientName(p.getPatientName());
            b.setPackageName(pricedPackage.name()); b.setPackagePrice(pricedPackage.pricePaise()/100.0);
            b.setVisitType(type); b.setVisitDate(r.visitDate()); b.setVisitTime(r.visitTime().trim());
            b.setHomeAddress(type.equals("HOME") ? r.homeAddress().trim() : null); b.setStatus("BOOKED");
            HealthCheckupBooking saved=bookings.save(b);
            billingService.createInvoiceForHealthCheckup(saved);
            activityLogs.log(auth,p.getId(),"HEALTH_CHECKUP","BOOKED","Booked "+b.getPackageName()+" as "+type+" for "+b.getVisitDate()+" "+b.getVisitTime());
            return ResponseEntity.ok(saved);
        } catch(Exception e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()==null?"Unable to book health checkup":e.getMessage())); }
    }

    @GetMapping("/patient/my")
    public ResponseEntity<?> my(Authentication auth) {
        try { return ResponseEntity.ok(bookings.findByPatientIdOrderByCreatedAtDesc(patient(auth).getId())); }
        catch(Exception e){ return ResponseEntity.status(403).body(Map.of("message",e.getMessage())); }
    }

    @GetMapping("/admin/all")
    public List<HealthCheckupBooking> adminAll() { return withPaymentStatus(bookings.findAllByOrderByCreatedAtDesc()); }

    @GetMapping("/reception/all")
    public List<HealthCheckupBooking> receptionAll(Authentication auth) {
        User user = users.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("Reception account not found"));
        if (user.getRole() != Role.RECEPTION) throw new RuntimeException("Reception access required");
        return withPaymentStatus(bookings.findAllByOrderByCreatedAtDesc());
    }

    @GetMapping("/lab/all")
    public List<HealthCheckupBooking> labAll() { return withPaymentStatus(bookings.findAllByOrderByCreatedAtDesc()); }

    @PutMapping("/lab/{id}/initialize")
    public ResponseEntity<?> initialize(@PathVariable Long id, Authentication auth) {
        try {
            User lab=users.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            if(lab.getRole()!=Role.LAB) throw new RuntimeException("Laboratory access required");
            HealthCheckupBooking b=bookings.findById(id).orElseThrow(()->new RuntimeException("Health checkup not found"));
            if(!billingService.isServiceInvoicePaid("HEALTH_CHECKUP",b.getId())) throw new RuntimeException("Patient payment is required before initializing this health checkup");
            if("DONE".equalsIgnoreCase(b.getStatus())) throw new RuntimeException("Completed checkup cannot be initialized again");
            b.setStatus("WAITING_FOR_RESULT"); b.setLabUserId(lab.getId()); b.setInitializedAt(LocalDateTime.now());
            HealthCheckupBooking saved=bookings.save(b);
            activityLogs.log(auth,b.getPatientId(),"HEALTH_CHECKUP","INITIALIZED","Lab initialized health checkup after sample collection: "+b.getPackageName());
            return ResponseEntity.ok(saved);
        } catch(Exception e){ return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); }
    }

    @PostMapping(value="/lab/{id}/complete", consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> complete(@PathVariable Long id,@RequestParam MultipartFile file,Authentication auth) {
        try {
            User lab=users.findByEmail(auth.getName()).orElseThrow(()->new RuntimeException("Lab user not found"));
            if(lab.getRole()!=Role.LAB) throw new RuntimeException("Laboratory access required");
            HealthCheckupBooking b=bookings.findById(id).orElseThrow(()->new RuntimeException("Health checkup not found"));
            if(!billingService.isServiceInvoicePaid("HEALTH_CHECKUP",b.getId())) throw new RuntimeException("Patient payment is required before completing this health checkup");
            if(!"WAITING_FOR_RESULT".equalsIgnoreCase(b.getStatus())) throw new RuntimeException("Initialize the checkup after sample collection before uploading the result");
            if(file==null || file.isEmpty()) throw new RuntimeException("Result file is required");
            String ct=file.getContentType()==null?"application/octet-stream":file.getContentType().toLowerCase(Locale.ROOT);
            if(!Set.of("image/jpeg","image/png","image/webp","application/pdf").contains(ct)) throw new RuntimeException("Only JPG, PNG, WEBP or PDF results are allowed");
            if(file.getSize()>10*1024*1024) throw new RuntimeException("Result must be 10 MB or smaller");
            b.setReportFileName(storage.saveFile(file)); b.setReportContentType(ct); b.setLabUserId(lab.getId());
            b.setStatus("DONE"); b.setCompletedAt(LocalDateTime.now());
            HealthCheckupBooking saved=bookings.save(b);
            activityLogs.log(auth,b.getPatientId(),"HEALTH_CHECKUP","COMPLETED","Lab completed health checkup and uploaded result: "+b.getPackageName());
            return ResponseEntity.ok(saved);
        } catch(Exception e){ return ResponseEntity.badRequest().body(Map.of("message",e.getMessage())); }
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> file(@PathVariable Long id) throws Exception {
        HealthCheckupBooking b=bookings.findById(id).orElseThrow(()->new RuntimeException("Health checkup not found"));
        if(!billingService.isServiceInvoicePaid("HEALTH_CHECKUP",b.getId())) return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        if(b.getReportFileName()==null || b.getReportFileName().isBlank()) return ResponseEntity.notFound().build();
        Path path=Paths.get("uploads").resolve(b.getReportFileName()).normalize();
        if(!Files.exists(path)) return ResponseEntity.notFound().build();
        MediaType mt=MediaType.APPLICATION_OCTET_STREAM;
        try { if(b.getReportContentType()!=null) mt=MediaType.parseMediaType(b.getReportContentType()); } catch(Exception ignored){}
        return ResponseEntity.ok().contentType(mt).header(HttpHeaders.CONTENT_DISPOSITION,"inline; filename=\""+path.getFileName()+"\"").body(new FileSystemResource(path));
    }

    private List<HealthCheckupBooking> withPaymentStatus(List<HealthCheckupBooking> rows) {
        return rows.stream().peek(b -> b.setPaymentStatus(billingService.getServiceInvoiceStatus("HEALTH_CHECKUP", b.getId()))).toList();
    }

    private Patient patient(Authentication a) {
        if(a==null || !a.isAuthenticated()) throw new RuntimeException("Please login as a patient");
        return patients.findByEmail(a.getName()).orElseThrow(()->new RuntimeException("Patient not found"));
    }

    public record BookingRequest(String packageName, Double packagePrice, String visitType, LocalDate visitDate, String visitTime, String homeAddress){}
}
