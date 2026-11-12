package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "lab_reports")
public class LabReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable=false)
    private Long patientId;
    @Column
    private Long labTestId;
    @Column(nullable=false)
    private Long labUserId;
    @Column(nullable=false, length=200)
    private String reportName;
    @Column(nullable=false, length=255)
    private String fileName;
    @Column(nullable=false, length=100)
    private String contentType;
    @Column(nullable=false)
    private LocalDateTime uploadedAt;

    @PrePersist
    public void onCreate(){ if(uploadedAt==null) uploadedAt=LocalDateTime.now(); }
    public Long getId(){return id;}
    public void setId(Long v){id=v;}
    public Long getPatientId(){return patientId;}
    public void setPatientId(Long v){patientId=v;}
    public Long getLabTestId(){return labTestId;}
    public void setLabTestId(Long v){labTestId=v;}
    public Long getLabUserId(){return labUserId;}
    public void setLabUserId(Long v){labUserId=v;}
    public String getReportName(){return reportName;}
    public void setReportName(String v){reportName=v;}
    public String getFileName(){return fileName;}
    public void setFileName(String v){fileName=v;}
    public String getContentType(){return contentType;}
    public void setContentType(String v){contentType=v;}
    public LocalDateTime getUploadedAt(){return uploadedAt;}
    public void setUploadedAt(LocalDateTime v){uploadedAt=v;}
}
