package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_tests")
public class LabTest {
    @Transient
    private String paymentStatus;

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private Long appointmentId;
    @Column(nullable=false)
    private Long patientId;
    @Column(nullable=false)
    private Long doctorId;
    @Column(nullable=false, length=100)
    private String patientName;
    @Column(nullable=false, length=200)
    private String testName;
    private Long pricePaise;
    @Column(length=1000)
    private String instructions;
    @Column(nullable=false, length=30)
    private String status = "SUGGESTED";
    @Column(nullable=false)
    private LocalDateTime suggestedAt;
    private LocalDateTime completedAt;

    @PrePersist
    public void onCreate(){ if(suggestedAt==null) suggestedAt=LocalDateTime.now(); if(status==null) status="SUGGESTED"; }


    public String getPaymentStatus(){return paymentStatus;}
    public void setPaymentStatus(String value){paymentStatus=value;}
    public Long getId(){return id;}
    public void setId(Long v){id=v;}
    public Long getAppointmentId(){return appointmentId;}
    public void setAppointmentId(Long v){appointmentId=v;}
    public Long getPatientId(){return patientId;}
    public void setPatientId(Long v){patientId=v;}
    public Long getDoctorId(){return doctorId;}
    public void setDoctorId(Long v){doctorId=v;}
    public String getPatientName(){return patientName;}
    public void setPatientName(String v){patientName=v;}
    public String getTestName(){return testName;}
    public void setTestName(String v){testName=v;}
    public Long getPricePaise(){return pricePaise;}
    public void setPricePaise(Long v){pricePaise=v;}
    public String getInstructions(){return instructions;}
    public void setInstructions(String v){instructions=v;}
    public String getStatus(){return status;}
    public void setStatus(String v){status=v;}
    public LocalDateTime getSuggestedAt(){return suggestedAt;}
    public void setSuggestedAt(LocalDateTime v){suggestedAt=v;}
    public LocalDateTime getCompletedAt(){return completedAt;}
    public void setCompletedAt(LocalDateTime v){completedAt=v;}
}
