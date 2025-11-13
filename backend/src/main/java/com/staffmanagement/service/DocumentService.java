package com.staffmanagement.service;

import com.staffmanagement.exception.ResourceNotFoundException;
import com.staffmanagement.model.Document;
import com.staffmanagement.model.Staff;
import com.staffmanagement.repository.DocumentRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class DocumentService {
    private static final Logger logger = LoggerFactory.getLogger(DocumentService.class);

    private final DocumentRepository documentRepository;
    private final StaffService staffService;

    public List<Document> getAllDocuments() {
        logger.debug("Fetching all documents");
        return documentRepository.findAll();
    }

    public Document getDocumentById(Long id) {
        logger.debug("Fetching document with id: {}", id);
        return documentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Document", id));
    }

    public List<Document> getDocumentsByStaffId(Long staffId) {
        logger.debug("Fetching documents for staff id: {}", staffId);
        return documentRepository.findByStaffId(staffId);
    }

    public Document createDocument(Long staffId, Document document) {
        logger.info("Creating document for staff id: {}", staffId);
        Staff staff = staffService.getStaffById(staffId);
        document.setStaff(staff);
        document.setUploadDate(LocalDateTime.now());

        Document saved = documentRepository.save(document);
        logger.info("Document created successfully with id: {}", saved.getId());
        return saved;
    }

    public Document updateDocument(Long id, Document documentDetails) {
        logger.info("Updating document with id: {}", id);
        Document document = getDocumentById(id);

        document.setDocumentName(documentDetails.getDocumentName());
        document.setDocumentType(documentDetails.getDocumentType());
        document.setFileName(documentDetails.getFileName());
        document.setFileUrl(documentDetails.getFileUrl());
        document.setFileSize(documentDetails.getFileSize());
        document.setNotes(documentDetails.getNotes());

        Document saved = documentRepository.save(document);
        logger.info("Document updated successfully");
        return saved;
    }

    public void deleteDocument(Long id) {
        logger.info("Deleting document with id: {}", id);
        Document document = getDocumentById(id);
        documentRepository.delete(document);
        logger.info("Document deleted successfully");
    }
}
