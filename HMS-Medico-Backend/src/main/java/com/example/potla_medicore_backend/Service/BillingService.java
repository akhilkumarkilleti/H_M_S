package com.example.potla_medicore_backend.Service;

import com.example.potla_medicore_backend.Dto.BillingInvoiceDTO;
import com.example.potla_medicore_backend.Entity.Appointment;
import com.example.potla_medicore_backend.Entity.AppointmentStatus;
import com.example.potla_medicore_backend.Entity.Patient;
import com.example.potla_medicore_backend.Entity.PaymentRequest;
import com.example.potla_medicore_backend.Entity.LabTest;
import com.example.potla_medicore_backend.Entity.Prescription;
import com.example.potla_medicore_backend.Entity.HealthCheckupBooking;
import com.example.potla_medicore_backend.Repository.AppointmentRepository;
import com.example.potla_medicore_backend.Repository.PatientRepository;
import com.example.potla_medicore_backend.Repository.PaymentRequestRepository;
import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.Year;
import java.util.List;

@Service
public class BillingService {
    private final PaymentRequestRepository invoices;
    private final AppointmentRepository appointments;
    private final PatientRepository patients;
    private final ActivityLogService activityLogService;
    private static final java.time.Duration PAYMENT_WINDOW = java.time.Duration.ofHours(24);

    @Value("${razorpay.api.key:}")
    private String razorpayKey;

    @Value("${razorpay.api.secret:}")
    private String razorpaySecret;

    public BillingService(PaymentRequestRepository invoices, AppointmentRepository appointments, PatientRepository patients, ActivityLogService activityLogService) {
        this.invoices = invoices;
        this.appointments = appointments;
        this.patients = patients;
        this.activityLogService = activityLogService;
    }

    @Transactional
    public PaymentRequest createInvoiceForConfirmedAppointment(Appointment appointment) {
        if (appointment.getStatus() != AppointmentStatus.CONFIRMED) {
            throw new IllegalStateException("An invoice can only be created for a confirmed appointment.");
        }
        return invoices.findByAppointmentId(appointment.getId()).orElseGet(() -> {
            Double fee = appointment.getDoctor().getConsultationFee();
            if (fee == null || !Double.isFinite(fee) || fee <= 0) {
                throw new IllegalStateException("Set a valid consultation fee for this doctor before confirming the appointment.");
            }
            long amountPaise = BigDecimal.valueOf(fee).multiply(BigDecimal.valueOf(100))
                    .setScale(0, RoundingMode.HALF_UP).longValueExact();
            PaymentRequest invoice = new PaymentRequest();
            invoice.setAppointmentId(appointment.getId());
            invoice.setInvoiceType("APPOINTMENT");
            invoice.setServiceItemId(appointment.getId());
            invoice.setItemName("Appointment consultation");
            invoice.setPatientId(appointment.getPatientId());
            invoice.setPatientName(appointment.getPatientName());
            invoice.setAmount(amountPaise);
            invoice.setStatus(PaymentRequest.PaymentStatus.PENDING);
            invoice.setCreatedAt(LocalDateTime.now());
            PaymentRequest saved = invoices.save(invoice);
            saved.setInvoiceNumber("INV-" + Year.now().getValue() + "-" + String.format("%06d", saved.getId()));
            return invoices.save(saved);
        });
    }

    @Transactional(readOnly = true)
    public List<BillingInvoiceDTO> getAllInvoices() {
        return invoices.findAllByOrderByCreatedAtDesc().stream().map(this::toDto).toList();
    }

    @Transactional
    public BillingInvoiceDTO renewInvoice(Long invoiceId) {
        PaymentRequest invoice = invoices.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found."));
        if (invoice.getStatus() == PaymentRequest.PaymentStatus.PAID) {
            throw new IllegalStateException("A paid invoice cannot be renewed.");
        }
        requireExpiredInvoice(invoice);

        Long appointmentId = invoice.getAppointmentId();
        Long serviceItemId = invoice.getServiceItemId();
        Long relatedAppointmentId = invoice.getRelatedAppointmentId() != null
                ? invoice.getRelatedAppointmentId() : appointmentId;

        // Preserve the expired invoice for history and move the active service links
        // to a fresh invoice with a new number and a new 24-hour payment window.
        invoice.setAppointmentId(null);
        invoice.setServiceItemId(null);
        invoice.setRelatedAppointmentId(relatedAppointmentId);
        invoices.saveAndFlush(invoice);

        PaymentRequest renewed = new PaymentRequest();
        renewed.setAppointmentId(appointmentId);
        renewed.setInvoiceType(invoice.getInvoiceType());
        renewed.setServiceItemId(serviceItemId);
        renewed.setRelatedAppointmentId(relatedAppointmentId);
        renewed.setHealthCheckupBookingId(invoice.getHealthCheckupBookingId());
        renewed.setItemName(invoice.getItemName());
        renewed.setPatientId(invoice.getPatientId());
        renewed.setPatientName(invoice.getPatientName());
        renewed.setAmount(invoice.getAmount());
        renewed.setStatus(PaymentRequest.PaymentStatus.PENDING);
        renewed.setCreatedAt(LocalDateTime.now());
        PaymentRequest saved = invoices.save(renewed);
        saved.setInvoiceNumber("INV-" + Year.now().getValue() + "-" + String.format("%06d", saved.getId()));
        return toDto(invoices.save(saved));
    }

