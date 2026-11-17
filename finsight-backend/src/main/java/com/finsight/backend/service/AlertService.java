
package com.finsight.backend.service;

import com.finsight.backend.dto.AlertResponse;
import com.finsight.backend.model.Alert;
import com.finsight.backend.model.Budget;
import com.finsight.backend.model.Goal;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.repository.AlertRepository;
import com.finsight.backend.repository.BudgetRepository;
import com.finsight.backend.repository.GoalRepository;
import com.finsight.backend.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

@Service
public class AlertService {

    private final AlertRepository alertRepository;
    private final TransactionRepository transactionRepository;
    private final BudgetRepository budgetRepository;
    private final GoalRepository goalRepository;

    public AlertService(
            AlertRepository alertRepository,
            TransactionRepository transactionRepository,
            BudgetRepository budgetRepository,
            GoalRepository goalRepository
    ) {
        this.alertRepository = alertRepository;
        this.transactionRepository = transactionRepository;
        this.budgetRepository = budgetRepository;
        this.goalRepository = goalRepository;
    }

    public List<AlertResponse> getAlerts(String userId) {
        generateAlerts(userId);

        return alertRepository
                .findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .filter(alert -> !alert.isDismissed())
                .map(this::toResponse)
                .toList();
    }

    private void generateAlerts(String userId) {
        List<Transaction> transactions =
                transactionRepository.findAllByUserId(userId);

        List<Budget> budgets =
                budgetRepository.findAllByUserId(userId);

        List<Goal> goals =
                goalRepository.findAllByUserId(userId);

        generateBudgetAlerts(userId, budgets, transactions);
        generateTransactionAlerts(userId, transactions);
        generateGoalAlerts(userId, goals);
    }

    private void generateBudgetAlerts(
            String userId,
            List<Budget> budgets,
            List<Transaction> transactions
    ) {
        YearMonthHelper currentMonth = new YearMonthHelper(LocalDate.now());

        for (Budget budget : budgets) {
            if (budget.getAllocated() == null ||
                    budget.getAllocated().compareTo(BigDecimal.ZERO) <= 0) {
                continue;
            }

            if (!currentMonth.matches(budget.getMonth())) {
                continue;
            }

            BigDecimal spent = transactions.stream()
                    .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                    .filter(t -> t.getCategory() != null &&
                            t.getCategory().equalsIgnoreCase(budget.getCategory()))
                    .filter(t -> t.getDate() != null &&
                            currentMonth.contains(t.getDate()))
                    .filter(t -> t.getAmount() != null)
                    .map(t -> t.getAmount().abs())
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            BigDecimal utilization = spent
                    .multiply(BigDecimal.valueOf(100))
                    .divide(budget.getAllocated(), 2, java.math.RoundingMode.HALF_UP);

            String sourceKey = "budget_" + budget.getId() + "_" + currentMonth.key();

            if (utilization.compareTo(BigDecimal.valueOf(80)) >= 0) {
                boolean exceeded = spent.compareTo(budget.getAllocated()) > 0;

                String severity = exceeded ? "high" : "medium";
                String title = exceeded
                        ? budget.getCategory() + " budget exceeded"
                        : budget.getCategory() + " budget almost exhausted";

                String description = exceeded
                        ? "You have spent ₹" + spent + " out of your ₹" +
                        budget.getAllocated() + " monthly limit for " +
                        budget.getCategory() + "."
                        : "You have used " + utilization + "% of your monthly " +
                        budget.getCategory() + " budget.";

                saveAlert(
                        userId,
                        "budget",
                        severity,
                        title,
                        description,
                        "Manage Budgets",
                        "/budgets",
                        "budget_" + budget.getId() + "_" + currentMonth.key()
                );
            }
            else {
                clearAlert(userId, sourceKey);
            }
        }
    }
    private void clearAlert(String userId, String sourceKey)
    {
        alertRepository.deleteByUserIdAndSourceKey(userId, sourceKey);
    }

