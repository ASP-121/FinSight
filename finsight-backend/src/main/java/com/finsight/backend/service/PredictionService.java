
package com.finsight.backend.service;

import com.finsight.backend.dto.PredictionResponse;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Service
public class PredictionService {

    private static final int HISTORY_MONTHS = 6;
    private static final int MINIMUM_OBSERVATIONS = 3;
    private static final int MINIMUM_TRAINING_OBSERVATIONS = 3;

    private final TransactionRepository transactionRepository;

    public PredictionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public PredictionResponse getPredictions(String userId) {
        YearMonth currentMonth = YearMonth.now();
        YearMonth firstMonth = currentMonth.minusMonths(HISTORY_MONTHS);
        YearMonth nextMonth = currentMonth.plusMonths(1);

        // Only the previous six completed calendar months are used.
        // The current month is excluded because it may be incomplete.
        List<Transaction> expenses =
                transactionRepository.findAllByUserId(userId).stream()
                        .filter(t -> t.getType() != null
                                && t.getType().equalsIgnoreCase("EXPENSE"))
                        .filter(t -> t.getAmount() != null
                                && t.getAmount().compareTo(BigDecimal.ZERO) > 0)
                        .filter(t -> t.getDate() != null)
                        .filter(t -> {
                            YearMonth month = YearMonth.from(t.getDate());
                            return !month.isBefore(firstMonth)
                                    && month.isBefore(currentMonth);
                        })
                        .toList();

        // Store totals only for months with recorded expenses.
        // A missing month is NOT silently converted into zero.
        Map<YearMonth, BigDecimal> totals = new TreeMap<>();

        expenses.forEach(t ->
                totals.merge(
                        YearMonth.from(t.getDate()),
                        t.getAmount(),
                        BigDecimal::add
                )
        );

        List<String> missingMonths = new ArrayList<>();
        List<Observation> observations = new ArrayList<>();

        for (int i = 0; i < HISTORY_MONTHS; i++) {
            YearMonth month = firstMonth.plusMonths(i);
            BigDecimal total = totals.get(month);

            if (total == null) {
                missingMonths.add(formatMonth(month));
            } else {
                observations.add(new Observation(
                        monthIndex(month, firstMonth),
                        month,
                        total
                ));
            }
        }

        observations.sort(Comparator.comparing(Observation::month));

        int observedMonths = observations.size();
        BigDecimal predictedAmount = null;
        BigDecimal movingAveragePrediction = null;
        BigDecimal mae = calculateWalkForwardMae(observations);

        String status;
        String explanation;

        if (observedMonths < MINIMUM_OBSERVATIONS) {
            status = "INSUFFICIENT_DATA";
            explanation = "A forecast needs at least "
                    + MINIMUM_OBSERVATIONS
                    + " months with recorded expenses. Found "
                    + observedMonths
                    + ". Missing months are not assumed to have zero spending.";
        } else {
            double regressionForecast = predictNextMonth(
                    observations,
                    HISTORY_MONTHS+1
            );

            predictedAmount = money(Math.max(0.0, regressionForecast));

            double average = observations.stream()
                    .mapToDouble(o -> o.amount().doubleValue())
                    .average()
                    .orElse(0.0);

            movingAveragePrediction = money(Math.max(0.0, average));

            status = observedMonths == HISTORY_MONTHS
                    ? "READY"
                    : "PROVISIONAL";

            explanation = status.equals("READY")
                    ? "Linear Regression was fitted using recorded expenses "
                    + "from all six previous completed months. "
                    + "The data does not independently prove that every "
                    + "month's transactions are complete."
                    : "Provisional Linear Regression forecast based on "
                    + observedMonths + " of the previous six completed "
                    + "months with recorded expenses. Missing months were "
                    + "excluded rather than treated as zero. Record keeping "
                    + "may be incomplete, so use this estimate cautiously.";
        }

        List<PredictionResponse.PredictionDriver> drivers =
                buildDrivers(expenses, predictedAmount);

        List<PredictionResponse.TrendPoint> trendData = new ArrayList<>();

        for (int i = 0; i < HISTORY_MONTHS; i++) {
            YearMonth month = firstMonth.plusMonths(i);
            BigDecimal actual = totals.get(month);

            trendData.add(new PredictionResponse.TrendPoint(
                    formatMonth(month),
                    actual,
                    null,
                    actual == null ? "missing" : "actual"
            ));
        }

        trendData.add(new PredictionResponse.TrendPoint(
                formatMonth(nextMonth),
                null,
                predictedAmount,
                predictedAmount == null ? "unavailable" : "predicted"
        ));

        return new PredictionResponse(
                predictedAmount,
                status,
                formatMonth(nextMonth),
                explanation,
                movingAveragePrediction,
                mae,
                observedMonths,
                missingMonths,
                drivers,
                trendData
        );
    }

