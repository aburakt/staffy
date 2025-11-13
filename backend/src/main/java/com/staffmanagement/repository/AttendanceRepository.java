package com.staffmanagement.repository;

import com.staffmanagement.model.AttendanceRecord;
import com.staffmanagement.model.AttendanceStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<AttendanceRecord, Long> {

    List<AttendanceRecord> findByStaffId(Long staffId);

    List<AttendanceRecord> findByDate(LocalDate date);

    List<AttendanceRecord> findByStaffIdAndDateBetween(
        Long staffId,
        LocalDate startDate,
        LocalDate endDate
    );

    Optional<AttendanceRecord> findByStaffIdAndDate(Long staffId, LocalDate date);

    List<AttendanceRecord> findByStatus(AttendanceStatus status);

    List<AttendanceRecord> findByApprovedFalse();

    @Query("SELECT a FROM AttendanceRecord a WHERE a.staff.id = :staffId " +
           "AND YEAR(a.date) = :year AND MONTH(a.date) = :month")
    List<AttendanceRecord> findByStaffIdAndYearAndMonth(
        @Param("staffId") Long staffId,
        @Param("year") int year,
        @Param("month") int month
    );

    @Query("SELECT a FROM AttendanceRecord a WHERE YEAR(a.date) = :year AND MONTH(a.date) = :month")
    List<AttendanceRecord> findByYearAndMonth(
        @Param("year") int year,
        @Param("month") int month
    );

    @Query("SELECT SUM(a.totalWorkMinutes) FROM AttendanceRecord a " +
           "WHERE a.staff.id = :staffId AND a.date BETWEEN :startDate AND :endDate")
    Long sumTotalWorkMinutesByStaffIdAndDateBetween(
        @Param("staffId") Long staffId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    @Query("SELECT SUM(a.overtimeMinutes) FROM AttendanceRecord a " +
           "WHERE a.staff.id = :staffId AND a.date BETWEEN :startDate AND :endDate")
    Long sumOvertimeMinutesByStaffIdAndDateBetween(
        @Param("staffId") Long staffId,
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );
}
