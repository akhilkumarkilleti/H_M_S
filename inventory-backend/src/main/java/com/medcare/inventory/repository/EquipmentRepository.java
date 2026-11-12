package com.medcare.inventory.repository;

import com.medcare.inventory.model.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.Lock;
import com.medcare.inventory.model.EquipmentStatus;
import java.util.List;
import java.util.Optional;

public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    Optional<Equipment> findByEquipmentIdIgnoreCase(String equipmentId);
    boolean existsBySerialNumberIgnoreCaseAndIdNot(String serialNumber, Long id);
    List<Equipment> findAllByOrderByIdAsc();
    long countByCategory(String category);

    long countByStatus(EquipmentStatus status);

    /** Locks the row so a maintenance job and a manual edit cannot change the status at the same moment. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select e from Equipment e where e.id = :id")
    Optional<Equipment> lockById(@Param("id") Long id);

    @Modifying
    @Query("update Equipment e set e.category = :newName where e.category = :oldName")
    int renameCategory(@Param("oldName") String oldName, @Param("newName") String newName);
}