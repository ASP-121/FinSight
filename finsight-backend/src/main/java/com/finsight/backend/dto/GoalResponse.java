
package com.finsight.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GoalResponse(
        String id,
        String title,
        BigDecimal targetAmount,
        BigDecimal currentAmount,
        LocalDate targetDate,
        String category,
        BigDecimal monthlyContribution,
        String color,
        String icon,
        String description
) {}
