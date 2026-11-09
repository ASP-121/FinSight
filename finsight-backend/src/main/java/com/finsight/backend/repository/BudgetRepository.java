
package com.finsight.backend.repository;

import com.finsight.backend.model.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository
        extends MongoRepository<Budget, String> {

    List<Budget> findAllByUserId(String userId);

    Optional<Budget> findByIdAndUserId(
            String id, String userId);
}
