package com.medcare.inventory.repository;

import com.medcare.inventory.model.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {
    List<StockMovement> findByCreatedAtBetweenOrderByIdDesc(LocalDateTime from, LocalDateTime to);
    List<StockMovement> findTop200ByOrderByIdDesc();
    List<StockMovement> findTop200ByItem_ItemCodeIgnoreCaseOrderByIdDesc(String itemCode);
    boolean existsByItem_Id(Long itemId);
}