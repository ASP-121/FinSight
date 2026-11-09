

package com.finsight.backend.service;

import com.finsight.backend.dto.AnalyticsResponse;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
public class AnalyticsService {

    private static final Set<String> ESSENTIAL_CATEGORIES = Set.of(
            "transport",
            "bills",
            "healthcare",
            "education",
            "groceries"
    );

    private final TransactionRepository transactionRepository;

    public AnalyticsService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public AnalyticsResponse getAnalytics(String userId, String range) {

        String selectedRange = range == null
                ? "month"
                : range.toLowerCase(Locale.ROOT);

        if (!List.of("week", "month", "year").contains(selectedRange)) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Range must be week, month, or year"
            );
        }

        List<Transaction> allTransactions =
                transactionRepository.findAllByUserId(userId);

        LocalDate today = LocalDate.now();
        LocalDate startDate;

        switch (selectedRange) {
            case "week" -> startDate = today.minusDays(6);
            case "year" -> startDate = today.withDayOfYear(1);
            default -> startDate = today.withDayOfMonth(1);
        }

        final LocalDate periodStart = startDate;

        List<Transaction> filteredTransactions = allTransactions.stream()
                .filter(t -> t.getDate() != null)
                .filter(t -> !t.getDate().isBefore(periodStart))
                .filter(t -> !t.getDate().isAfter(today))
                .toList();

        // 1. Calculate income, expenses and savings
        BigDecimal totalIncome =
                sumByType(filteredTransactions, "INCOME");

        BigDecimal totalExpenses =
                sumByType(filteredTransactions, "EXPENSE");

        BigDecimal savings = totalIncome.subtract(totalExpenses);

        // 2. Calculate essential expenses
        BigDecimal essentialExpenses = filteredTransactions.stream()
                .filter(t -> t.getType() != null
                        && t.getType().toString()
                        .equalsIgnoreCase("EXPENSE"))
                .filter(t -> t.getAmount() != null)
                .filter(t -> t.getCategory() != null
                        && ESSENTIAL_CATEGORIES.contains(
                        t.getCategory().trim().toLowerCase(Locale.ROOT)
                ))
                .map(t -> t.getAmount().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 3. Calculate discretionary expenses
        BigDecimal discretionaryExpenses =
                totalExpenses.subtract(essentialExpenses);

        // 4. Calculate percentages of total expenses
        double essentialRatio = calculatePercentage(
                essentialExpenses, totalExpenses
        );

        double discretionaryPercentage = calculatePercentage(
                discretionaryExpenses, totalExpenses
        );

        // 5. Build Essential vs Discretionary breakdown
        List<AnalyticsResponse.SpendingTypeBreakdown>
                spendingTypeBreakdown = List.of(
                new AnalyticsResponse.SpendingTypeBreakdown(
                        "Essential",
                        essentialExpenses,
                        essentialRatio
                ),
                new AnalyticsResponse.SpendingTypeBreakdown(
                        "Discretionary",
                        discretionaryExpenses,
                        discretionaryPercentage
                )
        );

        // Calculate weekday and weekend spending
        BigDecimal weekdayTotal = BigDecimal.ZERO;
        BigDecimal weekendTotal = BigDecimal.ZERO;

        int weekdayCount = 0;
        int weekendCount = 0;

// Count elapsed weekdays and weekend days in the selected period
        LocalDate day = periodStart;

        while (!day.isAfter(today)) {
            if (day.getDayOfWeek().getValue() <= 5) {
                weekdayCount++;
            } else {
                weekendCount++;
            }

            day = day.plusDays(1);
        }

// Sum expenses by transaction date
        for (Transaction transaction : filteredTransactions) {
            if (transaction.getType() == null
                    || !transaction.getType().toString()
                    .equalsIgnoreCase("EXPENSE")
                    || transaction.getAmount() == null
                    || transaction.getDate() == null) {
                continue;
            }

            if (transaction.getDate().getDayOfWeek().getValue() <= 5) {
                weekdayTotal = weekdayTotal.add(
                        transaction.getAmount().abs()
                );
            } else {
                weekendTotal = weekendTotal.add(
                        transaction.getAmount().abs()
                );
            }
        }

// Calculate average spending per elapsed day
        BigDecimal weekdayAverage = weekdayCount == 0
                ? BigDecimal.ZERO
                : weekdayTotal.divide(
                BigDecimal.valueOf(weekdayCount),
                2,
                RoundingMode.HALF_UP
        );

        BigDecimal weekendAverage = weekendCount == 0
                ? BigDecimal.ZERO
                : weekendTotal.divide(
                BigDecimal.valueOf(weekendCount),
                2,
                RoundingMode.HALF_UP
        );

        List<AnalyticsResponse.WeekdayWeekendBreakdown> weekdayWeekendBreakdown =
                List.of(
                        new AnalyticsResponse.WeekdayWeekendBreakdown(
                                "Weekday", weekdayTotal, weekdayAverage
                        ),
                        new AnalyticsResponse.WeekdayWeekendBreakdown(
                                "Weekend", weekendTotal, weekendAverage
                        )
                );

        List<AnalyticsResponse.CategoryBreakdown> categoryBreakdown =
                buildCategoryBreakdown(filteredTransactions, totalExpenses);

        List<AnalyticsResponse.SpendingPattern> spendingPatterns =
                buildSpendingPatterns(
                        categoryBreakdown,
                        essentialExpenses,
                        totalExpenses,
                        weekdayAverage,
                        weekendAverage
                );

        // 6. Build the complete analytics response
        return new AnalyticsResponse(
                selectedRange,
                new AnalyticsResponse.Summary(
                        totalIncome,
                        totalExpenses,
                        savings,
                        essentialExpenses,
                        essentialRatio
                ),
                buildSpendingTrend(
                        filteredTransactions,
                        selectedRange,
                        periodStart,
                        today
                ),
                buildCategoryBreakdown(
                        filteredTransactions,
                        totalExpenses
                ),
                spendingTypeBreakdown,
                weekdayWeekendBreakdown,
                spendingPatterns
        );
    }

    private BigDecimal sumByType(
            List<Transaction> transactions,
            String type
    ) {
        return transactions.stream()
                .filter(t -> t.getType() != null
                        && type.equalsIgnoreCase(
                        t.getType().toString()
                ))
                .filter(t -> t.getAmount() != null)
                .map(t -> t.getAmount().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private double calculatePercentage(
            BigDecimal amount,
            BigDecimal total
    ) {
        if (total.signum() == 0) {
            return 0.0;
        }

        return amount.multiply(BigDecimal.valueOf(100))
                .divide(total, 2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    private List<AnalyticsResponse.TrendPoint> buildSpendingTrend(
            List<Transaction> transactions,
            String range,
            LocalDate startDate,
            LocalDate today
    ) {
        Map<String, BigDecimal> incomeByPeriod =
                new LinkedHashMap<>();

        Map<String, BigDecimal> expensesByPeriod =
                new LinkedHashMap<>();

        DateTimeFormatter formatter = range.equals("year")
                ? DateTimeFormatter.ofPattern("MMM", Locale.ENGLISH)
                : DateTimeFormatter.ofPattern("dd MMM", Locale.ENGLISH);

        LocalDate cursor = startDate;

        while (!cursor.isAfter(today)) {
            String label = cursor.format(formatter);

            incomeByPeriod.put(label, BigDecimal.ZERO);
            expensesByPeriod.put(label, BigDecimal.ZERO);

            if (range.equals("year")) {
                cursor = cursor.plusMonths(1);
            } else {
                cursor = cursor.plusDays(1);
            }
        }

        for (Transaction transaction : transactions) {
            if (transaction.getDate() == null
                    || transaction.getAmount() == null
                    || transaction.getType() == null) {
                continue;
            }

            String label = transaction.getDate().format(formatter);
            String type = transaction.getType().toString();

            if (type.equalsIgnoreCase("INCOME")) {
                incomeByPeriod.computeIfPresent(
                        label,
                        (key, value) ->
                                value.add(transaction.getAmount().abs())
                );
            } else if (type.equalsIgnoreCase("EXPENSE")) {
                expensesByPeriod.computeIfPresent(
                        label,
                        (key, value) ->
                                value.add(transaction.getAmount().abs())
                );
            }
        }

        List<AnalyticsResponse.TrendPoint> result =
                new ArrayList<>();

        for (String label : incomeByPeriod.keySet()) {
            result.add(new AnalyticsResponse.TrendPoint(
                    label,
                    incomeByPeriod.get(label),
                    expensesByPeriod.get(label)
            ));
        }

        return result;
    }

    private List<AnalyticsResponse.CategoryBreakdown>
    buildCategoryBreakdown(
            List<Transaction> transactions,
            BigDecimal totalExpenses
    ) {
        Map<String, BigDecimal> categoryTotals =
                new LinkedHashMap<>();

        for (Transaction transaction : transactions) {
            if (transaction.getType() == null
                    || !transaction.getType().toString()
                    .equalsIgnoreCase("EXPENSE")
                    || transaction.getAmount() == null) {
                continue;
            }

            String category = transaction.getCategory() == null
                    || transaction.getCategory().isBlank()
                    ? "Other"
                    : transaction.getCategory().trim();

            categoryTotals.merge(
                    category,
                    transaction.getAmount().abs(),
                    BigDecimal::add
            );
        }

        List<AnalyticsResponse.CategoryBreakdown> result =
                new ArrayList<>();

        categoryTotals.forEach((category, amount) -> {
            double percentage = calculatePercentage(
                    amount, totalExpenses
            );

            result.add(new AnalyticsResponse.CategoryBreakdown(
                    category,
                    amount,
                    percentage
            ));
        });

        return result;
    }


    private List<AnalyticsResponse.SpendingPattern> buildSpendingPatterns(
            List<AnalyticsResponse.CategoryBreakdown> categories,
            BigDecimal essentialExpenses,
            BigDecimal totalExpenses,
            BigDecimal weekdayAverage,
            BigDecimal weekendAverage
    ) {
        List<AnalyticsResponse.SpendingPattern> patterns = new ArrayList<>();

        // 1. Highest-spending category
        categories.stream()
                .max((a, b) -> a.amount().compareTo(b.amount()))
                .ifPresent(category -> patterns.add(
                        new AnalyticsResponse.SpendingPattern(
                                "Your highest-spending category is "
                                        + category.category()
                                        + " at "
                                        + category.amount().toPlainString()
                                        + "."
                        )
                ));

        // 2. Weekday vs weekend average spending
        int comparison = weekendAverage.compareTo(weekdayAverage);

        if (weekdayAverage.signum() == 0 && weekendAverage.signum() == 0) {
            patterns.add(new AnalyticsResponse.SpendingPattern(
                    "There is no spending recorded in this period yet."
            ));
        } else if (weekdayAverage.signum() == 0) {
            patterns.add(new AnalyticsResponse.SpendingPattern(
                    "Spending was recorded on weekends but not on weekdays."
            ));
        } else if (comparison > 0) {
            patterns.add(new AnalyticsResponse.SpendingPattern(
                    "Your average daily spending is higher on weekends than on weekdays."
            ));
        } else if (comparison < 0) {
            patterns.add(new AnalyticsResponse.SpendingPattern(
                    "Your average daily spending is higher on weekdays than on weekends."
            ));
        } else {
            patterns.add(new AnalyticsResponse.SpendingPattern(
                    "Your average daily spending is equal on weekdays and weekends."
            ));
        }

        // 3. Essential spending ratio
        double essentialRatio = totalExpenses.signum() == 0
                ? 0.0
                : essentialExpenses.multiply(BigDecimal.valueOf(100))
                .divide(totalExpenses, 2, RoundingMode.HALF_UP)
                .doubleValue();

        if (totalExpenses.signum() > 0) {
            patterns.add(new AnalyticsResponse.SpendingPattern(
                    "Essential expenses account for "
                            + essentialRatio
                            + "% of your total expenses."
            ));
        }

        return patterns;
    }

}
