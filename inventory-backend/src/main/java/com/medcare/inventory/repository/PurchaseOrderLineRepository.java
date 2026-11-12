package com.medcare.inventory.repository;

import com.medcare.inventory.dto.ItemQty;
import com.medcare.inventory.model.PurchaseOrderLine;
import com.medcare.inventory.model.PurchaseOrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface PurchaseOrderLineRepository extends JpaRepository<PurchaseOrderLine, Long> {

    boolean existsByItem_Id(Long itemId);

    /** Quantity still expected from suppliers, per stock item, over orders in the given statuses. */
    @Query("select new com.medcare.inventory.dto.ItemQty(l.item.id, sum(l.orderedQty - l.receivedQty)) "
            + "from PurchaseOrderLine l where l.order.status in :statuses group by l.item.id")
    List<ItemQty> pendingByItem(@Param("statuses") Collection<PurchaseOrderStatus> statuses);
}
