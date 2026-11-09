
package com.finsight.backend.dto;

import java.math.BigDecimal;

public record BudgetResponse(
        String id,
        String category,
        BigDecimal allocated,
        BigDecimal spent,
        String month,
        String color,
        String icon
) {
}
