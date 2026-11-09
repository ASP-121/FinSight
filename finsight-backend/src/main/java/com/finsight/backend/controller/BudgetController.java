
package com.finsight.backend.controller;

import com.finsight.backend.dto.BudgetRequest;
import com.finsight.backend.dto.BudgetResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.BudgetService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @GetMapping
    public List<BudgetResponse> getBudgets(
            @AuthenticationPrincipal User user
    ) {
        return budgetService.getAllBudgets(user.getId());
    }

    @PostMapping
    public ResponseEntity<BudgetResponse> createBudget(
            @RequestBody BudgetRequest request,
            @AuthenticationPrincipal User user
    ) {
        BudgetResponse response =
                budgetService.createBudget(request, user.getId());

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{id}")
    public BudgetResponse updateBudget(
            @PathVariable String id,
            @RequestBody BudgetRequest request,
            @AuthenticationPrincipal User user
    ) {
        return budgetService.updateBudget(id, request, user.getId());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        budgetService.deleteBudget(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}
