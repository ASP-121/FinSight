package com.finsight.backend.dto;

import java.util.Map;

public record UserProfileResponse(
        String id,
        String name,
        String email,
        Map<String, Object> preferences
) {}
