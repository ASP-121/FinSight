
package com.finsight.backend.service;

import com.finsight.backend.dto.DashboardSummaryResponse;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;

@Service
public class DashboardService {

    private static final BigDecimal ZERO = BigDecimal.ZERO;

    private static final String[] COLORS = {
            "#6366f1", "#14b8a6", "#f59e0b",
            "#ef4444", "#8b5cf6", "#06b6d4",
            "#f97316", "#64748b"
    };

    private final TransactionRepository transactionRepository;

    public DashboardService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public Map<String, Object> getDashboard(String userId) {
        List<Transaction> transactions =
                transactionRepository.findAllByUserId(userId);

        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);
        YearMonth previousMonth = currentMonth.minusMonths(1);

        BigDecimal totalIncome = sum(
                transactions, "INCOME", null, null);

        BigDecimal totalExpenses = sum(
                transactions, "EXPENSE", null, null);

        BigDecimal monthlyIncome = sum(
                transactions, "INCOME",
                currentMonth.atDay(1), today);

        BigDecimal monthlyExpenses = sum(
                transactions, "EXPENSE",
                currentMonth.atDay(1), today);

        BigDecimal previousIncome = sum(
                transactions, "INCOME",
                previousMonth.atDay(1), previousMonth.atEndOfMonth());

        BigDecimal previousExpenses = sum(
                transactions, "EXPENSE",
                previousMonth.atDay(1), previousMonth.atEndOfMonth());

        BigDecimal savings = monthlyIncome.subtract(monthlyExpenses);
        BigDecimal previousSavings =
                previousIncome.subtract(previousExpenses);

        Map<String, Object> summary = new LinkedHashMap<>();

        summary.put("totalBalance", card(
                totalIncome.subtract(totalExpenses),
                BigDecimal.ZERO,
                true,
                "Net from recorded transactions"
        ));

        summary.put("monthlyIncome", card(
                monthlyIncome,
                percentageChange(monthlyIncome, previousIncome),
                monthlyIncome.compareTo(previousIncome) >= 0,
                "Compared with last month"
        ));

        summary.put("monthlyExpenses", card(
                monthlyExpenses,
                percentageChange(monthlyExpenses, previousExpenses),
                monthlyExpenses.compareTo(previousExpenses) <= 0,
                "Compared with last month"
        ));

        summary.put("savings", card(
                savings,
                percentageChange(savings, previousSavings),
                savings.compareTo(previousSavings) >= 0,
                "Income minus expenses this month"
        ));

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("period", currentMonth.getMonth()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                + " " + currentMonth.getYear());
        result.put("summary", summary);
        result.put("spendingTrend", buildSpendingTrend(transactions, today));
        result.put("categorySpending", buildCategorySpending(
                transactions, currentMonth, today));

