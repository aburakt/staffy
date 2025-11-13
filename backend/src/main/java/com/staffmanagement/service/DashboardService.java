package com.staffmanagement.service;

import com.staffmanagement.dto.DashboardStats;
import com.staffmanagement.model.*;
import com.staffmanagement.repository.DocumentRepository;
import com.staffmanagement.repository.LeaveRequestRepository;
import com.staffmanagement.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private static final Logger logger = LoggerFactory.getLogger(DashboardService.class);

    private final StaffRepository staffRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final DocumentRepository documentRepository;

    public DashboardStats getDashboardStats() {
        logger.debug("Generating dashboard stats");
        DashboardStats stats = new DashboardStats();

        // Staff counts
        List<Staff> allStaff = staffRepository.findAll();
        stats.setTotalStaff(allStaff.size());
        stats.setActiveStaff((int) allStaff.stream().filter(Staff::getActive).count());

        // Staff on leave
        LocalDate today = LocalDate.now();
        List<LeaveRequest> activeLeaves = leaveRequestRepository.findAll().stream()
                .filter(lr -> lr.getStatus() == LeaveStatus.APPROVED)
                .filter(lr -> {
                    LocalDate start = lr.getStartDate();
                    LocalDate end = lr.getEndDate();
                    return !today.isBefore(start) && !today.isAfter(end);
                })
                .toList();

        stats.setOnLeaveStaff(activeLeaves.size());

        // Staff on leave details
        List<DashboardStats.StaffOnLeave> staffOnLeave = activeLeaves.stream()
                .map(lr -> {
                    LocalDate endDate = lr.getEndDate();
                    int daysRemaining = (int) ChronoUnit.DAYS.between(today, endDate);

                    return new DashboardStats.StaffOnLeave(
                            lr.getStaff().getId(),
                            lr.getStaff().getFirstName() + " " + lr.getStaff().getLastName(),
                            lr.getLeaveType().toString(),
                            lr.getStartDate().toString(),
                            lr.getEndDate().toString(),
                            Math.max(0, daysRemaining)
                    );
                })
                .collect(Collectors.toList());
        stats.setStaffOnLeaveList(staffOnLeave);

        // Pending leave requests
        long pendingRequests = leaveRequestRepository.findAll().stream()
                .filter(lr -> lr.getStatus() == LeaveStatus.PENDING)
                .count();
        stats.setPendingLeaveRequests((int) pendingRequests);

        // Document completion stats - OPTIMIZED to avoid N+1 query
        List<DocumentType> requiredDocTypes = Arrays.asList(
                DocumentType.CONTRACT,
                DocumentType.ID_CARD,
                DocumentType.TAX_FORM
        );

        // Fetch all staff IDs
        List<Long> staffIds = allStaff.stream().map(Staff::getId).collect(Collectors.toList());

        // BATCH QUERY: Fetch all documents in one query instead of N queries
        List<Document> allDocuments = documentRepository.findByStaffIdIn(staffIds);
        logger.debug("Fetched {} documents for {} staff members in single query", allDocuments.size(), staffIds.size());

        // Group documents by staff ID
        Map<Long, List<Document>> documentsByStaffId = allDocuments.stream()
                .collect(Collectors.groupingBy(doc -> doc.getStaff().getId()));

        Map<String, Integer> docStats = new HashMap<>();
        int totalRequired = allStaff.size() * requiredDocTypes.size();
        int totalUploaded = 0;

        for (Staff staff : allStaff) {
            List<Document> staffDocs = documentsByStaffId.getOrDefault(staff.getId(), Collections.emptyList());
            Set<DocumentType> uploadedTypes = staffDocs.stream()
                    .map(Document::getDocumentType)
                    .collect(Collectors.toSet());

            for (DocumentType type : requiredDocTypes) {
                if (uploadedTypes.contains(type)) {
                    totalUploaded++;
                }
            }

            int missingCount = requiredDocTypes.size() -
                    (int) requiredDocTypes.stream().filter(uploadedTypes::contains).count();

            if (missingCount > 0) {
                String key = staff.getFirstName() + " " + staff.getLastName();
                docStats.put(key, missingCount);
            }
        }

        stats.setDocumentCompletionStats(docStats);
        stats.setTotalDocumentsRequired(totalRequired);
        stats.setTotalDocumentsUploaded(totalUploaded);

        logger.debug("Dashboard stats generated successfully");
        return stats;
    }

    public List<DashboardStats.StaffDocumentStatus> getDocumentCompletionDetails() {
        logger.debug("Generating document completion details");
        List<Staff> allStaff = staffRepository.findAll();
        List<DocumentType> requiredDocTypes = Arrays.asList(
                DocumentType.CONTRACT,
                DocumentType.ID_CARD,
                DocumentType.TAX_FORM
        );

        // OPTIMIZED: Fetch all documents in one batch query
        List<Long> staffIds = allStaff.stream().map(Staff::getId).collect(Collectors.toList());
        List<Document> allDocuments = documentRepository.findByStaffIdIn(staffIds);
        logger.debug("Fetched {} documents for {} staff members in single query", allDocuments.size(), staffIds.size());

        // Group documents by staff ID
        Map<Long, List<Document>> documentsByStaffId = allDocuments.stream()
                .collect(Collectors.groupingBy(doc -> doc.getStaff().getId()));

        return allStaff.stream()
                .map(staff -> {
                    List<Document> staffDocs = documentsByStaffId.getOrDefault(staff.getId(), Collections.emptyList());
                    Set<DocumentType> uploadedTypes = staffDocs.stream()
                            .map(Document::getDocumentType)
                            .collect(Collectors.toSet());

                    List<String> missing = requiredDocTypes.stream()
                            .filter(type -> !uploadedTypes.contains(type))
                            .map(Enum::toString)
                            .collect(Collectors.toList());

                    return new DashboardStats.StaffDocumentStatus(
                            staff.getId(),
                            staff.getFirstName() + " " + staff.getLastName(),
                            requiredDocTypes.size(),
                            missing.size(),
                            missing
                    );
                })
                .filter(status -> status.getMissingDocuments() > 0)
                .collect(Collectors.toList());
    }
}
