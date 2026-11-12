package com.medcare.inventory.repository;

import com.medcare.inventory.model.StockItem;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StockItemRepository extends JpaRepository<StockItem, Long> {

    Optional<StockItem> findByItemCodeIgnoreCase(String itemCode);

    /** Locks the row so two people cannot change the same quantity at the same moment. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select s from StockItem s where upper(s.itemCode) = upper(:code)")
    Optional<StockItem> findForUpdate(@Param("code") String code);

    boolean existsByNameIgnoreCaseAndIdNot(String name, Long id);

    List<StockItem> findAllByOrderByIdAsc();
}