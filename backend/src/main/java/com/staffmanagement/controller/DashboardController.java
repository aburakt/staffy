package com.staffmanagement.controller;

import com.staffmanagement.dto.DashboardStats;
import com.staffmanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {
    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats() {
        return ResponseEntity.ok(dashboardService.getDashboardStats());
    }

    @GetMapping("/document-completion")
    public ResponseEntity<List<DashboardStats.StaffDocumentStatus>> getDocumentCompletion() {
        return ResponseEntity.ok(dashboardService.getDocumentCompletionDetails());
    }
}
