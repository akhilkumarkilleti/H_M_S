package com.medcare.inventory.repository;

import com.medcare.inventory.model.PurchaseOrder;
import com.medcare.inventory.model.PurchaseOrderStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface PurchaseOrderRepository extends JpaRepository<PurchaseOrder, Long> {

    List<PurchaseOrder> findByOrderDateBetweenOrderByIdDesc(LocalDate from, LocalDate to);
    Optional<PurchaseOrder> findByPoNumberIgnoreCase(String poNumber);

    /** Locks the row so two people cannot receive / cancel the same order at the same moment. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select p from PurchaseOrder p where upper(p.poNumber) = upper(:no)")
    Optional<PurchaseOrder> findForUpdate(@Param("no") String no);

    List<PurchaseOrder> findTop500ByOrderByIdDesc();

    List<PurchaseOrder> findByStatusIn(Collection<PurchaseOrderStatus> statuses);

    boolean existsBySupplier_Id(Long supplierId);

    long countByStatus(PurchaseOrderStatus status);

    long countByStatusInAndExpectedDateBefore(Collection<PurchaseOrderStatus> statuses, LocalDate date);
}