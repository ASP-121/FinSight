
package com.finsight.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record FinancialSnapshot(

        LocalDate generatedOn,

        BigDecimal monthlyIncome,
        BigDecimal monthlyExpenses,
        BigDecimal netSavings,

        BigDecimal previousMonthExpenses,
        BigDecimal expenseChangePercentage,

        List<CategorySpending> categorySpending,

        List<BudgetStatus> budgetStatuses,

        List<GoalProgress> goalProgress

) {

    public record CategorySpending(
            String category,
            BigDecimal amount,
            double percentage
    ) {}

    public record BudgetStatus(
            String category,
            BigDecimal allocated,
            BigDecimal spent,
            BigDecimal remaining
    ) {}

    public record GoalProgress(
            String title,
            BigDecimal targetAmount,
            BigDecimal currentAmount,
            BigDecimal remainingAmount,
            double progressPercentage,
            LocalDate targetDate
    ) {}
}
