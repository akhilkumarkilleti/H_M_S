package com.medcare.inventory.repository;

import com.medcare.inventory.model.MaintenanceRecord;
import com.medcare.inventory.model.MaintenanceStatus;
import com.medcare.inventory.model.MaintenanceType;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface MaintenanceRepository extends JpaRepository<MaintenanceRecord, Long> {

    List<MaintenanceRecord> findByScheduledDateBetweenOrderByIdDesc(LocalDate from, LocalDate to);
    Optional<MaintenanceRecord> findByRecordNoIgnoreCase(String recordNo);
    List<MaintenanceRecord> findTop5ByStatusOrderByScheduledDateAscIdAsc(MaintenanceStatus status);
    /** Locks the row so two people cannot start/complete the same job at the same moment. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select m from MaintenanceRecord m where upper(m.recordNo) = upper(:no)")
    Optional<MaintenanceRecord> findForUpdate(@Param("no") String no);

    List<MaintenanceRecord> findTop500ByOrderByIdDesc();

    List<MaintenanceRecord> findTop500ByEquipment_EquipmentIdIgnoreCaseOrderByIdDesc(String equipmentId);

    boolean existsByEquipment_Id(Long equipmentId);

    boolean existsByEquipment_IdAndStatus(Long equipmentId, MaintenanceStatus status);

    long countByStatus(MaintenanceStatus status);

    long countByStatusAndScheduledDateBefore(MaintenanceStatus status, LocalDate date);

    long countByStatusAndScheduledDateBetween(MaintenanceStatus status, LocalDate from, LocalDate to);

    long countByStatusAndCompletedDateBetween(MaintenanceStatus status, LocalDate from, LocalDate to);

    long countByTypeAndStatusIn(MaintenanceType type, Collection<MaintenanceStatus> statuses);

    /** Returns null when there is nothing to add up. */
    @Query("select sum(m.cost) from MaintenanceRecord m "
            + "where m.status = :status and m.completedDate between :from and :to")
    BigDecimal sumCost(@Param("status") MaintenanceStatus status,
                       @Param("from") LocalDate from, @Param("to") LocalDate to);
}