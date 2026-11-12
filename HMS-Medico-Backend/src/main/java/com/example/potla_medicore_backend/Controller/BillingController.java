package com.example.potla_medicore_backend.Controller;

import com.example.potla_medicore_backend.Dto.BillingInvoiceDTO;
import com.example.potla_medicore_backend.Service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/billing/invoices")
@CrossOrigin(origins = {"http://localhost:3000"})
public class BillingController {
    private static final Logger log = LoggerFactory.getLogger(BillingController.class);
    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/my")
    public List<BillingInvoiceDTO> myInvoices(Authentication authentication) {
        return billingService.getMyInvoices(authentication);
    }

    @GetMapping("/catalog")
    public java.util.Map<String, Object> catalog() {
        return billingService.getCatalog();
    }

    @PostMapping("/{invoiceId}/razorpay-order")
    public ResponseEntity<?> createOrder(@PathVariable Long invoiceId, Authentication authentication) {
        try {
            return ResponseEntity.ok(billingService.createOnlineOrder(invoiceId, authentication));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("message", "Unable to start Razorpay checkout. Please retry or choose pay at hospital."));
        }
    }

    @PostMapping("/{invoiceId}/verify")
    public ResponseEntity<?> verifyPayment(@PathVariable Long invoiceId,
                                           @RequestBody VerifyPaymentRequest request,
                                           Authentication authentication) {
        try {
            return ResponseEntity.ok(billingService.verifyOnlinePayment(invoiceId, request.orderId(),
                    request.paymentId(), request.signature(), authentication));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(502).body(Map.of("message", "Unable to verify Razorpay payment."));
        }
    }

    @PostMapping("/{invoiceId}/pay-at-hospital")
    public ResponseEntity<?> payAtHospital(@PathVariable Long invoiceId, Authentication authentication) {
        try {
            return ResponseEntity.ok(billingService.selectPayAtHospital(invoiceId, authentication));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            log.error("Failed to save pay-at-hospital selection for invoice {}", invoiceId, e);
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Unable to save this payment choice. Please retry; if it continues, check the backend log."));
        }
    }

    public record VerifyPaymentRequest(String orderId, String paymentId, String signature) {}
}
