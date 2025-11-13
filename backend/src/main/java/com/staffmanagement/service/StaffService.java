package com.staffmanagement.service;

import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class StaffService {
    private final StaffRepository staffRepository;

    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    public List<Staff> getActiveStaff() {
        return staffRepository.findByActiveTrue();
    }

    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
    }

    public Staff getStaffByEmail(String email) {
        return staffRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Staff not found with email: " + email));
    }

    public Staff createStaff(Staff staff) {
        staff.calculateRemainingLeaveDays();
        return staffRepository.save(staff);
    }

    public Staff updateStaff(Long id, Staff staffDetails) {
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
        return staffRepository.save(staff);
    }

    public void deleteStaff(Long id) {
        Staff staff = getStaffById(id);
        staffRepository.delete(staff);
    }

    public void deactivateStaff(Long id) {
        Staff staff = getStaffById(id);
        staff.setActive(false);
        staffRepository.save(staff);
    }

    public List<Staff> getStaffByDepartment(String department) {
        return staffRepository.findByDepartment(department);
    }
}
