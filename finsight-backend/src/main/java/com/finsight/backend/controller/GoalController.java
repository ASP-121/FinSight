
package com.finsight.backend.controller;

import com.finsight.backend.dto.GoalRequest;
import com.finsight.backend.dto.GoalResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.GoalService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping
    public List<GoalResponse> getAllGoals(
            @AuthenticationPrincipal User user) {
        return goalService.getAllGoals(user.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public GoalResponse createGoal(
            @Valid @RequestBody GoalRequest request,
            @AuthenticationPrincipal User user) {
        return goalService.createGoal(request, user.getId());
    }

    @PutMapping("/{id}")
    public GoalResponse updateGoal(
            @PathVariable String id,
            @Valid @RequestBody GoalRequest request,
            @AuthenticationPrincipal User user) {
        return goalService.updateGoal(id, request, user.getId());
    }

    @PatchMapping("/{id}/contribute")
    public GoalResponse contributeToGoal(
            @PathVariable String id,
            @RequestBody ContributionRequest request,
            @AuthenticationPrincipal User user) {
        return goalService.contributeToGoal(
                id, request.amount(), user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteGoal(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        goalService.deleteGoal(id, user.getId());
    }

    public record ContributionRequest(BigDecimal amount) {}
}
