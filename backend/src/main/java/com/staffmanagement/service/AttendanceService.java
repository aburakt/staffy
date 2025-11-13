package com.staffmanagement.service;

import com.staffmanagement.model.AttendanceRecord;
import com.staffmanagement.model.AttendanceStatus;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
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
    private final AttendanceRepository attendanceRepository;
    private final StaffService staffService;

    public List<AttendanceRecord> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public AttendanceRecord getAttendanceById(Long id) {
        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance record not found with id: " + id));
    }

    public List<AttendanceRecord> getAttendanceByStaffId(Long staffId) {
        return attendanceRepository.findByStaffId(staffId);
    }

    public List<AttendanceRecord> getAttendanceByDate(LocalDate date) {
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
        LocalDate today = LocalDate.now();
        Optional<AttendanceRecord> existing = attendanceRepository.findByStaffIdAndDate(staffId, today);

        if (existing.isPresent()) {
            throw new RuntimeException("Already clocked in today");
        }

        Staff staff = staffService.getStaffById(staffId);

        AttendanceRecord record = new AttendanceRecord();
        record.setStaff(staff);
        record.setDate(today);
        record.setClockInTime(LocalDateTime.now());
        record.setClockInLocation(location);
        record.setClockInIpAddress(ipAddress);
        record.setStatus(AttendanceStatus.PRESENT);

        return attendanceRepository.save(record);
    }

    public AttendanceRecord clockOut(Long staffId, String location, String ipAddress) {
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByStaffIdAndDate(staffId, today)
                .orElseThrow(() -> new RuntimeException("No clock-in record found for today"));

        if (record.getClockOutTime() != null) {
            throw new RuntimeException("Already clocked out today");
        }

        record.setClockOutTime(LocalDateTime.now());
        record.setClockOutLocation(location);
        record.setClockOutIpAddress(ipAddress);

        return attendanceRepository.save(record);
    }

    public AttendanceRecord startBreak(Long staffId) {
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByStaffIdAndDate(staffId, today)
                .orElseThrow(() -> new RuntimeException("No clock-in record found for today"));

        if (record.getBreakStartTime() != null) {
            throw new RuntimeException("Break already started");
        }

        record.setBreakStartTime(LocalDateTime.now());
        return attendanceRepository.save(record);
    }

    public AttendanceRecord endBreak(Long staffId) {
        LocalDate today = LocalDate.now();
        AttendanceRecord record = attendanceRepository.findByStaffIdAndDate(staffId, today)
                .orElseThrow(() -> new RuntimeException("No clock-in record found for today"));

        if (record.getBreakStartTime() == null) {
            throw new RuntimeException("Break not started");
        }

        if (record.getBreakEndTime() != null) {
            throw new RuntimeException("Break already ended");
        }

        record.setBreakEndTime(LocalDateTime.now());
        return attendanceRepository.save(record);
    }

    public AttendanceRecord updateAttendance(Long id, AttendanceRecord updatedRecord) {
        AttendanceRecord record = getAttendanceById(id);

        record.setClockInTime(updatedRecord.getClockInTime());
        record.setClockOutTime(updatedRecord.getClockOutTime());
        record.setBreakStartTime(updatedRecord.getBreakStartTime());
        record.setBreakEndTime(updatedRecord.getBreakEndTime());
        record.setNotes(updatedRecord.getNotes());

        return attendanceRepository.save(record);
    }

    public AttendanceRecord approveAttendance(Long id, String approver) {
        AttendanceRecord record = getAttendanceById(id);
        record.setApproved(true);
        record.setApprovedAt(LocalDateTime.now());
        record.setApprovedBy(approver);
        return attendanceRepository.save(record);
    }

    public void deleteAttendance(Long id) {
        AttendanceRecord record = getAttendanceById(id);
        attendanceRepository.delete(record);
    }

    public Map<String, Object> getMonthlyReport(Long staffId, int year, int month) {
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

        return report;
    }

    public List<AttendanceRecord> getPendingApprovals() {
        return attendanceRepository.findByApprovedFalse();
    }
}
