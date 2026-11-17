package com.finsight.backend.service;

import com.finsight.backend.dto.ChangePasswordRequest;
import com.finsight.backend.dto.MessageResponse;
import com.finsight.backend.dto.UpdateProfileRequest;
import com.finsight.backend.dto.UserProfileResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserProfileResponse getProfile(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return mapToProfileResponse(user);
    }

    public UserProfileResponse updateProfile(String userId, UpdateProfileRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String normalizedEmail = request.email().trim().toLowerCase();
        if (!normalizedEmail.equalsIgnoreCase(user.getEmail()) && userRepository.existsByEmail(normalizedEmail)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists");
        }

        user.setName(request.name().trim());
        user.setEmail(normalizedEmail);
        User saved = userRepository.save(user);

        return mapToProfileResponse(saved);
    }

    public MessageResponse changePassword(String userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (!passwordEncoder.matches(request.currentPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Current password is incorrect");
        }

        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password and confirmation do not match");
        }

        if (passwordEncoder.matches(request.newPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return new MessageResponse("Password updated successfully");
    }

    public Map<String, Object> getPreferences(String userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return user.getPreferences() != null ? user.getPreferences() : defaultPreferences();
    }

    public Map<String, Object> updatePreferences(String userId, Map<String, Object> preferences) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        Map<String, Object> current = user.getPreferences() != null ? new HashMap<>(user.getPreferences()) : defaultPreferences();
        if (preferences != null) {
            current.putAll(preferences);
        }
        user.setPreferences(current);
        userRepository.save(user);

        return current;
    }

    private UserProfileResponse mapToProfileResponse(User user) {
        Map<String, Object> prefs = user.getPreferences() != null && !user.getPreferences().isEmpty()
                ? user.getPreferences()
                : defaultPreferences();
        return new UserProfileResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                prefs
        );
    }

    private Map<String, Object> defaultPreferences() {
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("currency", "INR");
        prefs.put("defaultCategory", "Food");
        prefs.put("budgetAlerts", true);
        prefs.put("unusualSpendingAlerts", true);
        prefs.put("aiWeeklyDigest", true);
        prefs.put("goalMilestoneAlerts", true);
        return prefs;
    }
}
