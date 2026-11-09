
package com.finsight.backend.repository;

import com.finsight.backend.model.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface GoalRepository extends MongoRepository<Goal, String> {

    List<Goal> findAllByUserId(String userId);

    Optional<Goal> findByIdAndUserId(String id, String userId);
}
