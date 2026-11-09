package com.finsight.backend.controller;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class MongoHealthController {

    private final MongoTemplate mongoTemplate;

    public MongoHealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/mongo-health")
    public Map<String, String> checkMongoDB() {
        String databaseName = mongoTemplate.getDb().getName();

        mongoTemplate.getDb().runCommand(
                new org.bson.Document("ping", 1)
        );

        return Map.of(
                "status", "CONNECTED",
                "database", databaseName
        );
    }
    @GetMapping("/mongo-info")
    public Map<String, Object> mongoInfo() {
        String database = mongoTemplate.getDb().getName();

        long count = mongoTemplate
                .getCollection("transactions")
                .countDocuments();

        return Map.of(
                "database", database,
                "transactionCount", count
        );
    }
}
