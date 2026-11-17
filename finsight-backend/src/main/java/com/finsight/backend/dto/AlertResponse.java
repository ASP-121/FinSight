
package com.finsight.backend.dto;

import java.time.LocalDate;

public record AlertResponse(
        String id,
        String type,
        String severity,
        String title,
        String description,
        String timestamp,
        LocalDate date,
        boolean read,
        String actionText,
        String actionRoute
) {}
