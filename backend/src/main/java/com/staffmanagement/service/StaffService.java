package com.staffmanagement.service;

import com.staffmanagement.exception.ResourceNotFoundException;
import com.staffmanagement.exception.ValidationException;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.StaffRepository;
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
public class StaffService {
    private static final Logger logger = LoggerFactory.getLogger(StaffService.class);
    private final StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        logger.debug("Fetching all staff members");
        return staffRepository.findAll();
    }

    public List<Staff> getActiveStaff() {
        logger.debug("Fetching active staff members");
        return staffRepository.findByActiveTrue();
    }

    public Staff getStaffById(Long id) {
        logger.debug("Fetching staff with id: {}", id);
        return staffRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", id));
    }

    public Staff getStaffByEmail(String email) {
        logger.debug("Fetching staff with email: {}", email);
        return staffRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Staff", 0L));
    }

    public Staff createStaff(Staff staff) {
        logger.info("Creating new staff: {} {}", staff.getFirstName(), staff.getLastName());

        // Validate hire date
        if (staff.getHireDate() != null && staff.getHireDate().isAfter(LocalDate.now())) {
            throw new ValidationException("hireDate", "Hire date cannot be in the future");
        }

        // Validate email uniqueness
        if (staff.getEmail() != null && staffRepository.findByEmail(staff.getEmail()).isPresent()) {
            throw new ValidationException("email", "Email already exists");
        }

        staff.calculateRemainingLeaveDays();
        Staff savedStaff = staffRepository.save(staff);
        logger.info("Staff created successfully with id: {}", savedStaff.getId());
        return savedStaff;
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
        logger.info("Updating staff with id: {}", id);
        Staff staff = getStaffById(id);

        staff.setFirstName(staffDetails.getFirstName());
        staff.setLastName(staffDetails.getLastName());
        staff.setEmail(staffDetails.getEmail());
        staff.setPhone(staffDetails.getPhone());
        staff.setAddress(staffDetails.getAddress());
        staff.setPosition(staffDetails.getPosition());
        staff.setDepartment(staffDetails.getDepartment());
        staff.setHireDate(staffDetails.getHireDate());
        staff.setDateOfBirth(staffDetails.getDateOfBirth());
        staff.setAnnualLeaveDays(staffDetails.getAnnualLeaveDays());
        staff.setUsedLeaveDays(staffDetails.getUsedLeaveDays());
        staff.setActive(staffDetails.getActive());

        staff.calculateRemainingLeaveDays();
        Staff updated = staffRepository.save(staff);
        logger.info("Staff updated successfully: {}", id);
        return updated;
    }

    public void deleteStaff(Long id) {
        logger.info("Deleting staff with id: {}", id);
        Staff staff = getStaffById(id);
        staffRepository.delete(staff);
        logger.info("Staff deleted successfully: {}", id);
    }

    public void deactivateStaff(Long id) {
        logger.info("Deactivating staff with id: {}", id);
        Staff staff = getStaffById(id);
        staff.setActive(false);
        staffRepository.save(staff);
        logger.info("Staff deactivated successfully: {}", id);
    }

    public List<Staff> getStaffByDepartment(String department) {
        logger.debug("Fetching staff by department: {}", department);
        return staffRepository.findByDepartment(department);
    }

    /**
     * Process year-end leave carryover for all active staff.
     * This should be called at the end of each year (e.g., via scheduled job).
     */
    public void processYearEndCarryoverForAllStaff() {
        int currentYear = java.time.LocalDate.now().getYear();
        logger.info("Processing year-end carryover for year: {}", currentYear);

        List<Staff> allStaff = staffRepository.findAll();
        int processedCount = 0;

        for (Staff staff : allStaff) {
            if (Boolean.TRUE.equals(staff.getActive())) {
                staff.processYearEndCarryover(currentYear);
                staffRepository.save(staff);
                processedCount++;
                logger.debug("Processed carryover for staff: {} {} (Carried over: {} days)",
                        staff.getFirstName(), staff.getLastName(), staff.getCarriedOverLeaveDays());
            }
        }

        logger.info("Year-end carryover completed. Processed {} staff members", processedCount);
    }
}
