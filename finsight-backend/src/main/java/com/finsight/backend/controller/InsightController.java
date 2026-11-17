
package com.finsight.backend.controller;

import com.finsight.backend.dto.InsightsResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.InsightService;
import com.finsight.backend.service.InsightGenerationService;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }

    @GetMapping
    public InsightsResponse getInsights(
            @AuthenticationPrincipal User user
    ) {
        return insightService.generateInsights(user.getId());
    }
}
