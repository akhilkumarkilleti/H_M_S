package com.medcare.inventory.repository;

import com.medcare.inventory.model.PurchaseReceipt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface PurchaseReceiptRepository extends JpaRepository<PurchaseReceipt, Long> {

    List<PurchaseReceipt> findByOrder_IdOrderByIdAsc(Long orderId);

    /** Value of goods received between two dates (null when nothing was received). */
    @Query("select sum(r.quantity * r.line.unitPrice) from PurchaseReceipt r "
            + "where r.receivedDate between :from and :to")
    BigDecimal valueBetween(@Param("from") LocalDate from, @Param("to") LocalDate to);
}
