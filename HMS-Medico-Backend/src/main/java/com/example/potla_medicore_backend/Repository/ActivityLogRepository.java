package com.example.potla_medicore_backend.Repository;

import com.example.potla_medicore_backend.Entity.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    List<ActivityLog> findAllByOrderByCreatedAtDesc();

    List<ActivityLog> findByPatientIdOrderByCreatedAtDesc(Long patientId);

    List<ActivityLog> findByModuleOrderByCreatedAtDesc(String module);

    List<ActivityLog> findByModuleInOrderByCreatedAtDesc(List<String> modules);
}
