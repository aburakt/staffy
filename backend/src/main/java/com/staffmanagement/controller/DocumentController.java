package com.staffmanagement.controller;

import com.staffmanagement.model.Document;
import com.staffmanagement.service.DocumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentController {
    private final DocumentService documentService;

    @GetMapping
    public ResponseEntity<List<Document>> getAllDocuments() {
        return ResponseEntity.ok(documentService.getAllDocuments());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Document> getDocumentById(@PathVariable Long id) {
        return ResponseEntity.ok(documentService.getDocumentById(id));
    }

    @GetMapping("/staff/{staffId}")
    public ResponseEntity<List<Document>> getDocumentsByStaffId(@PathVariable Long staffId) {
        return ResponseEntity.ok(documentService.getDocumentsByStaffId(staffId));
    }

    @PostMapping("/staff/{staffId}")
    public ResponseEntity<Document> createDocument(
            @PathVariable Long staffId,
            @Valid @RequestBody Document document) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(documentService.createDocument(staffId, document));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Document> updateDocument(
            @PathVariable Long id,
            @Valid @RequestBody Document document) {
        return ResponseEntity.ok(documentService.updateDocument(id, document));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDocument(@PathVariable Long id) {
        documentService.deleteDocument(id);
        return ResponseEntity.noContent().build();
    }
}
