
package com.finsight.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalRequest(

        @NotBlank(message = "Title is required")
        @Size(max = 100, message = "Title cannot exceed 100 characters")
        String title,

        @NotNull(message = "Target amount is required")
        @DecimalMin(value = "0.01", message = "Target amount must be greater than zero")
        BigDecimal targetAmount,

        @NotNull(message = "Current amount is required")
        @DecimalMin(value = "0.00", message = "Current amount cannot be negative")
        BigDecimal currentAmount,

        @NotNull(message = "Target date is required")
        LocalDate targetDate,

        @NotBlank(message = "Category is required")
        String category,

        @NotNull(message = "Monthly contribution is required")
        @DecimalMin(value = "0.00", message = "Monthly contribution cannot be negative")
        BigDecimal monthlyContribution,

        String color,

        String icon,

        @Size(max = 500, message = "Description cannot exceed 500 characters")
        String description
) {}
