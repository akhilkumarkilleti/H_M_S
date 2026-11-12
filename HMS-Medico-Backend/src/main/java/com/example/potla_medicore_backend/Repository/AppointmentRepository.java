package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.Appointment;
import com.example.potla_medicore_backend.Entity.AppointmentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    boolean existsByDoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(Long doctorId, LocalDate appointmentDate, String appointmentTime, AppointmentStatus status);
    boolean existsByPatientIdAndAppointmentDateAndAppointmentTimeAndStatusNot(Long patientId, LocalDate appointmentDate, String appointmentTime, AppointmentStatus status);


    boolean existsByDoctorIdAndPatientIdAndStatus(Long doctorId, Long patientId, AppointmentStatus status);

    List<Appointment> findByDoctorIdOrderByAppointmentDateAscAppointmentTimeAsc(Long doctorId);

    List<Appointment> findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(Long patientId);
    List<Appointment> findByAppointmentDateGreaterThanEqualOrderByAppointmentDateAscAppointmentTimeAsc(LocalDate date);
    void deleteByDoctorId(Long doctorId);
}