    @Transactional
    public List<BillingInvoiceDTO> getMyInvoices(Authentication authentication) {
        Patient patient = requirePatient(authentication);
        // Generate invoices for confirmed appointments that predate automatic billing.
        // Invoice creation is idempotent, so this also safely handles a repeated request.
        for (Appointment appointment : appointments.findByPatientIdOrderByAppointmentDateDescAppointmentTimeDesc(patient.getId())) {
            if (appointment.getStatus() == AppointmentStatus.CONFIRMED) {
                try {
                    createInvoiceForConfirmedAppointment(appointment);
                } catch (IllegalStateException ignored) {
                    // Keep other invoices visible if this appointment has no valid doctor fee yet.
                }
            }
        }
        return invoices.findByPatientIdOrderByCreatedAtDesc(patient.getId())
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public PaymentRequest createInvoiceForLabTest(LabTest test) {
        return createServiceInvoice("LAB_TEST", test.getId(), test.getPatientId(), test.getPatientName(),
                test.getTestName(), test.getPricePaise(), test.getAppointmentId(), null);
    }

    @Transactional
    public PaymentRequest createInvoiceForPrescription(Prescription prescription) {
        return createServiceInvoice("MEDICINE", prescription.getId(), prescription.getPatientId(), prescription.getPatientName(),
                prescription.getMedicine(), prescription.getPricePaise(), prescription.getAppointmentId(), null);
    }

    @Transactional
    public PaymentRequest createInvoiceForHealthCheckup(HealthCheckupBooking booking) {
        long amountPaise = BigDecimal.valueOf(booking.getPackagePrice()).multiply(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP).longValueExact();
        return createServiceInvoice("HEALTH_CHECKUP", booking.getId(), booking.getPatientId(), booking.getPatientName(),
                booking.getPackageName(), amountPaise, null, booking.getId());
    }

    public String getServiceInvoiceStatus(String type, Long itemId) {
        return invoices.findByInvoiceTypeAndServiceItemId(type, itemId)
                .map(invoice -> invoice.getStatus() == PaymentRequest.PaymentStatus.PAID ? "PAID"
                        : "PAY_AT_HOSPITAL".equals(invoice.getPaymentMethod()) ? "PAY_AT_HOSPITAL" : "PENDING")
                .orElse("INVOICE_MISSING");
    }

    public boolean isServiceInvoicePaid(String type, Long itemId) {
        return invoices.findByInvoiceTypeAndServiceItemId(type, itemId)
                .map(invoice -> invoice.getStatus() == PaymentRequest.PaymentStatus.PAID)
                .orElse(false);
    }

    public java.util.Map<String, Object> getCatalog() {
        return java.util.Map.of(
                "labTests", BillingCatalog.LAB_TESTS,
                "medicines", BillingCatalog.MEDICINES,
                "healthCheckups", BillingCatalog.HEALTH_CHECKUPS,
                "notice", "Sample rates for development. Replace with hospital-approved prices before live billing."
        );
    }

    private PaymentRequest createServiceInvoice(String type, Long itemId, Long patientId, String patientName,
                                                 String itemName, Long amountPaise, Long relatedAppointmentId,
                                                 Long healthCheckupBookingId) {
        if (itemId == null || patientId == null || amountPaise == null || amountPaise <= 0) {
            throw new IllegalArgumentException("A valid priced service is required to create an invoice.");
        }
        return invoices.findByInvoiceTypeAndServiceItemId(type, itemId).orElseGet(() -> {
            PaymentRequest invoice = new PaymentRequest();
            invoice.setInvoiceType(type);
            invoice.setServiceItemId(itemId);
            invoice.setRelatedAppointmentId(relatedAppointmentId);
            invoice.setHealthCheckupBookingId(healthCheckupBookingId);
            invoice.setItemName(itemName);
            invoice.setPatientId(patientId);
            invoice.setPatientName(patientName);
            invoice.setAmount(amountPaise);
            invoice.setStatus(PaymentRequest.PaymentStatus.PENDING);
            invoice.setCreatedAt(LocalDateTime.now());
            PaymentRequest saved = invoices.save(invoice);
            saved.setInvoiceNumber("INV-" + Year.now().getValue() + "-" + String.format("%06d", saved.getId()));
            return invoices.save(saved);
        });
    }

    @Transactional
    public RazorpayOrderDTO createOnlineOrder(Long invoiceId, Authentication authentication) throws Exception {
        PaymentRequest invoice = requireOwnedInvoice(invoiceId, authentication);
        if (invoice.getStatus() == PaymentRequest.PaymentStatus.PAID) {
            throw new IllegalStateException("This invoice is already paid.");
        }
        requirePaymentWindowOpen(invoice);
        requireRazorpayConfiguration();

        JSONObject request = new JSONObject();
        request.put("amount", invoice.getAmount());
        request.put("currency", "INR");
        request.put("receipt", "inv_" + invoice.getId() + "_" + System.currentTimeMillis());
        Order order = new RazorpayClient(razorpayKey, razorpaySecret).orders.create(request);
        String orderId = order.get("id");
        invoice.setRazorpayOrderId(orderId);
        invoice.setPaymentMethod("RAZORPAY");
        invoice.setStatus(PaymentRequest.PaymentStatus.PENDING);
        invoices.save(invoice);
        return new RazorpayOrderDTO(razorpayKey, orderId, invoice.getAmount(), "INR", invoice.getInvoiceNumber());
    }

    @Transactional
    public BillingInvoiceDTO verifyOnlinePayment(Long invoiceId, String orderId, String paymentId, String signature,
                                                  Authentication authentication) throws Exception {
        PaymentRequest invoice = requireOwnedInvoice(invoiceId, authentication);
        requireRazorpayConfiguration();
        if (invoice.getStatus() == PaymentRequest.PaymentStatus.PAID) {
            return toDto(invoice);
        }
        requirePaymentWindowOpen(invoice);
        if (!StringUtils.hasText(orderId) || !orderId.equals(invoice.getRazorpayOrderId())
                || !StringUtils.hasText(paymentId) || !StringUtils.hasText(signature)) {
            throw new IllegalArgumentException("Payment details do not match this invoice.");
        }
        if (!Utils.verifySignature(orderId + "|" + paymentId, signature, razorpaySecret)) {
            throw new IllegalArgumentException("Razorpay payment signature is invalid.");
        }
        invoice.setRazorpayPaymentId(paymentId);
        invoice.setPaymentMethod("RAZORPAY");
        invoice.setStatus(PaymentRequest.PaymentStatus.PAID);
        invoice.setPaidAt(LocalDateTime.now());
        PaymentRequest saved = invoices.save(invoice);
        activityLogService.log(authentication, invoice.getPatientId(), "BILLING", "PAYMENT_COMPLETED",
                "Payment completed for " + invoice.getItemName() + " (" + invoice.getInvoiceNumber() + ")");
        return toDto(saved);
    }

    @Transactional
    public BillingInvoiceDTO selectPayAtHospital(Long invoiceId, Authentication authentication) {
        PaymentRequest invoice = requireOwnedInvoice(invoiceId, authentication);
        if (invoice.getStatus() == PaymentRequest.PaymentStatus.PAID) {
            throw new IllegalStateException("This invoice is already paid.");
        }
        requirePaymentWindowOpen(invoice);
        invoice.setPaymentMethod("PAY_AT_HOSPITAL");
        // Keep the persisted status at PENDING for compatibility with existing MySQL
        // payment.status enum columns; the selected method is returned as the UI state.
        invoice.setStatus(PaymentRequest.PaymentStatus.PENDING);
        PaymentRequest saved = invoices.save(invoice);
        activityLogService.log(authentication, invoice.getPatientId(), "BILLING", "PAYMENT_METHOD_SELECTED",
                "Selected pay at hospital for " + invoice.getItemName() + " (" + invoice.getInvoiceNumber() + ")");
        return toDto(saved);
    }

    public Appointment attachAppointmentPaymentStatus(Appointment appointment) {
        PaymentRequest invoice = invoices.findByAppointmentId(appointment.getId()).orElse(null);
        if (invoice == null) {
            appointment.setPaymentStatus(appointment.getStatus() == AppointmentStatus.CONFIRMED
                    ? "INVOICE_MISSING" : "NOT_DUE");
            appointment.setPaymentMethod(null);
            return appointment;
        }

        String displayStatus = invoice.getStatus() == PaymentRequest.PaymentStatus.PAID
                ? "PAID"
                : "PAY_AT_HOSPITAL".equals(invoice.getPaymentMethod())
                    ? "PAY_AT_HOSPITAL"
                    : "PENDING";
        appointment.setPaymentStatus(displayStatus);
        appointment.setPaymentMethod(invoice.getPaymentMethod());
        return appointment;
    }

    private Patient requirePatient(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new IllegalStateException("Please sign in as a patient.");
        }
        return patients.findByEmail(authentication.getName())
                .orElseThrow(() -> new IllegalStateException("Patient account not found."));
    }

