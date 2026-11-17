package com.finsight.backend.controller;

import com.finsight.backend.dto.CategorizeRequest;
import com.finsight.backend.dto.CategorizeResponse;
import com.finsight.backend.service.CategorizationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/ai")
public class CategorizationController {

    private final CategorizationService categorizationService;

    public CategorizationController(CategorizationService categorizationService) {
        this.categorizationService = categorizationService;
    }

    @PostMapping("/categorize")
    public ResponseEntity<CategorizeResponse> categorize(
            @Valid @RequestBody CategorizeRequest request
    ) {
        CategorizeResponse response = categorizationService.categorize(request.description());
        return ResponseEntity.ok(response);
    }
}
