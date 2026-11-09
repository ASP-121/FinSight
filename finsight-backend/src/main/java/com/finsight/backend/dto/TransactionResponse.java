package com.finsight.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record TransactionResponse(
        String id,
        String description,
        BigDecimal amount,
        String type,
        String category,
        LocalDate date
)
{
}