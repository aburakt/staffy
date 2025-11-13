package com.staffmanagement.util;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.Set;

public class DateUtil {

    // Turkish public holidays for 2025 (can be moved to database in future)
    private static final Set<LocalDate> PUBLIC_HOLIDAYS = new HashSet<>();

    static {
        // 2025 Turkish holidays
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 1, 1));   // Yılbaşı
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 4, 10));  // Ramazan Bayramı 1
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 4, 11));  // Ramazan Bayramı 2
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 4, 12));  // Ramazan Bayramı 3
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 4, 23));  // 23 Nisan
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 5, 1));   // İşçi Bayramı
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 5, 19));  // Gençlik ve Spor
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 6, 16));  // Kurban Bayramı 1
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 6, 17));  // Kurban Bayramı 2
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 6, 18));  // Kurban Bayramı 3
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 6, 19));  // Kurban Bayramı 4
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 7, 15));  // Demokrasi ve Milli Birlik
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 8, 30));  // Zafer Bayramı
        PUBLIC_HOLIDAYS.add(LocalDate.of(2025, 10, 29)); // Cumhuriyet Bayramı
    }

    /**
     * Calculate business days between two dates (excluding weekends and holidays)
     */
    public static int calculateBusinessDays(LocalDate startDate, LocalDate endDate) {
        if (startDate.isAfter(endDate)) {
            return 0;
        }

        int businessDays = 0;
        LocalDate current = startDate;

        while (!current.isAfter(endDate)) {
            if (isWorkingDay(current)) {
                businessDays++;
            }
            current = current.plusDays(1);
        }

        return businessDays;
    }

    /**
     * Check if a date is a working day (not weekend and not holiday)
     */
    public static boolean isWorkingDay(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek != DayOfWeek.SATURDAY &&
               dayOfWeek != DayOfWeek.SUNDAY &&
               !PUBLIC_HOLIDAYS.contains(date);
    }

    /**
     * Check if a date is a weekend
     */
    public static boolean isWeekend(LocalDate date) {
        DayOfWeek dayOfWeek = date.getDayOfWeek();
        return dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;
    }

    /**
     * Check if a date is a public holiday
     */
    public static boolean isPublicHoliday(LocalDate date) {
        return PUBLIC_HOLIDAYS.contains(date);
    }

    /**
     * Check if two date ranges overlap
     */
    public static boolean doDateRangesOverlap(LocalDate start1, LocalDate end1,
                                               LocalDate start2, LocalDate end2) {
        return !start1.isAfter(end2) && !end1.isBefore(start2);
    }
}
