package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "health_checkup_bookings")
public class HealthCheckupBooking {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable=false) private Long patientId;
    @Column(nullable=false, length=120) private String patientName;
    @Column(nullable=false, length=200) private String packageName;
    @Column(nullable=false) private Double packagePrice;
    @Column(nullable=false, length=30) private String visitType; // HOSPITAL or HOME
    @Column(nullable=false) private LocalDate visitDate;
    @Column(nullable=false, length=20) private String visitTime;
    @Column(length=1000) private String homeAddress;
    @Column(nullable=false, length=40) private String status = "BOOKED";
    @Column(length=255) private String reportFileName;
    @Column(length=100) private String reportContentType;
    private Long labUserId;
    private LocalDateTime createdAt;
    private LocalDateTime initializedAt;
    private LocalDateTime completedAt;
    @Transient private String paymentStatus;

    @PrePersist
    public void onCreate() { if (createdAt == null) createdAt = LocalDateTime.now(); if (status == null) status = "BOOKED"; }

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public Long getPatientId(){return patientId;} public void setPatientId(Long v){patientId=v;}
    public String getPatientName(){return patientName;} public void setPatientName(String v){patientName=v;}
    public String getPackageName(){return packageName;} public void setPackageName(String v){packageName=v;}
    public Double getPackagePrice(){return packagePrice;} public void setPackagePrice(Double v){packagePrice=v;}
    public String getVisitType(){return visitType;} public void setVisitType(String v){visitType=v;}
    public LocalDate getVisitDate(){return visitDate;} public void setVisitDate(LocalDate v){visitDate=v;}
    public String getVisitTime(){return visitTime;} public void setVisitTime(String v){visitTime=v;}
    public String getHomeAddress(){return homeAddress;} public void setHomeAddress(String v){homeAddress=v;}
    public String getStatus(){return status;} public void setStatus(String v){status=v;}
    public String getReportFileName(){return reportFileName;} public void setReportFileName(String v){reportFileName=v;}
    public String getReportContentType(){return reportContentType;} public void setReportContentType(String v){reportContentType=v;}
    public Long getLabUserId(){return labUserId;} public void setLabUserId(Long v){labUserId=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
    public LocalDateTime getInitializedAt(){return initializedAt;} public void setInitializedAt(LocalDateTime v){initializedAt=v;}
    public LocalDateTime getCompletedAt(){return completedAt;} public void setCompletedAt(LocalDateTime v){completedAt=v;}
    public String getPaymentStatus(){return paymentStatus;} public void setPaymentStatus(String v){paymentStatus=v;}
}
