

package com.finsight.backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import com.finsight.backend.util.CurrencyFormatter;
import java.math.BigDecimal;
import com.finsight.backend.dto.InsightsResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InsightService {

    private final FinancialAnalysisService financialAnalysisService;
    private final InsightDetectionService insightDetectionService;
    private final InsightGenerationService insightGenerationService;
    private final FinancialHealthScoreService financialHealthScoreService;

    public InsightService(
            FinancialAnalysisService financialAnalysisService,
            InsightDetectionService insightDetectionService,
            InsightGenerationService insightGenerationService,
            FinancialHealthScoreService financialHealthScoreService
    ) {
        this.financialAnalysisService = financialAnalysisService;
        this.insightDetectionService = insightDetectionService;
        this.insightGenerationService = insightGenerationService;
        this.financialHealthScoreService = financialHealthScoreService;
    }

    public InsightsResponse generateInsights(String userId) {

        var snapshot = financialAnalysisService.analyze(userId);

        var healthResult =
                financialHealthScoreService.calculate(snapshot);

        var detectedInsights =
                insightDetectionService.detect(snapshot);

        var generatedInsights =
                insightGenerationService.generate(detectedInsights);

        List<InsightsResponse.InsightItem> items =
                generatedInsights.stream()
                        .map(insight -> {

                            ActionDetails action =
                                    getActionDetails(insight.type(), insight.category());

                            return new InsightsResponse.InsightItem(
                                    insight.id(),
                                    mapInsightType(insight.severity()),
                                    insight.severity(),
                                    insight.title(),
                                    insight.title(),
                                    buildExplanation(
                                            insight.description(),
                                            insight.recommendation()
                                    ),
                                    insight.category(),
                                    formatImpact(insight),
                                    action.actionText(),
                                    action.actionRoute(),
                                    insight.generatedAt()
                            );
                        })
                        .toList();

        return new InsightsResponse(
                healthResult.healthScore(),
                null,
                healthResult.breakdown(),
                items
        );
    }

    private String mapInsightType(String severity) {
        return switch (severity) {
            case "SUCCESS" -> "good";
            case "WARNING" -> "warning";
            case "CRITICAL" -> "attention";
            default -> "info";
        };
    }


    private ActionDetails getActionDetails(
            String type,
            String category
    ) {

        return switch (type) {

            case "SAVINGS" ->
                    new ActionDetails(
                            "View Transactions",
                            "/transactions"
                    );

            case "SPENDING" -> {
                if (category != null && !category.isBlank()) {
                    String encodedCategory = URLEncoder.encode(
                            category,
                            StandardCharsets.UTF_8
                    );

                    yield new ActionDetails(
                            "View " + category + " Transactions",
                            "/transactions?category=" + encodedCategory
                    );
                }

                yield new ActionDetails(
                        "View Transactions",
                        "/transactions"
                );
            }

            case "BUDGET" ->
                    new ActionDetails(
                            "Review Budget",
                            "/budgets"
                    );

            case "GOAL" ->
                    new ActionDetails(
                            "View Goals",
                            "/goals"
                    );

            case "OVERVIEW" ->
                    new ActionDetails(
                            "Add Transactions",
                            "/transactions"
                    );

            default ->
                    new ActionDetails(null, null);
        };
    }



    private String formatImpact(
            InsightGenerationService.GeneratedInsight insight
    ) {
        BigDecimal amount = insight.actualAmount();
        BigDecimal percentage = insight.percentageChange();

        if (amount == null) {
            return null;
        }

        String formattedAmount = CurrencyFormatter.formatINR(amount);

        return switch (insight.type()) {

            case "SAVINGS" -> {
                if ("SUCCESS".equals(insight.severity())) {
                    yield "+" + formattedAmount + " savings";
                }
                yield "-" + formattedAmount + " deficit";
            }

            case "SPENDING" -> {
                if ("WARNING".equals(insight.severity())
                        || "CRITICAL".equals(insight.severity())) {

                    yield "+" + formattedAmount
                            + " · " + formatPercentage(percentage)
                            + " increase";
                }

                yield formattedAmount
                        + " · " + formatPercentage(percentage)
                        + " reduction";
            }

            case "BUDGET" -> {
                if ("CRITICAL".equals(insight.severity())) {
                    yield formatPercentage(percentage) + " utilized";
                }

                yield formattedAmount + " remaining"
                        + (percentage != null
                        ? " · " + formatPercentage(percentage) + " used"
                        : "");
            }

            case "GOAL" -> formattedAmount + " remaining";

            default -> null;
        };
    }

    private String formatPercentage(BigDecimal percentage) {
        return percentage == null
                ? "N/A"
                : percentage.stripTrailingZeros().toPlainString() + "%";
    }

    private String buildExplanation(
            String description,
            String recommendation
    ) {
        if (recommendation == null || recommendation.isBlank()) {
            return description;
        }

        return description + "\n\nRecommendation: " + recommendation;
    }

    private record ActionDetails(
            String actionText,
            String actionRoute
    ) {}
}
