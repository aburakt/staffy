package com.staffmanagement.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id", nullable = false)
    private Staff staff;

    @Column(nullable = false)
    private LocalDate date;

    private LocalDateTime clockInTime;
    private LocalDateTime clockOutTime;

    private LocalDateTime breakStartTime;
    private LocalDateTime breakEndTime;

    @Enumerated(EnumType.STRING)
    private AttendanceStatus status;

    // Çalışılan toplam süre (dakika)
    private Long totalWorkMinutes;

    // Fazla mesai süresi (dakika)
    private Long overtimeMinutes;

    // Mola süresi (dakika)
    private Long breakMinutes;

    // GPS koordinatları
    private String clockInLocation;
    private String clockOutLocation;

    // IP adresi
    private String clockInIpAddress;
    private String clockOutIpAddress;

    // Notlar
    private String notes;

    // Onay durumu
    private Boolean approved = false;
    private LocalDateTime approvedAt;
    private String approvedBy;

    @PrePersist
    @PreUpdate
    public void calculateTotalWork() {
        if (clockInTime != null && clockOutTime != null) {
            Duration workDuration = Duration.between(clockInTime, clockOutTime);

            // Mola süresini çıkar
            if (breakStartTime != null && breakEndTime != null) {
                Duration breakDuration = Duration.between(breakStartTime, breakEndTime);
                this.breakMinutes = breakDuration.toMinutes();
                workDuration = workDuration.minus(breakDuration);
            }

            this.totalWorkMinutes = workDuration.toMinutes();

            // Standart 8 saatlik mesaiyi aşarsa fazla mesai hesapla
            long standardMinutes = 8 * 60; // 8 saat
            if (this.totalWorkMinutes > standardMinutes) {
                this.overtimeMinutes = this.totalWorkMinutes - standardMinutes;
            }

            // Durumu belirle
            determineStatus();
        }
    }

    private void determineStatus() {
        if (clockInTime == null && clockOutTime == null) {
            this.status = AttendanceStatus.ABSENT;
            return;
        }

        // Standart giriş saati: 09:00
        LocalDateTime standardClockIn = date.atTime(9, 0);
        // Standart çıkış saati: 18:00
        LocalDateTime standardClockOut = date.atTime(18, 0);

        boolean isLate = clockInTime != null && clockInTime.isAfter(standardClockIn.plusMinutes(15));
        boolean isEarlyLeave = clockOutTime != null && clockOutTime.isBefore(standardClockOut.minusMinutes(15));

        if (totalWorkMinutes != null && totalWorkMinutes < 240) { // 4 saatten az
            this.status = AttendanceStatus.HALF_DAY;
        } else if (overtimeMinutes != null && overtimeMinutes > 0) {
            this.status = AttendanceStatus.OVERTIME;
        } else if (isLate) {
            this.status = AttendanceStatus.LATE;
        } else if (isEarlyLeave) {
            this.status = AttendanceStatus.EARLY_LEAVE;
        } else {
            this.status = AttendanceStatus.PRESENT;
        }
    }
}
