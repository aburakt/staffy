package com.staffmanagement.controller;

import com.staffmanagement.model.AttendanceRecord;
import com.staffmanagement.service.AttendanceService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {
    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<List<AttendanceRecord>> getAllAttendance() {
        return ResponseEntity.ok(attendanceService.getAllAttendance());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AttendanceRecord> getAttendanceById(@PathVariable Long id) {
        return ResponseEntity.ok(attendanceService.getAttendanceById(id));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceByStaffId(@PathVariable Long staffId) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStaffId(staffId));
    }

    @GetMapping("/staff/{staffId}/today")
    public ResponseEntity<AttendanceRecord> getTodayAttendance(@PathVariable Long staffId) {
        Optional<AttendanceRecord> record = attendanceService.getTodayAttendance(staffId);
        return record.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(attendanceService.getAttendanceByDate(date));
    }

    @GetMapping("/staff/{staffId}/range")
    public ResponseEntity<List<AttendanceRecord>> getAttendanceByDateRange(
            @PathVariable Long staffId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        return ResponseEntity.ok(attendanceService.getAttendanceByStaffIdAndDateRange(
                staffId, startDate, endDate));
    }

    @PostMapping("/staff/{staffId}/clock-in")
    public ResponseEntity<AttendanceRecord> clockIn(
            @PathVariable Long staffId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String location = body.getOrDefault("location", "Unknown");
        String ipAddress = getClientIP(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(attendanceService.clockIn(staffId, location, ipAddress));
    }

    @PutMapping("/staff/{staffId}/clock-out")
    public ResponseEntity<AttendanceRecord> clockOut(
            @PathVariable Long staffId,
            @RequestBody Map<String, String> body,
            HttpServletRequest request) {
        String location = body.getOrDefault("location", "Unknown");
        String ipAddress = getClientIP(request);

        return ResponseEntity.ok(attendanceService.clockOut(staffId, location, ipAddress));
    }

    @PutMapping("/staff/{staffId}/break-start")
    public ResponseEntity<AttendanceRecord> startBreak(@PathVariable Long staffId) {
        return ResponseEntity.ok(attendanceService.startBreak(staffId));
    }

    @PutMapping("/staff/{staffId}/break-end")
    public ResponseEntity<AttendanceRecord> endBreak(@PathVariable Long staffId) {
        return ResponseEntity.ok(attendanceService.endBreak(staffId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AttendanceRecord> updateAttendance(
            @PathVariable Long id,
            @Valid @RequestBody AttendanceRecord attendance) {
        return ResponseEntity.ok(attendanceService.updateAttendance(id, attendance));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<AttendanceRecord> approveAttendance(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String approver = body.getOrDefault("approver", "System");
        return ResponseEntity.ok(attendanceService.approveAttendance(id, approver));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttendance(@PathVariable Long id) {
        attendanceService.deleteAttendance(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/staff/{staffId}/monthly-report")
    public ResponseEntity<Map<String, Object>> getMonthlyReport(
            @PathVariable Long staffId,
            @RequestParam int year,
            @RequestParam int month) {
        return ResponseEntity.ok(attendanceService.getMonthlyReport(staffId, year, month));
    }

    @GetMapping("/pending-approvals")
    public ResponseEntity<List<AttendanceRecord>> getPendingApprovals() {
        return ResponseEntity.ok(attendanceService.getPendingApprovals());
    }

    private String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}
