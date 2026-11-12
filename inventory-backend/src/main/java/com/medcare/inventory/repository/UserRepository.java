package com.medcare.inventory.repository;

import com.medcare.inventory.model.User;
import com.medcare.inventory.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailIgnoreCase(String email);
    Optional<User> findByEmployeeIdIgnoreCase(String employeeId);
    boolean existsByEmailIgnoreCase(String email);
    boolean existsByEmployeeIdIgnoreCase(String employeeId);
    List<User> findByStatusOrderByCreatedAtDesc(UserStatus status);
    List<User> findAllByOrderByCreatedAtDesc();
}
