
package com.finsight.backend.service;

import com.finsight.backend.dto.InsightsResponse.HealthMetric;
import com.finsight.backend.util.CurrencyFormatter;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

@Service
public class FinancialHealthScoreService {

    public record HealthScoreResult(
            Integer healthScore,
            List<HealthMetric> breakdown
    ) {}

    public HealthScoreResult calculate(
            FinancialAnalysisService.FinancialSnapshot snapshot
    ) {
        List<HealthMetric> metrics = new ArrayList<>();

        metrics.add(calculateSavingsRate(snapshot));
        metrics.add(calculateBudgetAdherence(snapshot));
        metrics.add(calculateExpenseTrend(snapshot));
        metrics.add(calculateGoalProgress(snapshot));

        List<Integer> availableScores = metrics.stream()
                .map(HealthMetric::score)
                .filter(score -> score != null)
                .toList();

        Integer overallScore = null;

        if (availableScores.size() >= 2) {
            double average = availableScores.stream()
                    .mapToInt(Integer::intValue)
                    .average()
                    .orElse(0);

            overallScore = (int) Math.round(average);
        }

        return new HealthScoreResult(overallScore, metrics);
    }

    private HealthMetric calculateSavingsRate(
            FinancialAnalysisService.FinancialSnapshot snapshot
    ) {
        BigDecimal income = zeroIfNull(snapshot.monthlyIncome());
        BigDecimal savingsRate = zeroIfNull(snapshot.savingsRate());

        if (income.compareTo(BigDecimal.ZERO) <= 0) {
            return new HealthMetric(
                    "Savings Rate",
                    null,
                    "Not enough income data to calculate your savings rate."
            );
        }

        // A 20% savings rate is treated as the target.
        int score = clampScore(
                savingsRate.multiply(BigDecimal.valueOf(5))
        );

        return new HealthMetric(
                "Savings Rate",
                score,
                "Your savings rate is " + formatPercentage(savingsRate)
                        + ". The scoring target is 20%."
        );
    }

    private HealthMetric calculateBudgetAdherence(
            FinancialAnalysisService.FinancialSnapshot snapshot
    ) {
        var budgets = snapshot.budgets();

        if (budgets == null || budgets.isEmpty()) {
            return new HealthMetric(
                    "Budget Adherence",
                    null,
                    "Create budgets to start tracking budget adherence."
            );
        }

        BigDecimal totalScore = BigDecimal.ZERO;
        BigDecimal totalUtilization = BigDecimal.ZERO;

        for (var budget : budgets) {
            BigDecimal utilization =
                    zeroIfNull(budget.utilizationPercentage());

            totalUtilization = totalUtilization.add(utilization);

            BigDecimal budgetScore;

            if (utilization.compareTo(BigDecimal.valueOf(80)) <= 0) {
                budgetScore = BigDecimal.valueOf(100);
            } else if (utilization.compareTo(BigDecimal.valueOf(100)) <= 0) {
                budgetScore = BigDecimal.valueOf(100)
                        .subtract(utilization.subtract(
                                BigDecimal.valueOf(80)
                        ));
            } else {
                budgetScore = BigDecimal.valueOf(80)
                        .subtract(
                                utilization.subtract(BigDecimal.valueOf(100))
                                        .multiply(BigDecimal.valueOf(4))
                        );
            }

            totalScore = totalScore.add(
                    budgetScore.max(BigDecimal.ZERO)
            );
        }

        int score = totalScore.divide(
                BigDecimal.valueOf(budgets.size()),
                0,
                RoundingMode.HALF_UP
        ).intValue();

        BigDecimal averageUtilization = totalUtilization.divide(
                BigDecimal.valueOf(budgets.size()),
                1,
                RoundingMode.HALF_UP
        );

        return new HealthMetric(
                "Budget Adherence",
                score,
                budgets.size() + " budgets tracked with average utilization of "
                        + formatPercentage(averageUtilization) + "."
        );
    }

    private HealthMetric calculateExpenseTrend(
            FinancialAnalysisService.FinancialSnapshot snapshot
    ) {
        BigDecimal previousExpenses =
                zeroIfNull(snapshot.previousMonthExpenses());

        BigDecimal currentExpenses =
                zeroIfNull(snapshot.monthlyExpenses());

        if (previousExpenses.compareTo(BigDecimal.ZERO) <= 0) {
            return new HealthMetric(
                    "Expense Trend",
                    null,
                    "Not enough previous-month expense data for comparison."
            );
        }

        BigDecimal percentageChange = currentExpenses
                .subtract(previousExpenses)
                .multiply(BigDecimal.valueOf(100))
                .divide(previousExpenses, 2, RoundingMode.HALF_UP);

        BigDecimal scoreValue;

        if (percentageChange.compareTo(BigDecimal.ZERO) <= 0) {
            scoreValue = BigDecimal.valueOf(100);
        } else {
            scoreValue = BigDecimal.valueOf(100)
                    .subtract(percentageChange.multiply(
                            BigDecimal.valueOf(2)
                    ));
        }

        int score = clampScore(scoreValue);

        String description;

        if (percentageChange.compareTo(BigDecimal.ZERO) > 0) {
            description = "Expenses increased by "
                    + formatPercentage(percentageChange)
                    + " compared with the previous month.";
        } else if (percentageChange.compareTo(BigDecimal.ZERO) < 0) {
            description = "Expenses decreased by "
                    + formatPercentage(percentageChange.abs())
                    + " compared with the previous month.";
        } else {
            description = "Expenses remained unchanged compared with the previous month.";
        }

        return new HealthMetric(
                "Expense Trend",
                score,
                description
        );
    }

    private HealthMetric calculateGoalProgress(
            FinancialAnalysisService.FinancialSnapshot snapshot
    ) {
        var goals = snapshot.goals();

        if (goals == null || goals.isEmpty()) {
            return new HealthMetric(
                    "Goal Progress",
                    null,
                    "Create financial goals to start tracking your progress."
            );
        }

        BigDecimal totalProgress = BigDecimal.ZERO;

        for (var goal : goals) {
            totalProgress = totalProgress.add(
                    zeroIfNull(goal.progressPercentage())
            );
        }

        BigDecimal averageProgress = totalProgress.divide(
                BigDecimal.valueOf(goals.size()),
                0,
                RoundingMode.HALF_UP
        );

        int score = clampScore(averageProgress);

        return new HealthMetric(
                "Goal Progress",
                score,
                "Average completion across " + goals.size()
                        + " goals is " + formatPercentage(averageProgress) + "."
        );
    }

    private int clampScore(BigDecimal value) {
        return value.max(BigDecimal.ZERO)
                .min(BigDecimal.valueOf(100))
                .setScale(0, RoundingMode.HALF_UP)
                .intValue();
    }

    private BigDecimal zeroIfNull(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    private String formatPercentage(BigDecimal value) {
        return value.setScale(1, RoundingMode.HALF_UP) + "%";
    }
}
