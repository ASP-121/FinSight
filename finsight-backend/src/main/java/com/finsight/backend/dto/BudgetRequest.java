package com.finsight.backend.dto;

import java.math.BigDecimal;

public record BudgetRequest(
        String category,
        BigDecimal allocated,
        String month,
        String color,
        String icon
)
{}
