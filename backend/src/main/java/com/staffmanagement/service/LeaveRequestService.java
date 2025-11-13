package com.staffmanagement.service;

import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.LeaveStatus;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.LeaveRequestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveRequestService {
    private final LeaveRequestRepository leaveRequestRepository;
    private final StaffService staffService;

    public List<LeaveRequest> getAllLeaveRequests() {
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Leave request not found with id: " + id));
    }

    public List<LeaveRequest> getLeaveRequestsByStaffId(Long staffId) {
        return leaveRequestRepository.findByStaffId(staffId);
    }

    public List<LeaveRequest> getLeaveRequestsByStatus(LeaveStatus status) {
        return leaveRequestRepository.findByStatus(status);
    }

    public LeaveRequest createLeaveRequest(Long staffId, LeaveRequest leaveRequest) {
        Staff staff = staffService.getStaffById(staffId);
        leaveRequest.setStaff(staff);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setRequestDate(LocalDate.now());

        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        LeaveRequest leaveRequest = getLeaveRequestById(id);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be approved");
        }

        Staff staff = leaveRequest.getStaff();

        if (staff.getRemainingLeaveDays() < leaveRequest.getDaysRequested()) {
            throw new RuntimeException("Insufficient leave days available");
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovalDate(LocalDate.now());

        staff.setUsedLeaveDays(staff.getUsedLeaveDays() + leaveRequest.getDaysRequested());
        staff.calculateRemainingLeaveDays();
        staffService.updateStaff(staff.getId(), staff);

        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest rejectLeaveRequest(Long id, String reason) {
        LeaveRequest leaveRequest = getLeaveRequestById(id);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new RuntimeException("Only pending requests can be rejected");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setRejectionReason(reason);

        return leaveRequestRepository.save(leaveRequest);
    }

    public void deleteLeaveRequest(Long id) {
        LeaveRequest leaveRequest = getLeaveRequestById(id);
        leaveRequestRepository.delete(leaveRequest);
    }
}
