package com.finsight.backend.controller;

import com.finsight.backend.dto.DashboardSummaryResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.DashboardService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping
    public Map<String, Object> getDashboard(
            @AuthenticationPrincipal User user) {
        return dashboardService.getDashboard(user.getId());
    }

    @GetMapping("/summary")
    public DashboardSummaryResponse getSummary(
            @AuthenticationPrincipal User user) {
        return dashboardService.getSummary(user.getId());
    }
}