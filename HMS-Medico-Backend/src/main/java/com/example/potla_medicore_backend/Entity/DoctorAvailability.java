package com.example.potla_medicore_backend.Entity;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name="doctor_availability", uniqueConstraints=@UniqueConstraint(columnNames={"doctor_id","availability_date"}))
public class DoctorAvailability {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch=FetchType.LAZY) @JoinColumn(name="doctor_id", nullable=false)
    private Doctor doctor;
    @Column(name="availability_date", nullable=false)
    private LocalDate availabilityDate;
    @Column(nullable=false)
    private boolean active=true;
    private LocalTime startTime;
    private LocalTime endTime;

    public Long getId(){return id;} public void setId(Long v){id=v;}
    public Doctor getDoctor(){return doctor;} public void setDoctor(Doctor v){doctor=v;}
    public LocalDate getAvailabilityDate(){return availabilityDate;} public void setAvailabilityDate(LocalDate v){availabilityDate=v;}
    public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
    public LocalTime getStartTime(){return startTime;} public void setStartTime(LocalTime v){startTime=v;}
    public LocalTime getEndTime(){return endTime;} public void setEndTime(LocalTime v){endTime=v;}
}
