package com.staffmanagement.repository;

import com.staffmanagement.model.Document;
import com.staffmanagement.model.DocumentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByStaffId(Long staffId);
    List<Document> findByDocumentType(DocumentType documentType);
    List<Document> findByStaffIdIn(List<Long> staffIds);
}
