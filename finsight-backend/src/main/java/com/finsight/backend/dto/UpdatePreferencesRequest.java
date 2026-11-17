package com.finsight.backend.dto;

import java.util.Map;

public record UpdatePreferencesRequest(
        Map<String, Object> preferences
) {}