        return result;
    }

    public DashboardSummaryResponse getSummary(String userId) {
        List<Transaction> transactions =
                transactionRepository.findAllByUserId(userId);

        LocalDate today = LocalDate.now();
        YearMonth currentMonth = YearMonth.from(today);

        BigDecimal totalIncome =
                sum(transactions, "INCOME", null, null);
        BigDecimal totalExpenses =
                sum(transactions, "EXPENSE", null, null);
        BigDecimal monthlyIncome =
                sum(transactions, "INCOME", currentMonth.atDay(1), today);
        BigDecimal monthlyExpenses =
                sum(transactions, "EXPENSE", currentMonth.atDay(1), today);

        return new DashboardSummaryResponse(
                totalIncome.subtract(totalExpenses).doubleValue(),
                monthlyIncome.doubleValue(),
                monthlyExpenses.doubleValue(),
                monthlyIncome.subtract(monthlyExpenses).doubleValue(),
                0.0,
                0.0
        );
    }

    private Map<String, Object> card(
            BigDecimal amount,
            BigDecimal change,
            boolean isPositive,
            String label) {

        Map<String, Object> card = new LinkedHashMap<>();
        card.put("amount", amount.doubleValue());
        card.put("changePercentage", change.doubleValue());
        card.put("isPositive", isPositive);
        card.put("label", label);
        return card;
    }

    private BigDecimal percentageChange(
            BigDecimal current, BigDecimal previous) {

        if (previous.compareTo(ZERO) == 0) {
            return current.compareTo(ZERO) == 0
                    ? ZERO
                    : ZERO;
        }

        return current.subtract(previous)
                .multiply(BigDecimal.valueOf(100))
                .divide(previous.abs(), 2, RoundingMode.HALF_UP);
    }

    private BigDecimal sum(
            List<Transaction> transactions,
            String type,
            LocalDate start,
            LocalDate end) {

        return transactions.stream()
                .filter(t -> type.equalsIgnoreCase(t.getType()))
                .filter(t -> t.getAmount() != null)
                .filter(t -> start == null
                        || (t.getDate() != null
                        && !t.getDate().isBefore(start)
                        && !t.getDate().isAfter(end)))
                .map(t -> t.getAmount().abs())
                .reduce(ZERO, BigDecimal::add);
    }

    private Map<String, Object> buildSpendingTrend(
            List<Transaction> transactions, LocalDate today) {

        Map<String, Object> trend = new LinkedHashMap<>();

        // Last 7 days, compared with the preceding 7 days.
        List<Map<String, Object>> week = new ArrayList<>();

        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);

            week.add(point(
                    date.getDayOfWeek().getDisplayName(
                            TextStyle.SHORT, Locale.ENGLISH),
                    sum(transactions, "EXPENSE", date, date),
                    sum(transactions, "EXPENSE",
                            date.minusWeeks(1), date.minusWeeks(1))
            ));
        }

        trend.put("week", week);

        // Each day this month, compared with the same day last month.
        List<Map<String, Object>> month = new ArrayList<>();
        YearMonth current = YearMonth.from(today);
        YearMonth previous = current.minusMonths(1);

        for (int day = 1; day <= today.getDayOfMonth(); day++) {
            LocalDate currentDate = current.atDay(day);
            LocalDate previousDate =
                    previous.atDay(Math.min(day, previous.lengthOfMonth()));

            month.add(point(
                    String.valueOf(day),
                    sum(transactions, "EXPENSE",
                            currentDate, currentDate),
                    sum(transactions, "EXPENSE",
                            previousDate, previousDate)
            ));
        }

        trend.put("month", month);

        // Income and expenses for each month of the current year.
        List<Map<String, Object>> year = new ArrayList<>();
        int yearNumber = today.getYear();

        for (int monthNumber = 1; monthNumber <= 12; monthNumber++) {
            YearMonth ym = YearMonth.of(yearNumber, monthNumber);

            Map<String, Object> point = new LinkedHashMap<>();
            point.put("label", ym.getMonth().getDisplayName(
                    TextStyle.SHORT, Locale.ENGLISH));
            point.put("income", sum(transactions, "INCOME",
                    ym.atDay(1), ym.atEndOfMonth()).doubleValue());
            point.put("expenses", sum(transactions, "EXPENSE",
                    ym.atDay(1),
                    monthNumber == today.getMonthValue()
                            ? today : ym.atEndOfMonth()).doubleValue());

            year.add(point);
        }

        trend.put("year", year);
        return trend;
    }

    private Map<String, Object> point(
            String label, BigDecimal current, BigDecimal previous) {

        Map<String, Object> point = new LinkedHashMap<>();
        point.put("label", label);
        point.put("current", current.doubleValue());
        point.put("previous", previous.doubleValue());
        return point;
    }

    private List<Map<String, Object>> buildCategorySpending(
            List<Transaction> transactions,
            YearMonth month,
            LocalDate today) {

        Map<String, BigDecimal> totals = new TreeMap<>();

        for (Transaction transaction : transactions) {
            if (!"EXPENSE".equalsIgnoreCase(transaction.getType())
                    || transaction.getAmount() == null
                    || transaction.getDate() == null
                    || transaction.getDate().isBefore(month.atDay(1))
                    || transaction.getDate().isAfter(today)) {
                continue;
            }

            String category = transaction.getCategory();

            if (category == null || category.isBlank()) {
                category = "Uncategorized";
            }

            totals.merge(
                    category,
                    transaction.getAmount().abs(),
                    BigDecimal::add
            );
        }

        BigDecimal total = totals.values().stream()
                .reduce(ZERO, BigDecimal::add);

        List<Map<String, Object>> categories = new ArrayList<>();
        int index = 0;

        for (Map.Entry<String, BigDecimal> entry :
                totals.entrySet().stream()
                        .sorted(Map.Entry.<String, BigDecimal>comparingByValue()
                                .reversed())
                        .toList()) {

            BigDecimal amount = entry.getValue();
            BigDecimal percentage = total.compareTo(ZERO) == 0
                    ? ZERO
                    : amount.multiply(BigDecimal.valueOf(100))
                    .divide(total, 2, RoundingMode.HALF_UP);

            Map<String, Object> category = new LinkedHashMap<>();
            category.put("name", entry.getKey());
            category.put("amount", amount.doubleValue());
            category.put("percentage", percentage.doubleValue());
            category.put("color", COLORS[index % COLORS.length]);

            categories.add(category);
            index++;
        }

        return categories;
    }
}
