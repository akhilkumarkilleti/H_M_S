package com.example.potla_medicore_backend.Dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record BillingInvoiceDTO(
        Long id,
        Long appointmentId,
        String invoiceType,
        Long serviceItemId,
        String itemName,
        String invoiceNumber,
        Long amountPaise,
        String currency,
        String status,
        String paymentMethod,
        String razorpayOrderId,
        String razorpayPaymentId,
        String patientName,
        Long patientId,
        LocalDate appointmentDate,
        String appointmentTime,
        String doctorName,
        String specialization,
        String hospitalName,
        LocalDateTime createdAt,
        LocalDateTime paidAt,
        boolean paymentExpired
) {}
