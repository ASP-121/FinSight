
package com.finsight.backend.repository;

import com.finsight.backend.model.Alert;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface AlertRepository extends MongoRepository<Alert, String> {

    List<Alert> findAllByUserIdOrderByCreatedAtDesc(String userId);

    Optional<Alert> findByIdAndUserId(String id, String userId);

    Optional<Alert> findByUserIdAndSourceKey(String userId, String sourceKey);

    void deleteByIdAndUserId(String id, String userId);

    void deleteByUserIdAndSourceKey(String userId, String sourceKey);
}
