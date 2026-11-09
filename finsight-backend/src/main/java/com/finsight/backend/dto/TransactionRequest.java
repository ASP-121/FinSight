package com.finsight.backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionRequest(

        @NotBlank(message = "Description is required")
        String description,

        @NotNull(message = "Amount is required")
        @DecimalMin(value = "0.01",
                message = "Amount must be greater than zero")
        BigDecimal amount,

        @NotBlank(message = "Type is required")
        @Pattern(regexp = "INCOME|EXPENSE",
                message = "Type must be INCOME or EXPENSE")
        String type,

        @NotBlank(message = "Category is required")
        String category,

        @NotNull(message = "Date is required")
        LocalDate date

)
{}