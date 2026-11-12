package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.PaymentRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRequestRepository extends JpaRepository<PaymentRequest, Long> {

    List<PaymentRequest> findByPatientId(Long patientId);

    List<PaymentRequest> findAllByOrderByCreatedAtDesc();

    java.util.Optional<PaymentRequest> findByAppointmentId(Long appointmentId);

    List<PaymentRequest> findByPatientIdAndAppointmentIdIsNotNullOrderByCreatedAtDesc(Long patientId);

    List<PaymentRequest> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    java.util.Optional<PaymentRequest> findByInvoiceTypeAndServiceItemId(String invoiceType, Long serviceItemId);
}

