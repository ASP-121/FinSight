
package com.finsight.backend.dto;

import java.math.BigDecimal;
import java.util.List;

public record PredictionResponse(
        BigDecimal predictedAmount,
        String status,
        String nextMonth,
        String explanation,
        BigDecimal movingAveragePrediction,
        BigDecimal mae,
        Integer observedMonths,
        List<String> missingMonths,
        List<PredictionDriver> drivers,
        List<TrendPoint> trendData
) {
    public record PredictionDriver(
            String factor,
            BigDecimal amount,
            String trend
    ) {}

    public record TrendPoint(
            String month,
            BigDecimal actual,
            BigDecimal predicted,
            String type
    ) {}
}
