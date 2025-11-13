package com.staffmanagement.controller;

import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.LeaveStatus;
import com.staffmanagement.service.LeaveCertificateService;
import com.staffmanagement.service.LeaveRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leave-requests")
@RequiredArgsConstructor
public class LeaveRequestController {
    private final LeaveRequestService leaveRequestService;
    private final LeaveCertificateService leaveCertificateService;

    @GetMapping
    public ResponseEntity<List<LeaveRequest>> getAllLeaveRequests() {
        return ResponseEntity.ok(leaveRequestService.getAllLeaveRequests());
    }

    @GetMapping("/{id}")
    public ResponseEntity<LeaveRequest> getLeaveRequestById(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestById(id));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStaffId(@PathVariable Long staffId) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByStaffId(staffId));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<LeaveRequest>> getLeaveRequestsByStatus(@PathVariable LeaveStatus status) {
        return ResponseEntity.ok(leaveRequestService.getLeaveRequestsByStatus(status));
    }

    @PostMapping("/staff/{staffId}")
    public ResponseEntity<LeaveRequest> createLeaveRequest(
            @PathVariable Long staffId,
            @Valid @RequestBody LeaveRequest leaveRequest) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(leaveRequestService.createLeaveRequest(staffId, leaveRequest));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveRequest> approveLeaveRequest(@PathVariable Long id) {
        return ResponseEntity.ok(leaveRequestService.approveLeaveRequest(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveRequest> rejectLeaveRequest(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Not specified");
        return ResponseEntity.ok(leaveRequestService.rejectLeaveRequest(id, reason));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLeaveRequest(@PathVariable Long id) {
        leaveRequestService.deleteLeaveRequest(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/certificate")
    public ResponseEntity<byte[]> downloadLeaveCertificate(@PathVariable Long id) {
        try {
            byte[] document = leaveCertificateService.generateLeaveCertificate(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "izin_belgesi_" + id + ".docx");

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(document);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
