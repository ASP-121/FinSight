package com.finsight.backend.dto;

import jakarta.validation.constraints.NotBlank;

public record CategorizeRequest(
        @NotBlank(message = "Description cannot be empty")
        String description
) {}
