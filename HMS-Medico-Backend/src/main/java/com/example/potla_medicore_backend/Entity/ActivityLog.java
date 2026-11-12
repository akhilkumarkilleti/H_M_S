package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
public class ActivityLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long patientId;
    private Long actorId;
    @Column(nullable=false, length=40)
    private String actorRole;
    @Column(nullable=false, length=200)
    private String actorName;
    @Column(nullable=false, length=100)
    private String module;
    @Column(nullable=false, length=150)
    private String action;
    @Column(length=1000)
    private String details;
    @Column(nullable=false)
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate(){ if(createdAt==null) createdAt=LocalDateTime.now(); }

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public Long getPatientId(){return patientId;} public void setPatientId(Long v){patientId=v;}
    public Long getActorId(){return actorId;} public void setActorId(Long v){actorId=v;}
    public String getActorRole(){return actorRole;} public void setActorRole(String v){actorRole=v;}
    public String getActorName(){return actorName;} public void setActorName(String v){actorName=v;}
    public String getModule(){return module;} public void setModule(String v){module=v;}
    public String getAction(){return action;} public void setAction(String v){action=v;}
    public String getDetails(){return details;} public void setDetails(String v){details=v;}
    public LocalDateTime getCreatedAt(){return createdAt;} public void setCreatedAt(LocalDateTime v){createdAt=v;}
}
