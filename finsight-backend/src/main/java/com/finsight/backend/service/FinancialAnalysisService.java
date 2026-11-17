

package com.finsight.backend.service;

import com.finsight.backend.model.Transaction;
import com.finsight.backend.model.Budget;
import com.finsight.backend.model.Goal;
import com.finsight.backend.repository.TransactionRepository;
import com.finsight.backend.repository.BudgetRepository;
import com.finsight.backend.repository.GoalRepository;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class FinancialAnalysisService {

    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;

    public FinancialAnalysisService(
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository,
            GoalRepository goalRepository
    ) {
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
    }

    public FinancialSnapshot analyze(String userId) {

        LocalDate today = LocalDate.now();

        YearMonth currentMonth = YearMonth.from(today);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        // Current month: first day through today.
        LocalDate currentMonthStart = currentMonth.atDay(1);
        LocalDate currentMonthEnd = today;

        // Previous month: first day through the equivalent calendar day.
        // Clamp the day when the previous month has fewer days.
        int comparisonDay = Math.min(
                today.getDayOfMonth(),
                previousMonth.lengthOfMonth()
        );

        LocalDate previousMonthStart = previousMonth.atDay(1);
        LocalDate previousMonthEnd = previousMonth.atDay(comparisonDay);

        List<Transaction> allTransactions =
                transactionRepository.findAllByUserId(userId);

        List<Budget> allBudgets =
                budgetRepository.findAllByUserId(userId);

        List<Goal> allGoals =
                goalRepository.findAllByUserId(userId);

        // Current month transactions.
        List<Transaction> currentMonthTransactions =
                allTransactions.stream()
                        .filter(transaction -> {
                            LocalDate date = transaction.getDate();

                            return date != null
                                    && !date.isBefore(currentMonthStart)
                                    && !date.isAfter(currentMonthEnd);
                        })
                        .toList();

        // Previous month transactions for an equivalent period.
        List<Transaction> previousMonthTransactions =
                allTransactions.stream()
                        .filter(transaction -> {
                            LocalDate date = transaction.getDate();

                            return date != null
                                    && !date.isBefore(previousMonthStart)
                                    && !date.isAfter(previousMonthEnd);
                        })
                        .toList();

        // Income and expenses.
        BigDecimal monthlyIncome =
                calculateTotal(currentMonthTransactions, "INCOME");

        BigDecimal monthlyExpenses =
                calculateTotal(currentMonthTransactions, "EXPENSE");

        BigDecimal previousMonthExpenses =
                calculateTotal(previousMonthTransactions, "EXPENSE");

        // Savings.
        BigDecimal savings =
                monthlyIncome.subtract(monthlyExpenses);

        BigDecimal savingsRate = BigDecimal.ZERO;

        if (monthlyIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = savings
                    .multiply(BigDecimal.valueOf(100))
                    .divide(
                            monthlyIncome,
                            2,
                            RoundingMode.HALF_UP
                    );
        }

        // Category-wise spending for both equivalent periods.
        Map<String, BigDecimal> currentCategorySpending =
                calculateCategorySpending(currentMonthTransactions);

        Map<String, BigDecimal> previousCategorySpending =
                calculateCategorySpending(previousMonthTransactions);

        // Current month's budgets.
        String currentMonthName = currentMonth.format(
                DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH)
        );

        List<Budget> currentMonthBudgets =
                allBudgets.stream()
                        .filter(budget ->
                                currentMonthName.equals(budget.getMonth())
                        )
                        .toList();

        List<BudgetStatus> budgetStatuses =
                currentMonthBudgets.stream()
                        .map(budget -> {

                            BigDecimal allocated =
                                    safe(budget.getAllocated());

                            BigDecimal spent =
                                    currentCategorySpending.getOrDefault(
                                            budget.getCategory(),
                                            BigDecimal.ZERO
                                    );

                            BigDecimal utilizationPercentage =
                                    BigDecimal.ZERO;

                            if (allocated.compareTo(BigDecimal.ZERO) > 0) {
                                utilizationPercentage = spent
                                        .multiply(BigDecimal.valueOf(100))
                                        .divide(
                                                allocated,
                                                2,
                                                RoundingMode.HALF_UP
                                        );
                            }

                            BigDecimal remaining =
                                    allocated.subtract(spent);

                            return new BudgetStatus(
                                    budget.getCategory(),
                                    allocated,
                                    spent,
                                    utilizationPercentage,
                                    remaining
                            );
                        })
                        .toList();

        // Financial goal progress.
        List<GoalStatus> goalStatuses =
                allGoals.stream()
                        .map(goal -> {

                            BigDecimal targetAmount =
                                    safe(goal.getTargetAmount());

                            BigDecimal currentAmount =
                                    safe(goal.getCurrentAmount());

                            BigDecimal remainingAmount =
                                    targetAmount.subtract(currentAmount);

                            BigDecimal progressPercentage =
                                    BigDecimal.ZERO;

                            if (targetAmount.compareTo(BigDecimal.ZERO) > 0) {
                                progressPercentage = currentAmount
                                        .multiply(BigDecimal.valueOf(100))
                                        .divide(
                                                targetAmount,
                                                2,
                                                RoundingMode.HALF_UP
                                        );
                            }

                            return new GoalStatus(
                                    goal.getTitle(),
                                    targetAmount,
                                    currentAmount,
                                    remainingAmount,
                                    progressPercentage,
                                    goal.getTargetDate()
                            );
                        })
                        .toList();

        return new FinancialSnapshot(
                currentMonthName,
                monthlyIncome,
                monthlyExpenses,
                previousMonthExpenses,
                savings,
                savingsRate,
                currentCategorySpending,
                previousCategorySpending,
                budgetStatuses,
                goalStatuses
        );
    }

    private BigDecimal calculateTotal(
            List<Transaction> transactions,
            String type
    ) {
        return transactions.stream()
                .filter(transaction ->
                        type.equalsIgnoreCase(transaction.getType())
                )
                .map(transaction -> safe(transaction.getAmount()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private Map<String, BigDecimal> calculateCategorySpending(
            List<Transaction> transactions
    ) {
        return transactions.stream()
                .filter(transaction ->
                        "EXPENSE".equalsIgnoreCase(transaction.getType())
                )
                .collect(Collectors.groupingBy(
                        transaction -> transaction.getCategory() == null
                                ? "Uncategorized"
                                : transaction.getCategory(),
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                transaction -> safe(transaction.getAmount()),
                                BigDecimal::add
                        )
                ));
    }

    private BigDecimal safe(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    public record FinancialSnapshot(
            String month,
            BigDecimal monthlyIncome,
            BigDecimal monthlyExpenses,
            BigDecimal previousMonthExpenses,
            BigDecimal savings,
            BigDecimal savingsRate,
            Map<String, BigDecimal> currentCategorySpending,
            Map<String, BigDecimal> previousCategorySpending,
            List<BudgetStatus> budgets,
            List<GoalStatus> goals
    ) {}

    public record BudgetStatus(
            String category,
            BigDecimal allocated,
            BigDecimal spent,
            BigDecimal utilizationPercentage,
            BigDecimal remaining
    ) {}

    public record GoalStatus(
            String title,
            BigDecimal targetAmount,
            BigDecimal currentAmount,
            BigDecimal remainingAmount,
            BigDecimal progressPercentage,
            LocalDate targetDate
    ) {}
}

