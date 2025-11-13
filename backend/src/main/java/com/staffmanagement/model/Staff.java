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

    private Boolean active = true;

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<LeaveRequest> leaveRequests = new ArrayList<>();

    @OneToMany(mappedBy = "staff", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Document> documents = new ArrayList<>();

    public void calculateRemainingLeaveDays() {
        this.remainingLeaveDays = this.annualLeaveDays - this.usedLeaveDays;
    }
}
