
package com.finsight.backend.service;

import com.finsight.backend.dto.GoalRequest;
import com.finsight.backend.dto.GoalResponse;
import com.finsight.backend.model.Goal;
import com.finsight.backend.repository.GoalRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<GoalResponse> getAllGoals(String userId) {
        return goalRepository.findAllByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public GoalResponse createGoal(GoalRequest request, String userId) {
        validateAmounts(request);

        Goal goal = new Goal();
        goal.setUserId(userId);
        goal.setTitle(request.title());
        goal.setTargetAmount(request.targetAmount());
        goal.setCurrentAmount(request.currentAmount());
        goal.setTargetDate(request.targetDate());
        goal.setCategory(request.category());
        goal.setMonthlyContribution(request.monthlyContribution());
        goal.setColor(request.color() != null
                ? request.color() : "#6366f1");
        goal.setIcon(request.icon() != null
                ? request.icon() : "Target");
        goal.setDescription(request.description());

        return toResponse(goalRepository.save(goal));
    }

    public GoalResponse updateGoal(
            String id, GoalRequest request, String userId) {

        validateAmounts(request);

        Goal goal = findOwnedGoal(id, userId);

        goal.setTitle(request.title());
        goal.setTargetAmount(request.targetAmount());
        goal.setCurrentAmount(request.currentAmount());
        goal.setTargetDate(request.targetDate());
        goal.setCategory(request.category());
        goal.setMonthlyContribution(request.monthlyContribution());
        goal.setColor(request.color() != null
                ? request.color() : goal.getColor());
        goal.setIcon(request.icon() != null
                ? request.icon() : goal.getIcon());
        goal.setDescription(request.description());

        return toResponse(goalRepository.save(goal));
    }

    public GoalResponse contributeToGoal(
            String id, BigDecimal amount, String userId) {

        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Contribution must be greater than zero"
            );
        }

        Goal goal = findOwnedGoal(id, userId);

        BigDecimal updatedAmount = goal.getCurrentAmount().add(amount);

        if (updatedAmount.compareTo(goal.getTargetAmount()) > 0) {
            updatedAmount = goal.getTargetAmount();
        }

        goal.setCurrentAmount(updatedAmount);

        return toResponse(goalRepository.save(goal));
    }

    public void deleteGoal(String id, String userId) {
        Goal goal = findOwnedGoal(id, userId);
        goalRepository.delete(goal);
    }

    private Goal findOwnedGoal(String id, String userId) {
        return goalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Goal not found"
                ));
    }

    private void validateAmounts(GoalRequest request) {
        if (request.targetAmount() == null
                || request.targetAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Target amount must be greater than zero"
            );
        }

        if (request.currentAmount() == null
                || request.currentAmount().compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Current amount cannot be negative"
            );
        }

        if (request.monthlyContribution() == null
                || request.monthlyContribution()
                .compareTo(BigDecimal.ZERO) < 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Monthly contribution cannot be negative"
            );
        }
    }

    private GoalResponse toResponse(Goal goal) {
        return new GoalResponse(
                goal.getId(),
                goal.getTitle(),
                goal.getTargetAmount(),
                goal.getCurrentAmount(),
                goal.getTargetDate(),
                goal.getCategory(),
                goal.getMonthlyContribution(),
                goal.getColor(),
                goal.getIcon(),
                goal.getDescription()
        );
    }
}
