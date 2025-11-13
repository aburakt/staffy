package com.staffmanagement.repository;

import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.LeaveStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByStaffId(Long staffId);
    List<LeaveRequest> findByStatus(LeaveStatus status);
    List<LeaveRequest> findByStaffIdAndStatus(Long staffId, LeaveStatus status);
}
