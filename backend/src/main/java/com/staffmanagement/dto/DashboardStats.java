package com.staffmanagement.dto;

import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.Staff;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private int totalStaff;
    private int activeStaff;
    private int onLeaveStaff;
    private List<StaffOnLeave> staffOnLeaveList;
    private int pendingLeaveRequests;
    private Map<String, Integer> documentCompletionStats;
    private int totalDocumentsRequired;
    private int totalDocumentsUploaded;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffOnLeave {
        private Long staffId;
        private String staffName;
        private String leaveType;
        private String startDate;
        private String endDate;
        private int daysRemaining;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class StaffDocumentStatus {
        private Long staffId;
        private String staffName;
        private int totalDocuments;
        private int missingDocuments;
        private List<String> missingDocumentTypes;
    }
}
