package com.staffmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "documents")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @NotBlank(message = "Document name is required")
    private String documentName;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    private String fileName;
    private String fileUrl;
    private Long fileSize;

    private LocalDateTime uploadDate = LocalDateTime.now();
    private String uploadedBy;

    private String notes;
}
