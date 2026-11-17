
package com.finsight.backend.dto;

import java.time.LocalDateTime;
import java.util.List;

public record InsightsResponse(
        Integer healthScore,
        Integer previousHealthScore,
        List<HealthMetric> breakdown,
        List<InsightItem> items
) {

    public record HealthMetric(
            String label,
            Integer score,
            String description
    ) {}

    public record InsightItem(
            String id,
            String type,
            String severity,
            String title,
            String message,
            String explanation,
            String category,
            String impact,
            String actionText,
            String actionRoute,
            LocalDateTime date
    ) {}
}
