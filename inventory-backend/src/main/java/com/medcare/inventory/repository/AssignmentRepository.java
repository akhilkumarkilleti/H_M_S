package com.medcare.inventory.repository;

import com.medcare.inventory.dto.DepartmentCount;
import com.medcare.inventory.model.AssignmentStatus;
import com.medcare.inventory.model.EquipmentAssignment;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AssignmentRepository extends JpaRepository<EquipmentAssignment, Long> {


    List<EquipmentAssignment> findByAssignedDateBetweenOrderByIdDesc(LocalDate from, LocalDate to);
    Optional<EquipmentAssignment> findByAssignmentNoIgnoreCase(String assignmentNo);

    /** Locks the row so two people cannot return / transfer the same assignment at the same moment. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select a from EquipmentAssignment a where upper(a.assignmentNo) = upper(:no)")
    Optional<EquipmentAssignment> findForUpdate(@Param("no") String no);

    List<EquipmentAssignment> findTop500ByOrderByIdDesc();

    List<EquipmentAssignment> findTop500ByEquipment_EquipmentIdIgnoreCaseOrderByIdDesc(String equipmentId);

    boolean existsByEquipment_Id(Long equipmentId);

    boolean existsByEquipment_IdAndStatus(Long equipmentId, AssignmentStatus status);

    long countByStatus(AssignmentStatus status);

    long countByStatusAndExpectedReturnDateBefore(AssignmentStatus status, LocalDate date);

    long countByStatusAndExpectedReturnDateBetween(AssignmentStatus status, LocalDate from, LocalDate to);

    long countByStatusAndReturnedDateBetween(AssignmentStatus status, LocalDate from, LocalDate to);

    /** How many items each department currently holds. */
    @Query("select new com.medcare.inventory.dto.DepartmentCount(a.department, count(a)) "
            + "from EquipmentAssignment a where a.status = :status "
            + "group by a.department order by count(a) desc, a.department asc")
    List<DepartmentCount> activeByDepartment(@Param("status") AssignmentStatus status);
}