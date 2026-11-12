package com.example.potla_medicore_backend.Entity;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Setter
@Getter
@Entity
@Table(name="payment")
public class PaymentRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long patientId;

    @Column(unique = true)
    private Long appointmentId;

    @Column(name = "invoice_type", length = 30)
    private String invoiceType;

    @Column(name = "service_item_id")
    private Long serviceItemId;

    @Column(name = "related_appointment_id")
    private Long relatedAppointmentId;

    @Column(name = "health_checkup_booking_id")
    private Long healthCheckupBookingId;

    @Column(name = "item_name", length = 200)
    private String itemName;

    private String patientName;

    private Long amount; // amount in paise

    private String razorpayOrderId;

    private String razorpayPaymentId;

    private String invoiceNumber;

    private String paymentMethod;

    private LocalDateTime paidAt;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    private LocalDateTime createdAt;

    public enum PaymentStatus {
        PENDING,
        PAID,
        FAILED,
        PAY_AT_HOSPITAL
    }

}
