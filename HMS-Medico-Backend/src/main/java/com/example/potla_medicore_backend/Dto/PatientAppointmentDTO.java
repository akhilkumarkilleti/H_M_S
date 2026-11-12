package com.example.potla_medicore_backend.Dto;

import com.example.potla_medicore_backend.Entity.Appointment;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class PatientAppointmentDTO {

    private Long id;
    private Long patientId;
    private String patientName;
    private String patientGender;
    private Integer patientAge;
    private String problem;
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String status;
    private LocalDateTime createdAt;
    private Long doctorId;
    private String doctorName;
    private String doctorSpecialization;
    private String hospitalName;
    private String city;
    private String rejectionReason;
    private LocalDate suggestedRescheduleDate;
    private String suggestedRescheduleTime;

    public static PatientAppointmentDTO from(Appointment appointment) {
        PatientAppointmentDTO dto = new PatientAppointmentDTO();
        dto.id = appointment.getId();
        dto.patientId = appointment.getPatientId();
        dto.patientName = appointment.getPatientName();
        dto.patientGender = appointment.getPatientGender();
        dto.patientAge = appointment.getPatientAge();
        dto.problem = appointment.getProblem();
        dto.appointmentDate = appointment.getAppointmentDate();
        dto.appointmentTime = appointment.getAppointmentTime();
        dto.status = appointment.getStatus() == null ? null : appointment.getStatus().name();
        dto.createdAt = appointment.getCreatedAt();
        dto.rejectionReason = appointment.getRejectionReason();
        dto.suggestedRescheduleDate = appointment.getSuggestedRescheduleDate();
        dto.suggestedRescheduleTime = appointment.getSuggestedRescheduleTime();
        if (appointment.getDoctor() != null) {
            dto.doctorId = appointment.getDoctor().getId();
            dto.doctorName = appointment.getDoctor().getFullName();
            dto.doctorSpecialization = appointment.getDoctor().getSpecialization();
            dto.hospitalName = appointment.getDoctor().getHospitalName();
            dto.city = appointment.getDoctor().getCity();
        }
        return dto;
    }

    public Long getId() { return id; }
    public Long getPatientId() { return patientId; }
    public String getPatientName() { return patientName; }
    public String getPatientGender() { return patientGender; }
    public Integer getPatientAge() { return patientAge; }
    public String getProblem() { return problem; }
    public LocalDate getAppointmentDate() { return appointmentDate; }
    public String getAppointmentTime() { return appointmentTime; }
    public String getStatus() { return status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public Long getDoctorId() { return doctorId; }
    public String getDoctorName() { return doctorName; }
    public String getDoctorSpecialization() { return doctorSpecialization; }
    public String getHospitalName() { return hospitalName; }
    public String getCity() { return city; }
    public String getRejectionReason() { return rejectionReason; }
    public LocalDate getSuggestedRescheduleDate() { return suggestedRescheduleDate; }
    public String getSuggestedRescheduleTime() { return suggestedRescheduleTime; }
}
