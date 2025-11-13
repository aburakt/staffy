package com.staffmanagement.service;

import com.staffmanagement.exception.BusinessException;
import com.staffmanagement.exception.ResourceNotFoundException;
import com.staffmanagement.model.AttendanceRecord;
import com.staffmanagement.model.AttendanceStatus;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class AttendanceService {
    private static final Logger logger = LoggerFactory.getLogger(AttendanceService.class);

    private final AttendanceRepository attendanceRepository;
    private final StaffService staffService;

    public List<AttendanceRecord> getAllAttendance() {
        logger.debug("Fetching all attendance records");
        return attendanceRepository.findAll();
    }

    public AttendanceRecord getAttendanceById(Long id) {
        logger.debug("Fetching attendance record with id: {}", id);
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("AttendanceRecord", id));
    }

    public List<AttendanceRecord> getAttendanceByStaffId(Long staffId) {
        logger.debug("Fetching attendance records for staff id: {}", staffId);
        return attendanceRepository.findByStaffId(staffId);
    }

    public List<AttendanceRecord> getAttendanceByDate(LocalDate date) {
        logger.debug("Fetching attendance records for date: {}", date);
        return attendanceRepository.findByDate(date);
    }

    public List<AttendanceRecord> getAttendanceByStaffIdAndDateRange(
            Long staffId, LocalDate startDate, LocalDate endDate) {
        return attendanceRepository.findByStaffIdAndDateBetween(staffId, startDate, endDate);
    }

    public Optional<AttendanceRecord> getTodayAttendance(Long staffId) {
        return attendanceRepository.findByStaffIdAndDate(staffId, LocalDate.now());
    }

    public AttendanceRecord clockIn(Long staffId, String location, String ipAddress) {
        logger.info("Clock-in request for staff id: {}", staffId);
        LocalDate today = LocalDate.now();
        Optional<AttendanceRecord> existing = attendanceRepository.findByStaffIdAndDate(staffId, today);

        if (existing.isPresent()) {
            logger.warn("Staff {} already clocked in today", staffId);
            throw new BusinessException("ALREADY_CLOCKED_IN", "Already clocked in today");
        }

        Staff staff = staffService.getStaffById(staffId);

        AttendanceRecord record = new AttendanceRecord();
        record.setStaff(staff);
        record.setDate(today);
        record.setClockInTime(LocalDateTime.now());
        record.setClockInLocation(location);
        record.setClockInIpAddress(ipAddress);
        record.setStatus(AttendanceStatus.PRESENT);

        AttendanceRecord saved = attendanceRepository.save(record);
        logger.info("Staff {} clocked in successfully at {}", staffId, saved.getClockInTime());
        return saved;
    }

    public AttendanceRecord clockOut(Long staffId, String location, String ipAddress) {
        logger.info("Clock-out request for staff id: {}", staffId);
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByStaffIdAndDate(staffId, today)
                .orElseThrow(() -> new BusinessException("NOT_CLOCKED_IN", "No clock-in record found for today"));

        if (record.getClockOutTime() != null) {
            logger.warn("Staff {} already clocked out today", staffId);
            throw new BusinessException("ALREADY_CLOCKED_OUT", "Already clocked out today");
        }

        record.setClockOutTime(LocalDateTime.now());
        record.setClockOutLocation(location);
        record.setClockOutIpAddress(ipAddress);

        AttendanceRecord saved = attendanceRepository.save(record);
        logger.info("Staff {} clocked out successfully at {}", staffId, saved.getClockOutTime());
        return saved;
    }

    public AttendanceRecord startBreak(Long staffId) {
        logger.info("Break start request for staff id: {}", staffId);
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByStaffIdAndDate(staffId, today)
                .orElseThrow(() -> new BusinessException("NOT_CLOCKED_IN", "No clock-in record found for today"));

        if (record.getBreakStartTime() != null) {
            logger.warn("Staff {} already started break", staffId);
            throw new BusinessException("BREAK_ALREADY_STARTED", "Break already started");
        }

        record.setBreakStartTime(LocalDateTime.now());
        AttendanceRecord saved = attendanceRepository.save(record);
        logger.info("Staff {} started break at {}", staffId, saved.getBreakStartTime());
        return saved;
    }

    public AttendanceRecord endBreak(Long staffId) {
        logger.info("Break end request for staff id: {}", staffId);
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByStaffIdAndDate(staffId, today)
                .orElseThrow(() -> new BusinessException("NOT_CLOCKED_IN", "No clock-in record found for today"));

        if (record.getBreakStartTime() == null) {
            logger.warn("Staff {} tried to end break without starting it", staffId);
            throw new BusinessException("BREAK_NOT_STARTED", "Break not started");
        }

        if (record.getBreakEndTime() != null) {
            logger.warn("Staff {} already ended break", staffId);
            throw new BusinessException("BREAK_ALREADY_ENDED", "Break already ended");
        }

        record.setBreakEndTime(LocalDateTime.now());
        AttendanceRecord saved = attendanceRepository.save(record);
        logger.info("Staff {} ended break at {}", staffId, saved.getBreakEndTime());
        return saved;
    }

    public AttendanceRecord updateAttendance(Long id, AttendanceRecord updatedRecord) {
        logger.info("Updating attendance record with id: {}", id);
        AttendanceRecord record = getAttendanceById(id);

        record.setClockInTime(updatedRecord.getClockInTime());
        record.setClockOutTime(updatedRecord.getClockOutTime());
        record.setBreakStartTime(updatedRecord.getBreakStartTime());
        record.setBreakEndTime(updatedRecord.getBreakEndTime());
        record.setNotes(updatedRecord.getNotes());

        AttendanceRecord saved = attendanceRepository.save(record);
        logger.info("Attendance record updated successfully");
        return saved;
    }

    public AttendanceRecord approveAttendance(Long id, String approver) {
        logger.info("Approving attendance record {} by {}", id, approver);
        AttendanceRecord record = getAttendanceById(id);
        record.setApproved(true);
        record.setApprovedAt(LocalDateTime.now());
        record.setApprovedBy(approver);
        AttendanceRecord saved = attendanceRepository.save(record);
        logger.info("Attendance record approved successfully");
        return saved;
    }

    public void deleteAttendance(Long id) {
        logger.info("Deleting attendance record with id: {}", id);
        AttendanceRecord record = getAttendanceById(id);
        attendanceRepository.delete(record);
        logger.info("Attendance record deleted successfully");
    }

    public Map<String, Object> getMonthlyReport(Long staffId, int year, int month) {
        logger.debug("Generating monthly report for staff {} - {}/{}", staffId, year, month);
        List<AttendanceRecord> records = attendanceRepository
                .findByStaffIdAndYearAndMonth(staffId, year, month);

        YearMonth yearMonth = YearMonth.of(year, month);
        int workingDays = yearMonth.lengthOfMonth();

        long totalWorkMinutes = records.stream()
                .mapToLong(r -> r.getTotalWorkMinutes() != null ? r.getTotalWorkMinutes() : 0)
                .sum();

        long totalOvertimeMinutes = records.stream()
                .mapToLong(r -> r.getOvertimeMinutes() != null ? r.getOvertimeMinutes() : 0)
                .sum();

        long presentDays = records.stream()
                .filter(r -> r.getStatus() == AttendanceStatus.PRESENT ||
                           r.getStatus() == AttendanceStatus.OVERTIME)
                .count();

        long absentDays = workingDays - presentDays;
        long lateDays = records.stream()
                .filter(r -> r.getStatus() == AttendanceStatus.LATE)
                .count();

        Map<String, Object> report = new HashMap<>();
        report.put("staffId", staffId);
        report.put("year", year);
        report.put("month", month);
        report.put("totalWorkHours", totalWorkMinutes / 60.0);
        report.put("totalOvertimeHours", totalOvertimeMinutes / 60.0);
        report.put("presentDays", presentDays);
        report.put("absentDays", absentDays);
        report.put("lateDays", lateDays);
        report.put("workingDays", workingDays);
        report.put("records", records);

        logger.debug("Monthly report generated: {} present days, {} absent days", presentDays, absentDays);
        return report;
    }

    public List<AttendanceRecord> getPendingApprovals() {
        logger.debug("Fetching pending attendance approvals");
        return attendanceRepository.findByApprovedFalse();
    }
}
