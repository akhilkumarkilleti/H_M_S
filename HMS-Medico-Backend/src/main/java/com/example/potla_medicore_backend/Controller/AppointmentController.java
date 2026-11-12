package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.AppointmentDTO;
import com.example.potla_medicore_backend.Entity.Appointment;
import com.example.potla_medicore_backend.Service.AppointmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins="http://localhost:3000")
public class AppointmentController {

    private final AppointmentService appointmentService;

    public AppointmentController(AppointmentService appointmentService) {
        this.appointmentService = appointmentService;
    }

    @GetMapping("/patient/my")
    public ResponseEntity<?> getPatientAppointments(Authentication authentication) {
        try {
            return ResponseEntity.ok(appointmentService.getPatientAppointments(authentication));
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/patient/doctor/{doctorId}/booked-slots")
    public ResponseEntity<?> getBookedSlots(@PathVariable Long doctorId, @RequestParam java.time.LocalDate date) {
        return ResponseEntity.ok(appointmentService.getBookedSlots(doctorId, date));
    }

    @GetMapping("/patient/doctor/{doctorId}/availability")
    public ResponseEntity<?> getDoctorAvailability(@PathVariable Long doctorId, @RequestParam java.time.LocalDate date) {
        return ResponseEntity.ok(appointmentService.getDoctorAvailability(doctorId, date));
    }

    @GetMapping("/doctor/my")
    public ResponseEntity<?> getDoctorAppointments(Authentication authentication) {
        try {
            List<Appointment> appointments = appointmentService.getDoctorAppointments(authentication);
            return ResponseEntity.ok(appointments);
        }
        catch (RuntimeException e) {
            return ResponseEntity.status(403).body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/{id}/confirm")
    public ResponseEntity<?> approveDoctorAppointment(@PathVariable Long id, Authentication authentication) {
        try {
            return ResponseEntity.ok(appointmentService.approveDoctorAppointment(id, authentication));
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    public record RejectAppointmentRequest(String reason, java.time.LocalDate suggestedRescheduleDate, String suggestedRescheduleTime) {}

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectDoctorAppointment(@PathVariable Long id, @RequestBody(required = false) RejectAppointmentRequest request, Authentication authentication) {
        try {
            if (request == null) return ResponseEntity.badRequest().body(java.util.Map.of("message", "Rejection reason is required"));
            return ResponseEntity.ok(appointmentService.rejectDoctorAppointment(id, authentication, request.reason(), request.suggestedRescheduleDate(), request.suggestedRescheduleTime()));
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentDTO dto, Authentication authentication) {
        try {
            Appointment appointment = appointmentService.createAppointment(dto, authentication);
            return ResponseEntity.ok(appointment);
        }
        catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
