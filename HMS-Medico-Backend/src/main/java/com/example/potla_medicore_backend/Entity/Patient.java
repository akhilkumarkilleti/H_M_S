package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "patients")
public class Patient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, length = 100)
    private String patientName;
    @Column(nullable = false, length = 20, unique = true)
    private String phoneNumber;
    @Column(nullable = false, length = 20)
    private String patientGender;
    @Column(nullable = false)
    private Integer patientAge;
    @Column(nullable = false, unique = true)
    private String email;
    @Column(nullable = false)
    private String password;



    @OneToMany(mappedBy = "patient")
    private List<MedicalReports> medicalReports;

    public List<MedicalReports> getMedicalReports() {
        return medicalReports;
    }

    public void setMedicalReports(List<MedicalReports> medicalReports) {
        this.medicalReports = medicalReports;
    }

    public Patient() {}
    public Long getId(){return id;}
    public void setId(Long id){this.id=id;}
    public String getPatientName(){return patientName;}
    public void setPatientName(String v){patientName=v;}
    public String getPhoneNumber(){return phoneNumber;}
    public void setPhoneNumber(String v){phoneNumber=v;}
    public String getPatientGender(){return patientGender;}
    public void setPatientGender(String v){patientGender=v;}
    public Integer getPatientAge(){return patientAge;}
    public void setPatientAge(Integer v){patientAge=v;}
    public String getEmail(){return email;}
    public void setEmail(String v){email=v;}
    public String getPassword(){return password;}
    public void setPassword(String v){password=v;}
}
