
package com.finsight.backend.service;

import com.finsight.backend.dto.TransactionRequest;
import com.finsight.backend.dto.TransactionResponse;
import com.finsight.backend.model.Transaction;
import com.finsight.backend.repository.TransactionRepository;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(
            TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<TransactionResponse> getAllTransactions(String userId) {
        return transactionRepository.findAllByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public TransactionResponse getTransactionById(
            String id, String userId) {

        Transaction transaction = findOwnedTransaction(id, userId);
        return toResponse(transaction);
    }

    public TransactionResponse createTransaction(
            TransactionRequest request, String userId) {

        Transaction transaction = new Transaction(
                userId,
                request.description(),
                request.amount(),
                request.type(),
                request.category(),
                request.date()
        );

        Transaction saved = transactionRepository.save(transaction);
        return toResponse(saved);
    }

    public TransactionResponse updateTransaction(
            String id,
            TransactionRequest request,
            String userId) {

        Transaction transaction = findOwnedTransaction(id, userId);

        transaction.setDescription(request.description());
        transaction.setAmount(request.amount());
        transaction.setType(request.type());
        transaction.setCategory(request.category());
        transaction.setDate(request.date());

        Transaction updated = transactionRepository.save(transaction);
        return toResponse(updated);
    }

    public void deleteTransaction(String id, String userId) {
        Transaction transaction = findOwnedTransaction(id, userId);
        transactionRepository.delete(transaction);
    }

    private Transaction findOwnedTransaction(String id, String userId) {
        return transactionRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Transaction not found"
                ));
    }

    private TransactionResponse toResponse(Transaction transaction) {
        return new TransactionResponse(
                transaction.getId(),
                transaction.getDescription(),
                transaction.getAmount(),
                transaction.getType(),
                transaction.getCategory(),
                transaction.getDate()
        );
    }
}
