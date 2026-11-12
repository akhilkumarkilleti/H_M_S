package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Dto.AdminAppointmentDTO;
import com.example.potla_medicore_backend.Dto.AppointmentDTO;
import com.example.potla_medicore_backend.Dto.PatientAppointmentDTO;
import com.example.potla_medicore_backend.Entity.*;
import com.example.potla_medicore_backend.Repository.AppointmentRepository;
import com.example.potla_medicore_backend.Repository.DoctorRepository;
import com.example.potla_medicore_backend.Repository.PatientRepository;
import com.example.potla_medicore_backend.Repository.DoctorAvailabilityRepository;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalTime;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import org.springframework.security.core.Authentication;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final ActivityLogService activityLogService;
    private final DoctorAvailabilityRepository availabilityRepository;
    private final BillingService billingService;

    public AppointmentService(AppointmentRepository appointmentRepository, DoctorRepository doctorRepository, PatientRepository patientRepository,
                              ActivityLogService activityLogService, DoctorAvailabilityRepository availabilityRepository,
                              BillingService billingService) {
        this.appointmentRepository = appointmentRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
        this.activityLogService = activityLogService;
        this.availabilityRepository = availabilityRepository;
        this.billingService = billingService;
    }

    public Appointment createAppointment(AppointmentDTO dto, Authentication authentication) {
        validateRequest(dto);
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Please login as a patient before booking an appointment");
        }
        LocalDate today = LocalDate.now();
        if (dto.getAppointmentDate().isBefore(today) || dto.getAppointmentDate().isAfter(today.plusDays(7))) {
            throw new RuntimeException("Appointments can only be booked within the next 7 days");
        }
        Patient patient = patientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Patient account not found. Please login again."));

        Doctor doctor = doctorRepository.findById(dto.getDoctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        if (doctor.getStatus() != DoctorStatus.APPROVED) {
            throw new RuntimeException("This doctor is not available for appointments");
        }

        // Doctors are available by default. Only an explicit INACTIVE row
        // marks leave/unavailability for a particular date.
        DoctorAvailability availability = availabilityRepository
                .findByDoctorIdAndAvailabilityDate(doctor.getId(), dto.getAppointmentDate())
                .orElse(null);
        if (availability != null && !availability.isActive()) {
            throw new RuntimeException("Doctor is unavailable on the selected date");
        }
        if (availability != null && availability.getStartTime() != null && availability.getEndTime() != null) {
            LocalTime appointmentTime = LocalTime.parse(dto.getAppointmentTime());
            if (appointmentTime.getMinute() != 0 && appointmentTime.getMinute() != 30 || appointmentTime.getSecond() != 0) {
                throw new RuntimeException("Appointments must start on a 30-minute slot");
            }
            if (appointmentTime.plusMinutes(30).isAfter(availability.getEndTime())) {
                throw new RuntimeException("The 30-minute appointment does not fit within the doctor's working hours");
            }
            if (appointmentTime.isBefore(availability.getStartTime()) || !appointmentTime.isBefore(availability.getEndTime())) {
                throw new RuntimeException("Selected time is outside the doctor's working hours");
            }
        }

        LocalTime requestedStart;
        try {
            requestedStart = LocalTime.parse(dto.getAppointmentTime());
        } catch (Exception e) {
            throw new RuntimeException("Please select a valid appointment time");
        }
        if ((requestedStart.getMinute() != 0 && requestedStart.getMinute() != 30) || requestedStart.getSecond() != 0) {
            throw new RuntimeException("Appointments must start on a 30-minute slot");
        }
        LocalTime requestedEnd = requestedStart.plusMinutes(30);
        boolean doctorAlreadyBooked = appointmentRepository.findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(doctor.getId()).stream()
                .filter(existing -> existing.getAppointmentDate().equals(dto.getAppointmentDate()) && existing.getStatus() != AppointmentStatus.CANCELLED)
                .anyMatch(existing -> {
                    LocalTime existingStart = LocalTime.parse(existing.getAppointmentTime());
                    return requestedStart.isBefore(existingStart.plusMinutes(30)) && existingStart.isBefore(requestedEnd);
                });

        if (doctorAlreadyBooked) {
            throw new RuntimeException("This doctor is already booked for the selected date and time");
        }

        boolean patientAlreadyBooked = appointmentRepository
                .existsByPatientIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        patient.getId(),
                        dto.getAppointmentDate(),
                        dto.getAppointmentTime(),
                        AppointmentStatus.CANCELLED
                );

        if (patientAlreadyBooked) {
            throw new RuntimeException("You already have an appointment at this date and time");
        }

        Appointment appointment = new Appointment();
        appointment.setDoctor(doctor);
        appointment.setPatientId(patient.getId());
        appointment.setPatientName(dto.getPatientName().trim());
        appointment.setPatientGender(dto.getPatientGender().trim());
        appointment.setPatientAge(dto.getPatientAge());
        appointment.setProblem(dto.getProblem().trim());
        appointment.setAppointmentDate(dto.getAppointmentDate());
        appointment.setAppointmentTime(dto.getAppointmentTime().trim());
        appointment.setStatus(AppointmentStatus.PENDING);

        Appointment saved=appointmentRepository.save(appointment);
        activityLogService.log(authentication, patient.getId(), "APPOINTMENT", "BOOKED", "Booked appointment with Dr. " + doctor.getFullName() + " for " + dto.getAppointmentDate() + " " + dto.getAppointmentTime());
        return saved;
    }



    public List<AdminAppointmentDTO> getAllAppointmentsForAdmin() {
        return appointmentRepository.findAll().stream()
                .map(AdminAppointmentDTO::from)
                .toList();
    }

    public List<String> getBookedSlots(Long doctorId, LocalDate date) {
        return appointmentRepository.findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(doctorId).stream()
                .filter(a -> a.getAppointmentDate().equals(date) && a.getStatus() != AppointmentStatus.CANCELLED)
                .map(Appointment::getAppointmentTime).toList();
    }

    public boolean isDoctorAvailable(Long doctorId, LocalDate date) {
        return availabilityRepository.findByDoctorIdAndAvailabilityDate(doctorId, date)
                .map(DoctorAvailability::isActive).orElse(true);
    }

    public Map<String, Object> getDoctorAvailability(Long doctorId, LocalDate date) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        DoctorAvailability row = availabilityRepository.findByDoctorIdAndAvailabilityDate(doctorId, date).orElse(null);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("active", row == null || row.isActive());
        result.put("startTime", row == null ? null : row.getStartTime());
        result.put("endTime", row == null ? null : row.getEndTime());
        result.put("availableTimings", doctor.getAvailableTimings());
        return result;
    }

    public List<PatientAppointmentDTO> getPatientAppointments(Authentication authentication) {
        Patient patient = getAuthenticatedPatient(authentication);
        return appointmentRepository
                .findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patient.getId())
                .stream()
                .map(PatientAppointmentDTO::from)
                .toList();
    }

    public List<Appointment> getDoctorAppointments(Authentication authentication) {
        Doctor doctor = getAuthenticatedDoctor(authentication);

        if (doctor.getStatus() != DoctorStatus.APPROVED) {
            throw new RuntimeException("Only approved doctors can view appointments");
        }

        return appointmentRepository.findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(doctor.getId())
                .stream()
                .map(billingService::attachAppointmentPaymentStatus)
                .toList();
    }

    @Transactional
    public Appointment approveDoctorAppointment(Long appointmentId, Authentication authentication) {
        Doctor doctor = getAuthenticatedDoctor(authentication);

        if (doctor.getStatus() != DoctorStatus.APPROVED) {
            throw new RuntimeException("Only approved doctors can confirm appointments");
        }

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        
        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("You are not authorized to confirm this appointment");
        }
        
        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new RuntimeException("Cancelled appointments cannot be confirmed");
        }
        
        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new RuntimeException("Only pending appointments can be confirmed");
        }
        appointment.setStatus(AppointmentStatus.CONFIRMED);

        Appointment saved=appointmentRepository.save(appointment);
        billingService.createInvoiceForConfirmedAppointment(saved);
        activityLogService.log(authentication, appointment.getPatientId(), "APPOINTMENT", "CONFIRMED", "Doctor confirmed appointment #" + appointment.getId());
        return saved;
    }

    //unnesseary or notused service..
    public Appointment rejectDoctorAppointment(Long appointmentId, Authentication authentication, String reason, LocalDate suggestedDate, String suggestedTime) {

        Doctor doctor = getAuthenticatedDoctor(authentication);

        if (doctor.getStatus() != DoctorStatus.APPROVED) {
            throw new RuntimeException("Only approved doctors can reject appointments");
        }

        Appointment appointment = appointmentRepository
                .findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        if (!appointment.getDoctor().getId().equals(doctor.getId())) {
            throw new RuntimeException("You are not authorized to reject this appointment");
        }

        if (appointment.getStatus() != AppointmentStatus.PENDING) {
            throw new RuntimeException("Only pending appointments can be rejected");
        }

        if (reason == null || reason.isBlank()) {
            throw new RuntimeException("Please provide a reason for rejecting this appointment");
        }
        appointment.setStatus(AppointmentStatus.REJECTED);
        appointment.setRejectionReason(reason.trim());
        if ((suggestedDate == null) != (suggestedTime == null || suggestedTime.isBlank())) {
            throw new RuntimeException("Provide both a reschedule date and time, or leave both empty");
        }
        if (suggestedDate != null) {
            if (suggestedDate.isBefore(LocalDate.now())) throw new RuntimeException("Suggested reschedule date cannot be in the past");
            appointment.setSuggestedRescheduleDate(suggestedDate);
            appointment.setSuggestedRescheduleTime(suggestedTime.trim());
        }

        Appointment saved=appointmentRepository.save(appointment);
        String details = "Doctor rejected appointment #" + appointment.getId() + ". Reason: " + reason.trim();
        if (suggestedDate != null) details += ". Suggested reschedule: " + suggestedDate + " " + suggestedTime;
        activityLogService.log(authentication, appointment.getPatientId(), "APPOINTMENT", "REJECTED", details);
        return saved;
    }



    private Patient getAuthenticatedPatient(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Please login as a patient");
        }
        return patientRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Patient account not found. Please login again."));
    }

    private Doctor getAuthenticatedDoctor(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Please login as a doctor");
        }

        return doctorRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Doctor account not found. Please login again."));
    }

    private void validateRequest(AppointmentDTO dto) {
        if (dto == null) {
            throw new RuntimeException("Appointment details are required");
        }

        if (dto.getDoctorId() == null) {
            throw new RuntimeException("Doctor is required");
        }

        if (dto.getPatientName() == null || dto.getPatientName().isBlank()) {
            throw new RuntimeException("Patient name is required");
        }

        if (dto.getPatientName().trim().length() > 100) {
            throw new RuntimeException("Patient name cannot exceed 100 characters");
        }

        if (dto.getPatientGender() == null || dto.getPatientGender().isBlank()) {
            throw new RuntimeException("Patient Gender is required");
        }

        if (dto.getPatientAge() == null || dto.getPatientAge() < 1 || dto.getPatientAge() > 120) {
            throw new RuntimeException("Patient age must be between 1 and 120");
        }

        if (dto.getProblem() == null || dto.getProblem().isBlank()) {
            throw new RuntimeException("Please enter the problem or reason for the appointment");
        }

        if (dto.getProblem().trim().length() > 1000) {
            throw new RuntimeException("Problem description cannot exceed 1000 characters");
        }

        if (dto.getAppointmentDate() == null) {
            throw new RuntimeException("Appointment date is required");
        }

        if (dto.getAppointmentTime() == null || dto.getAppointmentTime().isBlank()) {
            throw new RuntimeException("Appointment time is required");
        }
    }
}
