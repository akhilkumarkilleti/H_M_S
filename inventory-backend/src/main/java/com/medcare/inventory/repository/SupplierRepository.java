package com.medcare.inventory.repository;


import com.medcare.inventory.model.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    Optional<Supplier> findBySupplierCodeIgnoreCase(String supplierCode);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    List<Supplier> findAllByOrderByNameAsc();
}
