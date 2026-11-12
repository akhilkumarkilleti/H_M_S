package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "vital_signs")
public class VitalSign {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private Long patientId;
    @Column(nullable=false)
    private Long nurseId;
    @Column(nullable=false)
    private Integer bpSystolic;
    @Column(nullable=false)
    private Integer bpDiastolic;
    @Column(nullable=false)
    private Double weightKg;
    @Column(nullable=false)
    private LocalDateTime recordedAt;

    @PrePersist
    public void onCreate(){ if(recordedAt==null) recordedAt=LocalDateTime.now(); }
    public Long getId(){return id;}
    public void setId(Long v){id=v;}
    public Long getPatientId(){return patientId;}
    public void setPatientId(Long v){patientId=v;}
    public Long getNurseId(){return nurseId;}
    public void setNurseId(Long v){nurseId=v;}
    public Integer getBpSystolic(){return bpSystolic;}
    public void setBpSystolic(Integer v){bpSystolic=v;}
    public Integer getBpDiastolic(){return bpDiastolic;}
    public void setBpDiastolic(Integer v){bpDiastolic=v;}
    public Double getWeightKg(){return weightKg;}
    public void setWeightKg(Double v){weightKg=v;}
    public LocalDateTime getRecordedAt(){return recordedAt;}
    public void setRecordedAt(LocalDateTime v){recordedAt=v;}
}