    /**
     * Fits y = intercept + slope * x.
     * x is the calendar-month position, so gaps in history remain gaps.
     */
    private double predictNextMonth(
            List<Observation> observations,
            int targetMonthIndex
    ) {
        int n = observations.size();

        double meanX = observations.stream()
                .mapToDouble(Observation::monthIndex)
                .average()
                .orElse(0.0);

        double meanY = observations.stream()
                .mapToDouble(o -> o.amount().doubleValue())
                .average()
                .orElse(0.0);

        double numerator = 0.0;
        double denominator = 0.0;

        for (Observation observation : observations) {
            double xDifference = observation.monthIndex() - meanX;
            double yDifference = observation.amount().doubleValue() - meanY;

            numerator += xDifference * yDifference;
            denominator += xDifference * xDifference;
        }

        if (n < 2 || denominator == 0.0) {
            return meanY;
        }

        double slope = numerator / denominator;
        double intercept = meanY - slope * meanX;

        return intercept + slope * targetMonthIndex;
    }

    /**
     * Walk-forward evaluation: each historical target is predicted using
     * only earlier observations. The target is never included in its model.
     */
    private BigDecimal calculateWalkForwardMae(
            List<Observation> observations
    ) {
        if (observations.size() <= MINIMUM_TRAINING_OBSERVATIONS) {
            return null;
        }

        double absoluteErrorSum = 0.0;
        int evaluatedTargets = 0;

        for (int targetIndex = MINIMUM_TRAINING_OBSERVATIONS;
             targetIndex < observations.size();
             targetIndex++) {

            List<Observation> trainingData =
                    observations.subList(0, targetIndex);

            Observation target = observations.get(targetIndex);

            double predicted = predictNextMonth(
                    trainingData,
                    target.monthIndex()
            );

            predicted = Math.max(0.0, predicted);

            absoluteErrorSum += Math.abs(
                    target.amount().doubleValue() - predicted
            );

            evaluatedTargets++;
        }

        if (evaluatedTargets == 0) {
            return null;
        }

        return money(absoluteErrorSum / evaluatedTargets);
    }

    private List<PredictionResponse.PredictionDriver> buildDrivers(
            List<Transaction> expenses,
            BigDecimal predictedAmount
    ) {
        if (predictedAmount == null
                || predictedAmount.compareTo(BigDecimal.ZERO) <= 0) {
            return List.of();
        }

        Map<String, BigDecimal> categoryTotals = expenses.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getCategory() == null
                                || t.getCategory().isBlank()
                                ? "Other" : t.getCategory(),
                        LinkedHashMap::new,
                        Collectors.reducing(
                                BigDecimal.ZERO,
                                Transaction::getAmount,
                                BigDecimal::add
                        )
                ));

        BigDecimal total = categoryTotals.values().stream()
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (total.compareTo(BigDecimal.ZERO) <= 0) {
            return List.of();
        }

        return categoryTotals.entrySet().stream()
                .map(entry -> {
                    BigDecimal share = entry.getValue()
                            .divide(total, 8, RoundingMode.HALF_UP);

                    BigDecimal estimatedAmount = predictedAmount
                            .multiply(share)
                            .setScale(2, RoundingMode.HALF_UP);

                    return new PredictionResponse.PredictionDriver(
                            entry.getKey(),
                            estimatedAmount,
                            "estimated"
                    );
                })
                .sorted(Comparator.comparing(
                        PredictionResponse.PredictionDriver::amount
                ).reversed())
                .limit(5)
                .toList();
    }

    private int monthIndex(YearMonth month, YearMonth firstMonth) {
        return (int) (
                month.getLong(ChronoField.PROLEPTIC_MONTH)
                        - firstMonth.getLong(ChronoField.PROLEPTIC_MONTH)
        );
    }

    private String formatMonth(YearMonth month) {
        return month.getMonth().getDisplayName(
                TextStyle.SHORT,
                Locale.ENGLISH
        ) + " " + month.getYear();
    }

    private BigDecimal money(double amount) {
        return BigDecimal.valueOf(amount)
                .setScale(2, RoundingMode.HALF_UP);
    }

    private record Observation(
            int monthIndex,
            YearMonth month,
            BigDecimal amount
    ) {}
}
