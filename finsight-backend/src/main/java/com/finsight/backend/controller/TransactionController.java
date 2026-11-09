
package com.finsight.backend.controller;

import com.finsight.backend.dto.TransactionRequest;
import com.finsight.backend.dto.TransactionResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.TransactionService;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(
            TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    @GetMapping
    public List<TransactionResponse> getAllTransactions(
            @AuthenticationPrincipal User user) {
        return transactionService.getAllTransactions(user.getId());
    }

    @GetMapping("/{id}")
    public TransactionResponse getTransactionById(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        return transactionService.getTransactionById(id, user.getId());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TransactionResponse createTransaction(
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal User user) {
        return transactionService.createTransaction(request, user.getId());
    }

    @PutMapping("/{id}")
    public TransactionResponse updateTransaction(
            @PathVariable String id,
            @Valid @RequestBody TransactionRequest request,
            @AuthenticationPrincipal User user) {
        return transactionService.updateTransaction(
                id, request, user.getId());
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTransaction(
            @PathVariable String id,
            @AuthenticationPrincipal User user) {
        transactionService.deleteTransaction(id, user.getId());
    }
}
