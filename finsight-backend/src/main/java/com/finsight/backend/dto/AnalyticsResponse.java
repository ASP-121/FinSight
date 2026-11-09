
package com.finsight.backend.dto;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

public record AnalyticsResponse(
        String activeRange,
        Summary summary,
        List<TrendPoint> spendingTrend,
        List<CategoryBreakdown> categoryBreakdown,
        List<SpendingTypeBreakdown> essentialVsDiscretionary,
        List<WeekdayWeekendBreakdown> weekdayVsWeekend,
        List<SpendingPattern> spendingPatterns
) {
    public record Summary(
            BigDecimal totalIncome,
            BigDecimal totalExpenses,
            BigDecimal savings,
            BigDecimal essentialExpenses,
            double essentialRatio
    ) {}

    public record TrendPoint(
            String label,
            BigDecimal income,
            BigDecimal expenses
    ) {}

    public record CategoryBreakdown(
            String category,
            BigDecimal amount,
            double percentage
    ) {}

    public record SpendingTypeBreakdown(
            String name,
            BigDecimal value,
            double percentage
    ) {}

    public record WeekdayWeekendBreakdown(
            String dayType,
            BigDecimal totalSpend,
            BigDecimal avgPerDay
    ) {}

    public record SpendingPattern(
            String insight
    ) {}
}
