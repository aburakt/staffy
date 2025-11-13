package com.staffmanagement.service;

import com.staffmanagement.model.LeaveRequest;
import com.staffmanagement.model.Staff;
import lombok.RequiredArgsConstructor;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class LeaveCertificateService {
    private final LeaveRequestService leaveRequestService;
    private final StaffService staffService;

    public byte[] generateLeaveCertificate(Long leaveRequestId) throws IOException {
        LeaveRequest leaveRequest = leaveRequestService.getLeaveRequestById(leaveRequestId);
        Staff staff = leaveRequest.getStaff();

        XWPFDocument document = new XWPFDocument();

        // Title
        XWPFParagraph titlePara = document.createParagraph();
        titlePara.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titlePara.createRun();
        titleRun.setBold(true);
        titleRun.setFontSize(16);
        titleRun.setText("İZİN BELGESİ");
        titleRun.addBreak();
        titleRun.addBreak();

        // Document date
        XWPFParagraph datePara = document.createParagraph();
        datePara.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun dateRun = datePara.createRun();
        dateRun.setText("Tarih: " + LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        dateRun.addBreak();

        // Main content
        XWPFParagraph contentPara = document.createParagraph();
        contentPara.setAlignment(ParagraphAlignment.BOTH);
        XWPFRun contentRun = contentPara.createRun();

        contentRun.setText("Şirketimizde ");

        XWPFRun boldRun = contentPara.createRun();
        boldRun.setBold(true);
        boldRun.setText(staff.getPosition());

        contentRun = contentPara.createRun();
        contentRun.setText(" pozisyonunda çalışan ");

        boldRun = contentPara.createRun();
        boldRun.setBold(true);
        boldRun.setText(staff.getFirstName() + " " + staff.getLastName());

        contentRun = contentPara.createRun();
        contentRun.setText(" (T.C. Kimlik No: __________) adlı personelimize, ");

        LocalDate startDate = LocalDate.parse(leaveRequest.getStartDate());
        LocalDate endDate = LocalDate.parse(leaveRequest.getEndDate());
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate) + 1;

        boldRun = contentPara.createRun();
        boldRun.setBold(true);
        boldRun.setText(startDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));

        contentRun = contentPara.createRun();
        contentRun.setText(" - ");

        boldRun = contentPara.createRun();
        boldRun.setBold(true);
        boldRun.setText(endDate.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));

        contentRun = contentPara.createRun();
        contentRun.setText(" tarihleri arasında ");

        boldRun = contentPara.createRun();
        boldRun.setBold(true);
        boldRun.setText(daysBetween + " gün");

        contentRun = contentPara.createRun();
        contentRun.setText(" ");

        boldRun = contentPara.createRun();
        boldRun.setBold(true);
        boldRun.setText(getLeaveTypeInTurkish(leaveRequest.getLeaveType().toString()));

        contentRun = contentPara.createRun();
        contentRun.setText(" kullanma izni verilmiştir.");
        contentRun.addBreak();
        contentRun.addBreak();

        // Reason
        if (leaveRequest.getReason() != null && !leaveRequest.getReason().isEmpty()) {
            XWPFParagraph reasonPara = document.createParagraph();
            reasonPara.setAlignment(ParagraphAlignment.BOTH);
            XWPFRun reasonRun = reasonPara.createRun();
            reasonRun.setBold(true);
            reasonRun.setText("İzin Sebebi: ");
            reasonRun = reasonPara.createRun();
            reasonRun.setText(leaveRequest.getReason());
            reasonRun.addBreak();
            reasonRun.addBreak();
        }

        // Employee details
        XWPFParagraph detailsPara = document.createParagraph();
        XWPFRun detailsRun = detailsPara.createRun();
        detailsRun.setBold(true);
        detailsRun.setText("Personel Bilgileri:");
        detailsRun.addBreak();

        detailsRun = detailsPara.createRun();
        detailsRun.setText("Ad Soyad: " + staff.getFirstName() + " " + staff.getLastName());
        detailsRun.addBreak();
        detailsRun.setText("Pozisyon: " + staff.getPosition());
        detailsRun.addBreak();
        detailsRun.setText("Departman: " + staff.getDepartment());
        detailsRun.addBreak();
        detailsRun.setText("İşe Başlama Tarihi: " + LocalDate.parse(staff.getHireDate()).format(DateTimeFormatter.ofPattern("dd.MM.yyyy")));
        detailsRun.addBreak();
        detailsRun.addBreak();
        detailsRun.addBreak();

        // Signature section
        XWPFParagraph signaturePara = document.createParagraph();
        XWPFRun signatureRun = signaturePara.createRun();
        signatureRun.setText("Bilgilerinize sunulur.");
        signatureRun.addBreak();
        signatureRun.addBreak();
        signatureRun.addBreak();

        XWPFParagraph hrPara = document.createParagraph();
        hrPara.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun hrRun = hrPara.createRun();
        hrRun.setText("İnsan Kaynakları Departmanı");
        hrRun.addBreak();
        hrRun.setText("_____________________");
        hrRun.addBreak();
        hrRun.setText("İmza ve Kaşe");

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        document.write(out);
        document.close();

        return out.toByteArray();
    }

    private String getLeaveTypeInTurkish(String leaveType) {
        return switch (leaveType) {
            case "ANNUAL" -> "yıllık izin";
            case "SICK" -> "hastalık izni";
            case "PERSONAL" -> "mazeret izni";
            case "MATERNITY" -> "doğum izni";
            case "PATERNITY" -> "babalık izni";
            case "UNPAID" -> "ücretsiz izin";
            case "EMERGENCY" -> "acil durum izni";
            default -> "izin";
        };
    }
}