    private void generateTransactionAlerts(
            String userId,
            List<Transaction> transactions
    ) {
        List<Transaction> expenses = transactions.stream()
                .filter(t -> "EXPENSE".equalsIgnoreCase(t.getType()))
                .filter(t -> t.getAmount() != null && t.getDate() != null)
                .toList();

        if (expenses.size() < 5) {
            return;
        }

        BigDecimal total = expenses.stream()
                .map(t -> t.getAmount().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal average = total.divide(
                BigDecimal.valueOf(expenses.size()),
                2,
                java.math.RoundingMode.HALF_UP
        );

        for (Transaction transaction : expenses) {
            BigDecimal amount = transaction.getAmount().abs();

            if (amount.compareTo(average.multiply(BigDecimal.valueOf(3))) >= 0) {
                String description = "₹" + amount + " — " +
                        transaction.getDescription() +
                        ". This transaction is significantly higher than your " +
                        "average expense.";

                saveAlert(
                        userId,
                        "anomaly",
                        "high",
                        "Unusual transaction detected",
                        description,
                        "Review Transaction",
                        "/transactions?id=" + transaction.getId(),
                        "anomaly_" + transaction.getId()
                );
            }
        }
    }

    private void generateGoalAlerts(
            String userId,
            List<Goal> goals
    ) {
        LocalDate today = LocalDate.now();

        for (Goal goal : goals) {
            if (goal.getTargetDate() == null) {
                continue;
            }

            long daysRemaining = ChronoUnit.DAYS.between(
                    today,
                    goal.getTargetDate()
            );

            if (daysRemaining < 0) {
                saveAlert(
                        userId,
                        "goal",
                        "high",
                        "Goal deadline missed",
                        "Your goal '" + goal.getTitle() +
                                "' has passed its target date.",
                        "View Goal",
                        "/goals",
                        "goal_overdue_" + goal.getId()
                );
            } else if (daysRemaining <= 30) {
                saveAlert(
                        userId,
                        "goal",
                        "medium",
                        "Goal deadline approaching",
                        "Your goal '" + goal.getTitle() +
                                "' is due in " + daysRemaining + " days.",
                        "View Goal",
                        "/goals",
                        "goal_deadline_" + goal.getId()
                );
            }
        }
    }


    private void saveAlert(
            String userId,
            String type,
            String severity,
            String title,
            String description,
            String actionText,
            String actionRoute,
            String sourceKey
    ) {
        Alert alert = alertRepository
                .findByUserIdAndSourceKey(userId, sourceKey)
                .orElseGet(Alert::new);

        boolean isNewAlert = alert.getId() == null;

        if (!isNewAlert && alert.isDismissed()) {
            return;
        }

        alert.setUserId(userId);
        alert.setType(type);
        alert.setSeverity(severity);
        alert.setTitle(title);
        alert.setDescription(description);
        alert.setActionText(actionText);
        alert.setActionRoute(actionRoute);
        alert.setSourceKey(sourceKey);

        if (isNewAlert) {
            alert.setCreatedAt(LocalDateTime.now());
            alert.setDate(LocalDate.now());
            alert.setRead(false);
            alert.setDismissed(false);
        }

        alertRepository.save(alert);
    }


    public AlertResponse markAsRead(String id, String userId) {
        Alert alert = alertRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Alert not found"
                ));

        alert.setRead(true);

        return toResponse(alertRepository.save(alert));
    }

    public List<AlertResponse> markAllAsRead(String userId) {
        List<Alert> alerts =
                alertRepository.findAllByUserIdOrderByCreatedAtDesc(userId);

        alerts.forEach(alert -> alert.setRead(true));

        return alertRepository.saveAll(alerts)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void dismissAlert(String id, String userId) {
        Alert alert = alertRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Alert not found"
                ));

        alert.setDismissed(true);
        alertRepository.save(alert);
    }

    private AlertResponse toResponse(Alert alert) {
        return new AlertResponse(
                alert.getId(),
                alert.getType(),
                alert.getSeverity(),
                alert.getTitle(),
                alert.getDescription(),
                getRelativeTimestamp(alert.getCreatedAt()),
                alert.getDate(),
                alert.isRead(),
                alert.getActionText(),
                alert.getActionRoute()
        );
    }

    private String getRelativeTimestamp(LocalDateTime createdAt) {
        if (createdAt == null) {
            return "";
        }

        long minutes = ChronoUnit.MINUTES.between(
                createdAt, LocalDateTime.now()
        );

        if (minutes < 1) return "Just now";
        if (minutes < 60) return minutes + " minutes ago";

        long hours = minutes / 60;
        if (hours < 24) return hours + " hours ago";

        long days = hours / 24;
        if (days == 1) return "1 day ago";
        if (days < 30) return days + " days ago";

        return ChronoUnit.MONTHS.between(
                createdAt.toLocalDate(), LocalDate.now()
        ) + " months ago";
    }

    private record YearMonthHelper(java.time.YearMonth value) {

        YearMonthHelper(LocalDate date) {
            this(java.time.YearMonth.from(date));
        }

        boolean matches(String month) {
            if (month == null) return false;

            try {
                return java.time.YearMonth.parse(
                        month,
                        java.time.format.DateTimeFormatter.ofPattern(
                                "MMMM yyyy", java.util.Locale.ENGLISH
                        )
                ).equals(value);
            } catch (Exception exception) {
                return false;
            }
        }

        boolean contains(LocalDate date) {
            return java.time.YearMonth.from(date).equals(value);
        }

        String key() {
            return value.toString();
        }
    }
    public void refreshAlerts(String userId) {
        generateAlerts(userId);
    }
}
