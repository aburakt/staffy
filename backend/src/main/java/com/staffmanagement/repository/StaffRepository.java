package com.staffmanagement.repository;

import com.staffmanagement.model.Staff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByEmail(String email);
    List<Staff> findByActiveTrue();
    List<Staff> findByDepartment(String department);
    List<Staff> findByPosition(String position);
}
