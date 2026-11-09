package com.finsight.backend.dto;

public record DashboardSummaryResponse(
        double balance,
        double monthlyIncome,
        double monthlyExpenses,
        double savings,
        double predictedExpenses,
        double predictionConfidence
)
{
}