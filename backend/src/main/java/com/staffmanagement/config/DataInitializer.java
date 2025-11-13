package com.staffmanagement.config;

import com.staffmanagement.model.*;
import com.staffmanagement.repository.DocumentRepository;
import com.staffmanagement.repository.LeaveRequestRepository;
import com.staffmanagement.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    private final StaffRepository staffRepository;
    private final LeaveRequestRepository leaveRequestRepository;
    private final DocumentRepository documentRepository;

    @Override
    public void run(String... args) {
        // Create sample staff
        Staff staff1 = new Staff();
        staff1.setFirstName("John");
        staff1.setLastName("Doe");
        staff1.setEmail("john.doe@company.com");
        staff1.setPhone("+1234567890");
        staff1.setAddress("123 Main St, City");
        staff1.setPosition("Software Engineer");
        staff1.setDepartment("Engineering");
        staff1.setHireDate(LocalDate.of(2022, 1, 15));
        staff1.setDateOfBirth(LocalDate.of(1990, 5, 20));
        staff1.setAnnualLeaveDays(20);
        staff1.setUsedLeaveDays(5);
        staff1.calculateRemainingLeaveDays();
        staff1 = staffRepository.save(staff1);

        Staff staff2 = new Staff();
        staff2.setFirstName("Jane");
        staff2.setLastName("Smith");
        staff2.setEmail("jane.smith@company.com");
        staff2.setPhone("+1234567891");
        staff2.setAddress("456 Oak Ave, City");
        staff2.setPosition("Product Manager");
        staff2.setDepartment("Product");
        staff2.setHireDate(LocalDate.of(2021, 6, 1));
        staff2.setDateOfBirth(LocalDate.of(1988, 8, 15));
        staff2.setAnnualLeaveDays(22);
        staff2.setUsedLeaveDays(3);
        staff2.calculateRemainingLeaveDays();
        staff2 = staffRepository.save(staff2);

        Staff staff3 = new Staff();
        staff3.setFirstName("Mike");
        staff3.setLastName("Johnson");
        staff3.setEmail("mike.johnson@company.com");
        staff3.setPhone("+1234567892");
        staff3.setAddress("789 Elm St, City");
        staff3.setPosition("Designer");
        staff3.setDepartment("Design");
        staff3.setHireDate(LocalDate.of(2023, 3, 10));
        staff3.setDateOfBirth(LocalDate.of(1992, 12, 3));
        staff3.setAnnualLeaveDays(20);
        staff3.setUsedLeaveDays(0);
        staff3.calculateRemainingLeaveDays();
        staff3 = staffRepository.save(staff3);

        // Create sample leave requests
        LeaveRequest leave1 = new LeaveRequest();
        leave1.setStaff(staff1);
        leave1.setStartDate(LocalDate.now().plusDays(10));
        leave1.setEndDate(LocalDate.now().plusDays(14));
        leave1.setLeaveType(LeaveType.ANNUAL);
        leave1.setStatus(LeaveStatus.PENDING);
        leave1.setReason("Family vacation");
        leaveRequestRepository.save(leave1);

        LeaveRequest leave2 = new LeaveRequest();
        leave2.setStaff(staff2);
        leave2.setStartDate(LocalDate.now().minusDays(5));
        leave2.setEndDate(LocalDate.now().minusDays(3));
        leave2.setLeaveType(LeaveType.SICK);
        leave2.setStatus(LeaveStatus.APPROVED);
        leave2.setReason("Medical appointment");
        leave2.setApprovalDate(LocalDate.now().minusDays(6));
        leaveRequestRepository.save(leave2);

        // Create sample documents
        Document doc1 = new Document();
        doc1.setStaff(staff1);
        doc1.setDocumentName("Employment Contract");
        doc1.setDocumentType(DocumentType.CONTRACT);
        doc1.setFileName("contract_john_doe.pdf");
        doc1.setFileUrl("/documents/contract_john_doe.pdf");
        doc1.setFileSize(245000L);
        doc1.setUploadedBy("HR Admin");
        documentRepository.save(doc1);

        Document doc2 = new Document();
        doc2.setStaff(staff1);
        doc2.setDocumentName("ID Card Copy");
        doc2.setDocumentType(DocumentType.ID_CARD);
        doc2.setFileName("id_john_doe.pdf");
        doc2.setFileUrl("/documents/id_john_doe.pdf");
        doc2.setFileSize(125000L);
        doc2.setUploadedBy("HR Admin");
        documentRepository.save(doc2);

        System.out.println("Sample data initialized successfully!");
    }
}
