
package com.finsight.backend.controller;

import com.finsight.backend.dto.AssistantRequest;
import com.finsight.backend.dto.AssistantResponse;
import com.finsight.backend.model.User;
import com.finsight.backend.service.AssistantService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/assistant")
public class AssistantController {

    private final AssistantService assistantService;

    public AssistantController(AssistantService assistantService) {
        this.assistantService = assistantService;
    }

    @PostMapping("/chat")
    public AssistantResponse chat(
            @Valid @RequestBody AssistantRequest request,
            @AuthenticationPrincipal User user) {

        return assistantService.chat(request, user.getId());
    }
}
