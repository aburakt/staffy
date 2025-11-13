package com.staffmanagement.service;

import com.staffmanagement.exception.BusinessException;
import com.staffmanagement.exception.ResourceNotFoundException;
import com.staffmanagement.exception.ValidationException;
import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.LeaveStatus;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.LeaveRequestRepository;
import com.staffmanagement.util.DateUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LeaveRequestService {
    private static final Logger logger = LoggerFactory.getLogger(LeaveRequestService.class);

    private final LeaveRequestRepository leaveRequestRepository;
    private final StaffService staffService;

    public List<LeaveRequest> getAllLeaveRequests() {
        logger.debug("Fetching all leave requests");
        return leaveRequestRepository.findAll();
    }

    public LeaveRequest getLeaveRequestById(Long id) {
        logger.debug("Fetching leave request with id: {}", id);
        return leaveRequestRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", id));
    }

    public List<LeaveRequest> getLeaveRequestsByStaffId(Long staffId) {
        logger.debug("Fetching leave requests for staff id: {}", staffId);
        return leaveRequestRepository.findByStaffId(staffId);
    }

    public List<LeaveRequest> getLeaveRequestsByStatus(LeaveStatus status) {
        logger.debug("Fetching leave requests with status: {}", status);
        return leaveRequestRepository.findByStatus(status);
    }

    public LeaveRequest createLeaveRequest(Long staffId, LeaveRequest leaveRequest) {
        logger.info("Creating leave request for staff id: {}", staffId);

        Staff staff = staffService.getStaffById(staffId);

        // Validate dates
        LocalDate startDate = leaveRequest.getStartDate();
        LocalDate endDate = leaveRequest.getEndDate();

        if (startDate == null) {
            throw new ValidationException("startDate", "Start date is required");
        }

        if (endDate == null) {
            throw new ValidationException("endDate", "End date is required");
        }

        if (startDate.isBefore(LocalDate.now())) {
            throw new ValidationException("startDate", "Start date cannot be in the past");
        }

        if (endDate.isBefore(startDate)) {
            throw new ValidationException("endDate", "End date must be after start date");
        }

        // Calculate business days (excluding weekends and holidays)
        int businessDays = DateUtil.calculateBusinessDays(startDate, endDate);

        if (businessDays == 0) {
            throw new BusinessException("NO_WORKING_DAYS", "Leave request contains no working days");
        }

        logger.debug("Calculated {} business days for leave request", businessDays);
        leaveRequest.setDaysRequested(businessDays);

        // Check for overlapping leave requests
        List<LeaveRequest> existingRequests = leaveRequestRepository.findByStaffId(staffId);
        for (LeaveRequest existing : existingRequests) {
            if (existing.getStatus() == LeaveStatus.APPROVED || existing.getStatus() == LeaveStatus.PENDING) {
                if (DateUtil.doDateRangesOverlap(startDate, endDate,
                        existing.getStartDate(), existing.getEndDate())) {
                    logger.warn("Overlapping leave request detected for staff id: {}", staffId);
                    throw new BusinessException("LEAVE_OVERLAP",
                            "Leave request overlaps with existing request from " +
                            existing.getStartDate() + " to " + existing.getEndDate());
                }
            }
        }

        leaveRequest.setStaff(staff);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        leaveRequest.setRequestDate(LocalDate.now());

        LeaveRequest savedRequest = leaveRequestRepository.save(leaveRequest);
        logger.info("Leave request created successfully with id: {}", savedRequest.getId());
        return savedRequest;
    }

    public LeaveRequest approveLeaveRequest(Long id) {
        logger.info("Approving leave request with id: {}", id);
        LeaveRequest leaveRequest = getLeaveRequestById(id);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessException("INVALID_STATUS", "Only pending requests can be approved");
        }

        Staff staff = leaveRequest.getStaff();

        if (staff.getRemainingLeaveDays() < leaveRequest.getDaysRequested()) {
            logger.warn("Staff {} has insufficient leave days. Remaining: {}, Requested: {}",
                    staff.getId(), staff.getRemainingLeaveDays(), leaveRequest.getDaysRequested());
            throw new BusinessException("INSUFFICIENT_LEAVE_DAYS",
                    "Insufficient leave days available. Remaining: " + staff.getRemainingLeaveDays() +
                    ", Requested: " + leaveRequest.getDaysRequested());
        }

        leaveRequest.setStatus(LeaveStatus.APPROVED);
        leaveRequest.setApprovalDate(LocalDate.now());

        staff.setUsedLeaveDays(staff.getUsedLeaveDays() + leaveRequest.getDaysRequested());
        staff.calculateRemainingLeaveDays();
        staffService.updateStaff(staff.getId(), staff);

        LeaveRequest approved = leaveRequestRepository.save(leaveRequest);
        logger.info("Leave request approved. Staff {} now has {} remaining leave days",
                staff.getId(), staff.getRemainingLeaveDays());
        return approved;
    }

    public LeaveRequest rejectLeaveRequest(Long id, String reason) {
        logger.info("Rejecting leave request with id: {}", id);
        LeaveRequest leaveRequest = getLeaveRequestById(id);

        if (leaveRequest.getStatus() != LeaveStatus.PENDING) {
            throw new BusinessException("INVALID_STATUS", "Only pending requests can be rejected");
        }

        if (reason == null || reason.trim().isEmpty()) {
            throw new ValidationException("reason", "Rejection reason is required");
        }

        leaveRequest.setStatus(LeaveStatus.REJECTED);
        leaveRequest.setRejectionReason(reason);

        LeaveRequest rejected = leaveRequestRepository.save(leaveRequest);
        logger.info("Leave request {} rejected with reason: {}", id, reason);
        return rejected;
    }

    public void deleteLeaveRequest(Long id) {
        logger.info("Deleting leave request with id: {}", id);
        LeaveRequest leaveRequest = getLeaveRequestById(id);
        leaveRequestRepository.delete(leaveRequest);
        logger.info("Leave request deleted successfully");
    }
}
