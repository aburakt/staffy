package com.staffmanagement.service;

import com.staffmanagement.model.Document;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {
    private final DocumentRepository documentRepository;
    private final StaffService staffService;

    public List<Document> getAllDocuments() {
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document not found with id: " + id));
    }

    public List<Document> getDocumentsByStaffId(Long staffId) {
        return documentRepository.findByStaffId(staffId);
    }

    public Document createDocument(Long staffId, Document document) {
        Staff staff = staffService.getStaffById(staffId);
        document.setStaff(staff);
        document.setUploadDate(LocalDateTime.now());

        return documentRepository.save(document);
    }

    public Document updateDocument(Long id, Document documentDetails) {
        Document document = getDocumentById(id);

        document.setDocumentName(documentDetails.getDocumentName());
        document.setDocumentType(documentDetails.getDocumentType());
        document.setFileName(documentDetails.getFileName());
        document.setFileUrl(documentDetails.getFileUrl());
        document.setFileSize(documentDetails.getFileSize());
        document.setNotes(documentDetails.getNotes());

        return documentRepository.save(document);
    }

    public void deleteDocument(Long id) {
        Document document = getDocumentById(id);
        documentRepository.delete(document);
    }
}
