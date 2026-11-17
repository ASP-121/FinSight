
package com.finsight.backend.controller;

import com.finsight.backend.dto.AlertResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.AlertService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<AlertResponse>> getAlerts(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                alertService.getAlerts(user.getId())
        );
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<AlertResponse> markAsRead(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                alertService.markAsRead(id, user.getId())
        );
    }

    @PutMapping("/read-all")
    public ResponseEntity<List<AlertResponse>> markAllAsRead(
            @AuthenticationPrincipal User user
    ) {
        return ResponseEntity.ok(
                alertService.markAllAsRead(user.getId())
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> dismissAlert(
            @PathVariable String id,
            @AuthenticationPrincipal User user
    ) {
        alertService.dismissAlert(id, user.getId());
        return ResponseEntity.noContent().build();
    }
}

