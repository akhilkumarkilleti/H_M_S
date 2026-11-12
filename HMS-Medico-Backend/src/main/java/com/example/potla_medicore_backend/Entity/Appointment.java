package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "doctor_id", nullable = false)
    private Doctor doctor;

    // Existing patient account id. The patient must be logged in to book.
    @Column(nullable = false)
    private Long patientId;

    // Patient details entered during appointment booking.
    @Column(name = "patient_name", nullable = false, length = 100)
    private String patientName;

    @Column(name = "patient_Gender", nullable = false, length = 20)
    private String patientGender;

    @Column(name = "patient_age", nullable = false)
    private Integer patientAge;

    @Column(name = "problem", nullable = false, length = 1000)
    private String problem;

    @Column(nullable = false)
    private LocalDate appointmentDate;

    @Column(nullable = false, length = 20)
    private String appointmentTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private AppointmentStatus status = AppointmentStatus.PENDING;

    @Transient
    private String paymentStatus;

    @Transient
    private String paymentMethod;


    @Column(length = 1000)
    private String rejectionReason;

    @Column(name = "suggested_reschedule_date")
    private LocalDate suggestedRescheduleDate;

    @Column(name = "suggested_reschedule_time", length = 20)
    private String suggestedRescheduleTime;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Doctor getDoctor() {
        return doctor;
    }

    public void setDoctor(Doctor doctor) {
        this.doctor = doctor;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getPatientGender() {
        return patientGender;
    }

    public void setPatientGender(String patientGender) {
        this.patientGender = patientGender;
    }

    public Integer getPatientAge() {
        return patientAge;
    }

    public void setPatientAge(Integer patientAge) {
        this.patientAge = patientAge;
    }

    public String getProblem() {
        return problem;
    }

    public void setProblem(String problem) {
        this.problem = problem;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(LocalDate appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public AppointmentStatus getStatus() {
        return status;
    }

    public void setStatus(AppointmentStatus status) {
        this.status = status;
    }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }
    public LocalDate getSuggestedRescheduleDate() { return suggestedRescheduleDate; }
    public void setSuggestedRescheduleDate(LocalDate date) { this.suggestedRescheduleDate = date; }
    public String getSuggestedRescheduleTime() { return suggestedRescheduleTime; }
    public void setSuggestedRescheduleTime(String time) { this.suggestedRescheduleTime = time; }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
