package com.example.potla_medicore_backend.Dto;

import org.springframework.web.multipart.MultipartFile;

public class DoctorProfileUpdateDTO {
    private String fullName;
    private String phoneNumber;
    private String email;
    private String password;
    private String qualification;
    private String specialization;
    private Integer experienceYears;
    private Double consultationFee;
    private String city;
    private String hospitalName;
    private String availableTimings;
    private String languagesKnown;
    private String about;
    private MultipartFile profilePhoto;
    private String licenseDocument;

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }
    public String getSpecialization() { return specialization; }
    public void setSpecialization(String specialization) { this.specialization = specialization; }
    public Integer getExperienceYears() { return experienceYears; }
    public void setExperienceYears(Integer experienceYears) { this.experienceYears = experienceYears; }
    public Double getConsultationFee() { return consultationFee; }
    public void setConsultationFee(Double consultationFee) { this.consultationFee = consultationFee; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getHospitalName() { return hospitalName; }
    public void setHospitalName(String hospitalName) { this.hospitalName = hospitalName; }
    public String getAvailableTimings() { return availableTimings; }
    public void setAvailableTimings(String availableTimings) { this.availableTimings = availableTimings; }
    public String getLanguagesKnown() { return languagesKnown; }
    public void setLanguagesKnown(String languagesKnown) { this.languagesKnown = languagesKnown; }
    public String getAbout() { return about; }
    public void setAbout(String about) { this.about = about; }
    public MultipartFile getProfilePhoto() { return profilePhoto; }
    public void setProfilePhoto(MultipartFile profilePhoto) { this.profilePhoto = profilePhoto; }
    public String getLicenseDocument() { return licenseDocument; }
    public void setLicenseDocument(String licenseDocument) { this.licenseDocument = licenseDocument; }
}
