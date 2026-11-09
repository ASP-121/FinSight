package com.finsight.backend.dto;

public record AuthResponse(
            String id,
            String name,
            String email,
            String message,
            String token
)
{}
