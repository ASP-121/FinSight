package com.finsight.backend.dto;

public record CategorizeResponse(
        String category,
        int confidence
) {}