    private PaymentRequest requireOwnedInvoice(Long invoiceId, Authentication authentication) {
        Patient patient = requirePatient(authentication);
        PaymentRequest invoice = invoices.findById(invoiceId)
                .orElseThrow(() -> new IllegalArgumentException("Invoice not found."));
        boolean hasBillableItem = invoice.getAppointmentId() != null
                || (invoice.getInvoiceType() != null && invoice.getServiceItemId() != null);
        if (!patient.getId().equals(invoice.getPatientId()) || !hasBillableItem) {
            throw new IllegalArgumentException("Invoice not found for this patient.");
        }
        return invoice;
    }

    private BillingInvoiceDTO toDto(PaymentRequest invoice) {
        Long relatedAppointmentId = invoice.getAppointmentId() != null
                ? invoice.getAppointmentId() : invoice.getRelatedAppointmentId();
        Appointment appointment = relatedAppointmentId == null ? null
                : appointments.findById(relatedAppointmentId).orElse(null);
        String displayStatus = invoice.getStatus() != PaymentRequest.PaymentStatus.PAID
                && "PAY_AT_HOSPITAL".equals(invoice.getPaymentMethod())
                ? "PAY_AT_HOSPITAL"
                : invoice.getStatus().name();
        String invoiceType = invoice.getInvoiceType() == null ? "APPOINTMENT" : invoice.getInvoiceType();
        String itemName = invoice.getItemName() == null ? "Appointment consultation" : invoice.getItemName();
        return new BillingInvoiceDTO(invoice.getId(), appointment == null ? relatedAppointmentId : appointment.getId(),
                invoiceType, invoice.getServiceItemId(), itemName, invoice.getInvoiceNumber(),
                invoice.getAmount(), "INR", displayStatus, invoice.getPaymentMethod(),
                invoice.getRazorpayOrderId(), invoice.getRazorpayPaymentId(), invoice.getPatientName(), invoice.getPatientId(),
                appointment == null ? null : appointment.getAppointmentDate(),
                appointment == null ? null : appointment.getAppointmentTime(),
                appointment == null || appointment.getDoctor() == null ? null : appointment.getDoctor().getFullName(),
                appointment == null || appointment.getDoctor() == null ? null : appointment.getDoctor().getSpecialization(),
                appointment == null || appointment.getDoctor() == null ? null : appointment.getDoctor().getHospitalName(),
                invoice.getCreatedAt(), invoice.getPaidAt(), isPaymentExpired(invoice));
    }

    private boolean isPaymentExpired(PaymentRequest invoice) {
        return invoice.getCreatedAt() != null
                && !LocalDateTime.now().isBefore(invoice.getCreatedAt().plus(PAYMENT_WINDOW));
    }

    private void requirePaymentWindowOpen(PaymentRequest invoice) {
        if (isPaymentExpired(invoice)) {
            throw new IllegalStateException("This invoice expired 24 hours after it was generated. Please contact the hospital for a new invoice.");
        }
    }

    private void requireExpiredInvoice(PaymentRequest invoice) {
        if (!isPaymentExpired(invoice)) {
            throw new IllegalStateException("Only expired invoices can be renewed.");
        }
    }

    private void requireRazorpayConfiguration() {
        if (!StringUtils.hasText(razorpayKey) || !StringUtils.hasText(razorpaySecret)) {
            throw new IllegalStateException("Razorpay test keys are not configured. Set RAZORPAY_API_KEY and RAZORPAY_API_SECRET in the backend environment, then restart the backend.");
        }
    }

    public record RazorpayOrderDTO(String keyId, String orderId, Long amountPaise, String currency, String invoiceNumber) {}
}
