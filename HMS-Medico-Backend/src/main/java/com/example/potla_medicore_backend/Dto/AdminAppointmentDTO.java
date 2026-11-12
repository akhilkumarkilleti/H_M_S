package com.example.potla_medicore_backend.Dto;
import com.example.potla_medicore_backend.Entity.Appointment;
import java.time.LocalDate;



public class AdminAppointmentDTO {
    private Long id; 
    private String patientName;
    private String doctorName; 
    private LocalDate appointmentDate;
    private String appointmentTime;
    private String status;
    private String rejectionReason;
    private LocalDate suggestedRescheduleDate;
    private String suggestedRescheduleTime;
    
    public AdminAppointmentDTO(){}
    public AdminAppointmentDTO(Long id,String patientName,String doctorName,LocalDate appointmentDate,String appointmentTime,String status){
        this.id=id;this.patientName=patientName;this.doctorName=doctorName;this.appointmentDate=appointmentDate;this.appointmentTime=appointmentTime;this.status=status;
        }
    public static AdminAppointmentDTO from(Appointment a){
        AdminAppointmentDTO dto = new AdminAppointmentDTO(a.getId(),a.getPatientName(),a.getDoctor()==null?"-":a.getDoctor().getFullName(),a.getAppointmentDate(),a.getAppointmentTime(),a.getStatus()==null?null:a.getStatus().name());
        dto.rejectionReason = a.getRejectionReason();
        dto.suggestedRescheduleDate = a.getSuggestedRescheduleDate();
        dto.suggestedRescheduleTime = a.getSuggestedRescheduleTime();
        return dto;
    }
    public Long getId(){return id;} 
    public String getPatientName(){return patientName;} 
    public String getDoctorName(){return doctorName;} 
    public LocalDate getAppointmentDate(){return appointmentDate;}
    public String getAppointmentTime(){return appointmentTime;} 
    public String getStatus(){return status;}
    public String getRejectionReason(){return rejectionReason;}
    public LocalDate getSuggestedRescheduleDate(){return suggestedRescheduleDate;}
    public String getSuggestedRescheduleTime(){return suggestedRescheduleTime;}
}
