
package com.finsight.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import com.finsight.backend.util.CurrencyFormatter;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class InsightDetectionService {

    private static final BigDecimal SPENDING_DECREASE_THRESHOLD =
            new BigDecimal("20");

    private static final BigDecimal SPENDING_WARNING_PERCENTAGE =
            new BigDecimal("20");

    private static final BigDecimal SPENDING_WARNING_AMOUNT =
            new BigDecimal("500");

    private static final BigDecimal SPENDING_CRITICAL_PERCENTAGE =
            new BigDecimal("50");

    private static final BigDecimal SPENDING_CRITICAL_AMOUNT =
            new BigDecimal("2000");

    private static final BigDecimal BUDGET_WARNING_THRESHOLD =
            new BigDecimal("80");

    private static final BigDecimal BUDGET_CRITICAL_THRESHOLD =
            new BigDecimal("100");

    private static final int GOAL_DEADLINE_WARNING_DAYS = 30;


    public List<DetectedInsight> detect(
            FinancialAnalysisService.FinancialSnapshot snapshot) {

        List<DetectedInsight> insights = new ArrayList<>();

        detectNegativeSavings(snapshot, insights);
        detectPositiveSavings(snapshot, insights);
        detectCategorySpendingIncreases(snapshot, insights);
        detectCategorySpendingDecreases(snapshot, insights);
        detectBudgetWarnings(snapshot, insights);
        detectHealthyBudgets(snapshot, insights);
        detectGoalDeadlines(snapshot, insights);

        // If there is no current-month financial activity,
        // provide an informative message instead of a blank response.
        if (snapshot.monthlyIncome().compareTo(BigDecimal.ZERO) == 0
                && snapshot.monthlyExpenses().compareTo(BigDecimal.ZERO) == 0) {

            insights.add(new DetectedInsight(
                    "OVERVIEW",
                    "INFO",
                    "Your financial overview is waiting",
                    "No income or expenses have been recorded for this month yet.",
                    "Add your transactions to receive personalized financial insights.",
                    null,
                    BigDecimal.ZERO,
                    null
            ));
        }

        return insights;
    }

    private void detectPositiveSavings(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        if (snapshot.monthlyIncome().compareTo(BigDecimal.ZERO) > 0
                && snapshot.savings().compareTo(BigDecimal.ZERO) > 0) {

            insights.add(new DetectedInsight(
                    "SAVINGS",
                    "SUCCESS",
                    "You're maintaining positive savings",
                    "Your income is higher than your expenses this month, leaving you with savings of "
                            + CurrencyFormatter.formatINR(snapshot.savings()) + ".",
                    "Continue monitoring your expenses and maintain this healthy savings habit.",
                    null,
                    snapshot.savings(),
                    snapshot.savingsRate()
            ));
        }
    }

    private void detectNegativeSavings(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        BigDecimal income = snapshot.monthlyIncome();
        BigDecimal expenses = snapshot.monthlyExpenses();

        if (expenses.compareTo(income) <= 0) {
            return;
        }

        BigDecimal deficit = expenses.subtract(income);

        BigDecimal deficitPercentage;

        if (income.compareTo(BigDecimal.ZERO) <= 0) {
            deficitPercentage = BigDecimal.valueOf(100);
        } else {
            deficitPercentage = deficit
                    .multiply(BigDecimal.valueOf(100))
                    .divide(income, 2, RoundingMode.HALF_UP);
        }

        String severity = deficitPercentage.compareTo(
                BigDecimal.valueOf(20)
        ) >= 0 ? "CRITICAL" : "WARNING";

        String description =
                "Your expenses exceed your income by "
                        + CurrencyFormatter.formatINR(deficit)
                        + ", representing "
                        + deficitPercentage
                        + "% of your monthly income.";

        String recommendation = severity.equals("CRITICAL")
                ? "Prioritize essential expenses, reduce discretionary spending, and review your financial commitments immediately."
                : "Review your recent spending and identify areas where you can reduce expenses.";

        insights.add(new DetectedInsight(
                "SAVINGS",
                severity,
                "Expenses exceed income",
                description,
                recommendation,
                null,
                deficit,
                deficitPercentage
        ));
    }



    private void detectCategorySpendingIncreases(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        Map<String, BigDecimal> currentSpending =
                snapshot.currentCategorySpending();

        Map<String, BigDecimal> previousSpending =
                snapshot.previousCategorySpending();

        for (Map.Entry<String, BigDecimal> entry :
                currentSpending.entrySet()) {

            String category = entry.getKey();
            BigDecimal current = entry.getValue();

            BigDecimal previous = previousSpending.getOrDefault(
                    category, BigDecimal.ZERO);

            // Cannot calculate a meaningful percentage without a baseline.
            if (previous.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal increase = current.subtract(previous);

            // Ignore categories where spending did not increase.
            if (increase.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal increasePercentage = increase
                    .multiply(BigDecimal.valueOf(100))
                    .divide(previous, 2, RoundingMode.HALF_UP);

            boolean criticalIncrease =
                    increasePercentage.compareTo(
                            SPENDING_CRITICAL_PERCENTAGE) >= 0
                            && increase.compareTo(
                            SPENDING_CRITICAL_AMOUNT) >= 0;

            boolean warningIncrease =
                    increasePercentage.compareTo(
                            SPENDING_WARNING_PERCENTAGE) >= 0
                            && increase.compareTo(
                            SPENDING_WARNING_AMOUNT) >= 0;

            if (!criticalIncrease && !warningIncrease) {
                continue;
            }

            String severity = criticalIncrease
                    ? "CRITICAL"
                    : "WARNING";

            String recommendation = criticalIncrease
                    ? "Review this category's recent expenses immediately and identify purchases that can be reduced or avoided."
                    : "Review recent purchases in this category and monitor whether the increased spending continues.";

            insights.add(new DetectedInsight(
                    "SPENDING",
                    severity,
                    category + " spending increased",
                    "Your spending in " + category +
                            " increased by " + increasePercentage +
                            "% compared to the previous period, representing an additional "
                            + CurrencyFormatter.formatINR(increase) + ".",
                    recommendation,
                    category,
                    increase,
                    increasePercentage
            ));
        }
    }



    // Rule 3: Budget utilization reaches warning or critical levels.
    private void detectBudgetWarnings(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        for (FinancialAnalysisService.BudgetStatus budget :
                snapshot.budgets()) {

            BigDecimal utilization =
                    budget.utilizationPercentage();

            if (utilization.compareTo(
                    BUDGET_CRITICAL_THRESHOLD) >= 0) {

                insights.add(new DetectedInsight(
                        "BUDGET",
                        "CRITICAL",
                        budget.category() + " budget exceeded",
                        "You have used " + utilization +
                                "% of your allocated budget for " +
                                budget.category() + ".",
                        "Stop or reduce further spending in this category until the next budget period.",
                        budget.category(),
                        budget.spent(),
                        utilization
                ));

            } else if (utilization.compareTo(
                    BUDGET_WARNING_THRESHOLD) >= 0) {

                insights.add(new DetectedInsight(
                        "BUDGET",
                        "WARNING",
                        budget.category() + " budget almost exhausted",
                        "You have used " + utilization +
                                "% of your allocated budget for " +
                                budget.category() + ".",
                        "Monitor your remaining budget carefully and avoid unnecessary purchases.",
                        budget.category(),
                        budget.remaining(),
                        utilization
                ));
            }
        }
    }



    private void detectCategorySpendingDecreases(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        Map<String, BigDecimal> currentSpending =
                snapshot.currentCategorySpending();

        Map<String, BigDecimal> previousSpending =
                snapshot.previousCategorySpending();

        for (Map.Entry<String, BigDecimal> entry :
                previousSpending.entrySet()) {

            String category = entry.getKey();
            BigDecimal previous = entry.getValue();

            BigDecimal current = currentSpending.getOrDefault(
                    category, BigDecimal.ZERO);

            if (previous.compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            BigDecimal decrease = previous.subtract(current);

            BigDecimal decreasePercentage = decrease
                    .multiply(BigDecimal.valueOf(100))
                    .divide(previous, 2, RoundingMode.HALF_UP);

            if (decreasePercentage.compareTo(
                    SPENDING_DECREASE_THRESHOLD) >= 0) {

                insights.add(new DetectedInsight(
                        "SPENDING",
                        "INFO",
                        category + " spending decreased",
                        "Your spending in " + category +
                                " has decreased by " +
                                decreasePercentage +
                                "% compared to the previous month.",
                        "Review this change to understand whether it reflects improved spending efficiency or a change in your needs.",
                        category,
                        decrease,
                        decreasePercentage
                ));
            }
        }
    }



    // Rule 4: Financial goal deadline is approaching or overdue.
    private void detectGoalDeadlines(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        LocalDate today = LocalDate.now();

        for (FinancialAnalysisService.GoalStatus goal :
                snapshot.goals()) {

            LocalDate targetDate = goal.targetDate();

            if (targetDate == null ||
                    goal.remainingAmount().compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            long daysRemaining = ChronoUnit.DAYS.between(
                    today, targetDate);

            if (daysRemaining < 0) {

                insights.add(new DetectedInsight(
                        "GOAL",
                        "CRITICAL",
                        goal.title() + " is overdue",
                        "Your target date has passed, but your goal is not yet complete.",
                        "Review your target date and adjust your contribution plan.",
                        goal.title(),
                        goal.remainingAmount(),
                        goal.progressPercentage()
                ));

            } else if (daysRemaining <= GOAL_DEADLINE_WARNING_DAYS) {

                insights.add(new DetectedInsight(
                        "GOAL",
                        "WARNING",
                        goal.title() + " deadline approaching",
                        "You have " + daysRemaining +
                                " days remaining to reach your financial goal.",
                        "Review your remaining target amount and plan your contributions accordingly.",
                        goal.title(),
                        goal.remainingAmount(),
                        goal.progressPercentage()
                ));
            }
        }
    }


    private void detectHealthyBudgets(
            FinancialAnalysisService.FinancialSnapshot snapshot,
            List<DetectedInsight> insights) {

        for (FinancialAnalysisService.BudgetStatus budget :
                snapshot.budgets()) {

            BigDecimal utilization =
                    budget.utilizationPercentage();

            if (budget.spent().compareTo(BigDecimal.ZERO) > 0
                    && utilization.compareTo(
                    BUDGET_WARNING_THRESHOLD) < 0) {

                insights.add(new DetectedInsight(
                        "BUDGET",
                        "SUCCESS",
                        budget.category() + " budget on track",
                        "You've used " + utilization +
                                "% of your allocated budget for " +
                                budget.category() +
                                " and are comfortably within your limit.",
                        "Continue tracking your expenses to stay within your budget.",
                        budget.category(),
                        budget.remaining(),
                        utilization
                ));
            }
        }
    }

    public record DetectedInsight(
            String type,
            String severity,
            String title,
            String description,
            String recommendation,
            String category,
            BigDecimal amount,
            BigDecimal percentage
    ) {}
}
