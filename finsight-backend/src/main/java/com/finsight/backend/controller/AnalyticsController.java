
package com.finsight.backend.controller;

import com.finsight.backend.dto.AnalyticsResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.AnalyticsService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping
    public AnalyticsResponse getAnalytics(
            @RequestParam(defaultValue = "month") String range,
            @AuthenticationPrincipal User user
    ) {
        return analyticsService.getAnalytics(user.getId(), range);
    }
}
