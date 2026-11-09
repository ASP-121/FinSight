package com.finsight.backend.repository;

import java.util.List;
import java.util.Optional;
import com.finsight.backend.model.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface TransactionRepository extends MongoRepository<Transaction,String>
{
    List<Transaction> findAllByUserId(String userId);

    Optional<Transaction> findByIdAndUserId(String id, String userId);
}
