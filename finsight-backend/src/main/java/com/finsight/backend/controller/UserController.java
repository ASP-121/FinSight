package com.finsight.backend.controller;

import com.finsight.backend.dto.ChangePasswordRequest;
import com.finsight.backend.dto.MessageResponse;
import com.finsight.backend.dto.UpdatePreferencesRequest;
import com.finsight.backend.dto.UpdateProfileRequest;
import com.finsight.backend.dto.UserProfileResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getProfile(user.getId()));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.updateProfile(user.getId(), request));
    }

    @PutMapping("/password")
    public ResponseEntity<MessageResponse> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.changePassword(user.getId(), request));
    }

    @GetMapping("/preferences")
    public ResponseEntity<Map<String, Object>> getPreferences(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.getPreferences(user.getId()));
    }

    @PutMapping("/preferences")
    public ResponseEntity<Map<String, Object>> updatePreferences(
            @RequestBody UpdatePreferencesRequest request,
            @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(userService.updatePreferences(user.getId(), request.preferences()));
    }
}
