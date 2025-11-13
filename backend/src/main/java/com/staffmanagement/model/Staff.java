package com.staffmanagement.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "staff")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Staff {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    @Email(message = "Invalid email format")
    @NotBlank(message = "Email is required")
    @Column(unique = true)
    private String email;

    private String phone;
    private String address;
    private String position;
    private String department;

    private LocalDate hireDate;
    private LocalDate dateOfBirth;

    @Column(name = "annual_leave_days")
    private Integer annualLeaveDays = 20; // Default 20 days per year

    @Column(name = "used_leave_days")
    private Integer usedLeaveDays = 0;

    @Column(name = "remaining_leave_days")
    private Integer remainingLeaveDays = 20;

    @Column(name = "carried_over_leave_days")
    private Integer carriedOverLeaveDays = 0; // Leave days carried over from previous year

    @Column(name = "last_carryover_year")
    private Integer lastCarryoverYear; // Track when last carryover was done

    private Boolean active = true;

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeaveRequest> leaveRequests = new ArrayList<>();

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();

    public void calculateRemainingLeaveDays() {
        this.remainingLeaveDays = this.annualLeaveDays + this.carriedOverLeaveDays - this.usedLeaveDays;
    }

    /**
     * Process year-end carryover. Unused leave days are carried over (max 5 days)
     * and used leave days are reset for the new year.
     */
    public void processYearEndCarryover(int currentYear) {
        if (this.lastCarryoverYear != null && this.lastCarryoverYear >= currentYear) {
            // Already processed for this year
            return;
        }

        // Calculate unused days from current year
        int unusedDays = this.remainingLeaveDays;

        // Maximum 5 days can be carried over
        this.carriedOverLeaveDays = Math.min(unusedDays, 5);

        // Reset used days for new year
        this.usedLeaveDays = 0;

        // Update last carryover year
        this.lastCarryoverYear = currentYear;

        // Recalculate remaining days
        calculateRemainingLeaveDays();
    }
}
