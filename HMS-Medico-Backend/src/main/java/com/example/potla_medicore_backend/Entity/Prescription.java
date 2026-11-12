package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "prescriptions")
public class Prescription {

    @Transient
    private String paymentStatus;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private Long appointmentId;
    @Column(nullable=false)
    private Long patientId;
    @Column(nullable=false)
    private Long doctorId;
    @Column(nullable=false, length=100)
    private String patientName;
    @Column(nullable=false, length=150)
    private String medicine;
    private Long pricePaise;
    @Column(nullable=false, length=100)
    private String dosage;
    @Column(length=100)
    private String dosingTimes;
    @Column(nullable=false, length=100)
    private String duration;
    @Column(length=1000)
    private String instructions;
    @Column(length=200)
    private String pharmacyName;
    @Column(nullable=false)
    private LocalDateTime prescribedAt;
    @Column(nullable=false)
    private boolean dispensed=false;
    private Long dispensedByUserId;
    private LocalDateTime dispensedAt;

    @PrePersist
    public void onCreate(){ if(prescribedAt==null) prescribedAt=LocalDateTime.now(); }
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
    public String getMedicine(){return medicine;}
    public void setMedicine(String v){medicine=v;}
    public Long getPricePaise(){return pricePaise;}
    public void setPricePaise(Long v){pricePaise=v;}
    public String getDosage(){return dosage;}
    public void setDosage(String v){dosage=v;}
    public String getDosingTimes(){return dosingTimes;}
    public void setDosingTimes(String v){dosingTimes=v;}
    public String getDuration(){return duration;}
    public void setDuration(String v){duration=v;}
    public String getInstructions(){return instructions;}
    public void setInstructions(String v){instructions=v;}
    public String getPharmacyName(){return pharmacyName;}
    public void setPharmacyName(String v){pharmacyName=v;}
    public LocalDateTime getPrescribedAt(){return prescribedAt;}
    public void setPrescribedAt(LocalDateTime v){prescribedAt=v;}
    public boolean isDispensed(){return dispensed;}
    public void setDispensed(boolean v){dispensed=v;}
    public Long getDispensedByUserId(){return dispensedByUserId;}
    public void setDispensedByUserId(Long v){dispensedByUserId=v;}
    public LocalDateTime getDispensedAt(){return dispensedAt;}
    public void setDispensedAt(LocalDateTime v){dispensedAt=v;}
}
