package com.medcare.inventory.service;

import com.medcare.inventory.dto.SupplierRequest;
import com.medcare.inventory.dto.SupplierResponse;
import com.medcare.inventory.exception.ApiException;
import com.medcare.inventory.model.Supplier;
import com.medcare.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SupplierService {

    private final SupplierRepository suppliers;

    public List<SupplierResponse> list() {
        return suppliers.findAllByOrderByNameAsc().stream().map(SupplierResponse::from).toList();
    }

    public SupplierResponse get(String code) {
        return SupplierResponse.from(find(code));
    }

    @Transactional
    public SupplierResponse create(SupplierRequest r) {
        if (r.name() == null || r.name().isBlank()) throw bad("Supplier name is required.");
        Supplier s = new Supplier();
        apply(s, r);
        s = suppliers.save(s);
        s.setSupplierCode(String.format("SUP-%04d", s.getId()));   // saved when the transaction commits
        return SupplierResponse.from(s);
    }

    @Transactional
    public SupplierResponse update(String code, SupplierRequest r) {
        Supplier s = find(code);
        apply(s, r);
        return SupplierResponse.from(s);
    }

    private void apply(Supplier s, SupplierRequest r) {
        if (r.name() != null) {
            String n = r.name().trim();
            if (n.isEmpty()) throw bad("Supplier name cannot be empty.");
            if (suppliers.existsByNameIgnoreCaseAndIdNot(n, s.getId() == null ? -1L : s.getId()))
                throw new ApiException(HttpStatus.CONFLICT, "A supplier named \"" + n + "\" already exists.");
            s.setName(n);
        }
        if (r.contactPerson() != null) s.setContactPerson(clean(r.contactPerson()));
        if (r.phone() != null) s.setPhone(clean(r.phone()));
        if (r.email() != null) s.setEmail(clean(r.email()));
        if (r.address() != null) s.setAddress(clean(r.address()));
        if (r.taxId() != null) s.setTaxId(clean(r.taxId()));
        if (r.active() != null) s.setActive(r.active());
    }

    private Supplier find(String code) {
        return suppliers.findBySupplierCodeIgnoreCase(code)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Supplier " + code + " not found."));
    }

    private static String clean(String v) {
        return v == null || v.isBlank() ? null : v.trim();
    }

    private static ApiException bad(String message) {
        return new ApiException(HttpStatus.BAD_REQUEST, message);
    }
}