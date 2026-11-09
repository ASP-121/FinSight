
package com.finsight.backend.service;

import com.finsight.backend.dto.BudgetRequest;
import com.finsight.backend.dto.BudgetResponse;
import com.finsight.backend.model.Budget;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.repository.BudgetRepository;
import com.finsight.backend.repository.TransactionRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;

@Service
public class BudgetService {

    private static final DateTimeFormatter MONTH_FORMATTER =
            DateTimeFormatter.ofPattern("MMMM yyyy", Locale.ENGLISH);

    private final BudgetRepository budgetRepository;
    private final TransactionRepository transactionRepository;

    public BudgetService(
            BudgetRepository budgetRepository,
            TransactionRepository transactionRepository
    ) {
        this.budgetRepository = budgetRepository;
        this.transactionRepository = transactionRepository;
    }

    public List<BudgetResponse> getAllBudgets(String userId) {
        List<Transaction> transactions =
                transactionRepository.findAllByUserId(userId);

        return budgetRepository.findAllByUserId(userId)
                .stream()
                .map(budget -> toResponse(budget, transactions))
                .toList();
    }

    public BudgetResponse createBudget(BudgetRequest request, String userId) {
        validateRequest(request);

        Budget budget = new Budget();
        budget.setUserId(userId);
        applyRequest(budget, request);

        Budget savedBudget = budgetRepository.save(budget);

        List<Transaction> transactions =
                transactionRepository.findAllByUserId(userId);

        return toResponse(savedBudget, transactions);
    }

    public BudgetResponse updateBudget(
            String id,
            BudgetRequest request,
            String userId
    ) {
        validateRequest(request);

        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Budget not found"
                ));

        applyRequest(budget, request);

        Budget savedBudget = budgetRepository.save(budget);

        List<Transaction> transactions =
                transactionRepository.findAllByUserId(userId);

        return toResponse(savedBudget, transactions);
    }

    public void deleteBudget(String id, String userId) {
        Budget budget = budgetRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Budget not found"
                ));

        budgetRepository.delete(budget);
    }

    private void applyRequest(Budget budget, BudgetRequest request) {
        budget.setCategory(request.category().trim());
        budget.setAllocated(request.allocated());
        budget.setMonth(request.month().trim());
        budget.setColor(
                request.color() == null || request.color().isBlank()
                        ? "#3b82f6"
                        : request.color()
        );
        budget.setIcon(
                request.icon() == null || request.icon().isBlank()
                        ? "Wallet"
                        : request.icon()
        );
    }

    private void validateRequest(BudgetRequest request) {
        if (request == null
                || request.category() == null
                || request.category().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Category is required"
            );
        }

        if (request.allocated() == null
                || request.allocated().compareTo(BigDecimal.ZERO) <= 0) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Allocated budget must be greater than zero"
            );
        }

        if (request.month() == null || request.month().isBlank()) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Month is required"
            );
        }

        try {
            YearMonth.parse(request.month().trim(), MONTH_FORMATTER);
        } catch (DateTimeParseException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Month must use the format 'October 2026'"
            );
        }
    }

    private BudgetResponse toResponse(
            Budget budget,
            List<Transaction> transactions
    ) {
        BigDecimal spent = calculateSpent(budget, transactions);

        return new BudgetResponse(
                budget.getId(),
                budget.getCategory(),
                budget.getAllocated(),
                spent,
                budget.getMonth(),
                budget.getColor(),
                budget.getIcon()
        );
    }

    private BigDecimal calculateSpent(
            Budget budget,
            List<Transaction> transactions
    ) {
        YearMonth budgetMonth =
                YearMonth.parse(budget.getMonth(), MONTH_FORMATTER);

        return transactions.stream()
                .filter(transaction ->
                        "EXPENSE".equalsIgnoreCase(
                                String.valueOf(transaction.getType())
                        )
                )
                .filter(transaction ->
                        transaction.getCategory() != null
                                && transaction.getCategory().equalsIgnoreCase(
                                budget.getCategory()
                        )
                )
                .filter(transaction -> {
                    LocalDate date = transaction.getDate();
                    return date != null
                            && YearMonth.from(date).equals(budgetMonth);
                })
                .filter(transaction -> transaction.getAmount() != null)
                .map(transaction -> transaction.getAmount().abs())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }
}
