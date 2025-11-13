package com.staffmanagement.controller;

import com.staffmanagement.service.ExportService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/export")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ExportController {
    private static final Logger logger = LoggerFactory.getLogger(ExportController.class);
    private final ExportService exportService;

    @GetMapping("/staff")
    public ResponseEntity<byte[]> exportStaff() {
        logger.info("Exporting all staff to CSV");
        byte[] csv = exportService.exportStaffToCsv();

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=staff.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/attendance")
    public ResponseEntity<byte[]> exportAttendance(
            @RequestParam(required = false) Long staffId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        logger.info("Exporting attendance to CSV - staffId: {}, startDate: {}, endDate: {}",
                staffId, startDate, endDate);
        byte[] csv = exportService.exportAttendanceToCsv(staffId, startDate, endDate);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=attendance.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }

    @GetMapping("/leave-requests")
    public ResponseEntity<byte[]> exportLeaveRequests(
            @RequestParam(required = false) Long staffId) {
        logger.info("Exporting leave requests to CSV - staffId: {}", staffId);
        byte[] csv = exportService.exportLeaveRequestsToCsv(staffId);

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=leave_requests.csv")
                .contentType(MediaType.parseMediaType("text/csv"))
                .body(csv);
    }
}
