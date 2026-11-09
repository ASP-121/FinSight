
package com.finsight.backend.controller;

import com.finsight.backend.dto.PredictionResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.PredictionService;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    private final PredictionService predictionService;

    public PredictionController(PredictionService predictionService) {
        this.predictionService = predictionService;
    }

    @GetMapping
    public PredictionResponse getPredictions(
            @AuthenticationPrincipal User user) {
        return predictionService.getPredictions(user.getId());
    }
}
