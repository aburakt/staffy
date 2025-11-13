package com.staffmanagement.service;

import com.staffmanagement.model.AttendanceRecord;
import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.AttendanceRepository;
import com.staffmanagement.repository.LeaveRequestRepository;
import com.staffmanagement.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {
    private static final Logger logger = LoggerFactory.getLogger(ExportService.class);

    private final StaffRepository staffRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public byte[] exportStaffToCsv() {
        logger.debug("Generating staff CSV export");
        List<Staff> staffList = staffRepository.findAll();

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        // CSV Header
        writer.println("ID,First Name,Last Name,Email,Phone,Department,Position,Hire Date,Active,Annual Leave Days,Used Leave Days,Remaining Leave Days");

        // CSV Data
        for (Staff staff : staffList) {
            writer.printf("%d,%s,%s,%s,%s,%s,%s,%s,%s,%d,%d,%d%n",
                    staff.getId(),
                    escapeCsvField(staff.getFirstName()),
                    escapeCsvField(staff.getLastName()),
                    escapeCsvField(staff.getEmail()),
                    escapeCsvField(staff.getPhone()),
                    escapeCsvField(staff.getDepartment()),
                    escapeCsvField(staff.getPosition()),
                    staff.getHireDate() != null ? staff.getHireDate().toString() : "",
                    staff.getActive(),
                    staff.getAnnualLeaveDays(),
                    staff.getUsedLeaveDays(),
                    staff.getRemainingLeaveDays()
            );
        }

        writer.flush();
        logger.info("Exported {} staff records to CSV", staffList.size());
        return outputStream.toByteArray();
    }

    public byte[] exportAttendanceToCsv(Long staffId, String startDate, String endDate) {
        logger.debug("Generating attendance CSV export - staffId: {}, startDate: {}, endDate: {}",
                staffId, startDate, endDate);

        List<AttendanceRecord> records;

        if (staffId != null && startDate != null && endDate != null) {
            LocalDate start = LocalDate.parse(startDate);
            LocalDate end = LocalDate.parse(endDate);
            records = attendanceRepository.findByStaffIdAndDateBetween(staffId, start, end);
        } else if (staffId != null) {
            records = attendanceRepository.findByStaffId(staffId);
        } else {
            records = attendanceRepository.findAll();
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        // CSV Header
        writer.println("ID,Staff Name,Date,Clock In,Clock Out,Status,Total Work Minutes,Overtime Minutes,Approved");

        // CSV Data
        for (AttendanceRecord record : records) {
            writer.printf("%d,%s,%s,%s,%s,%s,%s,%s,%s%n",
                    record.getId(),
                    escapeCsvField(record.getStaff().getFirstName() + " " + record.getStaff().getLastName()),
                    record.getDate() != null ? record.getDate().toString() : "",
                    record.getClockInTime() != null ? record.getClockInTime().toString() : "",
                    record.getClockOutTime() != null ? record.getClockOutTime().toString() : "",
                    record.getStatus() != null ? record.getStatus().toString() : "",
                    record.getTotalWorkMinutes() != null ? record.getTotalWorkMinutes().toString() : "0",
                    record.getOvertimeMinutes() != null ? record.getOvertimeMinutes().toString() : "0",
                    record.getApproved()
            );
        }

        writer.flush();
        logger.info("Exported {} attendance records to CSV", records.size());
        return outputStream.toByteArray();
    }

    public byte[] exportLeaveRequestsToCsv(Long staffId) {
        logger.debug("Generating leave requests CSV export - staffId: {}", staffId);

        List<LeaveRequest> requests;
        if (staffId != null) {
            requests = leaveRequestRepository.findByStaffId(staffId);
        } else {
            requests = leaveRequestRepository.findAll();
        }

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        PrintWriter writer = new PrintWriter(outputStream);

        // CSV Header
        writer.println("ID,Staff Name,Leave Type,Start Date,End Date,Days Requested,Status,Request Date,Approval Date,Rejection Reason");

        // CSV Data
        for (LeaveRequest request : requests) {
            writer.printf("%d,%s,%s,%s,%s,%d,%s,%s,%s,%s%n",
                    request.getId(),
                    escapeCsvField(request.getStaff().getFirstName() + " " + request.getStaff().getLastName()),
                    request.getLeaveType() != null ? request.getLeaveType().toString() : "",
                    request.getStartDate() != null ? request.getStartDate().toString() : "",
                    request.getEndDate() != null ? request.getEndDate().toString() : "",
                    request.getDaysRequested(),
                    request.getStatus() != null ? request.getStatus().toString() : "",
                    request.getRequestDate() != null ? request.getRequestDate().toString() : "",
                    request.getApprovalDate() != null ? request.getApprovalDate().toString() : "",
                    escapeCsvField(request.getRejectionReason())
            );
        }

        writer.flush();
        logger.info("Exported {} leave requests to CSV", requests.size());
        return outputStream.toByteArray();
    }

    /**
     * Escape CSV field to handle commas, quotes, and newlines
     */
    private String escapeCsvField(String field) {
        if (field == null) {
            return "";
        }

        // If field contains comma, quote, or newline, wrap it in quotes and escape existing quotes
        if (field.contains(",") || field.contains("\"") || field.contains("\n")) {
            return "\"" + field.replace("\"", "\"\"") + "\"";
        }

        return field;
    }
}
