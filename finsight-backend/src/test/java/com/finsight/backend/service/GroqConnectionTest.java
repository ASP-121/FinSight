
package com.finsight.backend.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class GroqConnectionTest {

    @Autowired
    private AiGenerationService aiGenerationService;

    @Test
    void shouldGenerateResponseFromGroq() {

        String response = aiGenerationService.generate(
                "You are a helpful assistant. Follow the user's instructions exactly.",
                "Reply with exactly this text: " +
                        "FinSight reusable AI service is working!"
        );

        System.out.println("\nGroq Response: " + response);

        assertNotNull(response);
        assertFalse(response.isBlank());
        assertTrue(response.contains("FinSight"));
    }
}
