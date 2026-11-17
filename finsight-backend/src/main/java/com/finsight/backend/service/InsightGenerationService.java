

package com.finsight.backend.service;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class InsightGenerationService {


    private static final Logger log =
            LoggerFactory.getLogger(InsightGenerationService.class);

    private final ChatClient chatClient;
    private final ObjectMapper objectMapper;

    public InsightGenerationService(
            ChatClient.Builder chatClientBuilder,
            ObjectMapper objectMapper) {

        this.chatClient = chatClientBuilder.build();
        this.objectMapper = objectMapper;
    }

    public List<GeneratedInsight> generate(
            List<InsightDetectionService.DetectedInsight> detectedInsights) {

        if (detectedInsights == null || detectedInsights.isEmpty()) {
            return List.of();
        }

        // Generate all descriptions using one Groq request.
        Map<Integer, String> descriptions =
                generateDescriptions(detectedInsights);

        List<GeneratedInsight> generatedInsights = new ArrayList<>();

        // Preserve every original insight and its financial data.
        for (int i = 0; i < detectedInsights.size(); i++) {

            InsightDetectionService.DetectedInsight insight =
                    detectedInsights.get(i);

            // Use Java-generated description if Groq does not
            // return a valid description.
            String description = descriptions.getOrDefault(
                    i, insight.description());

            generatedInsights.add(new GeneratedInsight(
                    UUID.randomUUID().toString(),
                    insight.type(),
                    insight.severity(),
                    insight.title(),
                    description,
                    insight.category(),
                    insight.amount(),
                    insight.percentage(),
                    insight.recommendation(),
                    LocalDateTime.now()
            ));
        }

        return generatedInsights;
    }

    private Map<Integer, String> generateDescriptions(
            List<InsightDetectionService.DetectedInsight> insights) {

        try {
            List<InsightPromptItem> promptItems = new ArrayList<>();

            for (int i = 0; i < insights.size(); i++) {

                InsightDetectionService.DetectedInsight insight =
                        insights.get(i);

                promptItems.add(new InsightPromptItem(
                        i,
                        insight.type(),
                        insight.severity(),
                        insight.title(),
                        insight.description(),
                        insight.category(),
                        insight.amount(),
                        insight.percentage()
                ));
            }

            // Convert all insights into a single JSON input.
            String inputJson =
                    objectMapper.writeValueAsString(promptItems);


            String prompt = """
        You are FinSight AI, an intelligent personal finance
        insights assistant designed for Indian users.

        Your task is to generate meaningful, contextual explanations
        for the financial insights provided below.

        INPUT:
        %s

        HOW TO INTERPRET INSIGHTS:

        1. SAVINGS:
           Explain what the user's savings position indicates.
           For positive savings, highlight the benefit of maintaining
           a healthy balance.
           For negative savings, explain the financial pressure
           created when expenses exceed income.

        2. SPENDING:
           Explain the spending behaviour in the given category.
           For increased spending, highlight why the trend may
           require attention.
           For decreased spending, explain the potential benefit
           while acknowledging that spending changes may reflect
           changing needs.

        3. BUDGET:
           Explain the significance of budget utilization.
           Highlight the need to monitor categories approaching
           their allocated limits or exceeding them.

        4. GOAL:
           Explain the user's progress toward the financial goal.
           If the deadline is approaching, communicate the
           importance of reviewing progress and contributions.

        5. OVERVIEW:
           Explain the current state of the user's financial profile
           and what information would help improve the analysis.

        STRICT RULES:

        1. Use the provided verifiedDescription as the factual source.
        2. Use type, severity, title and category to understand context.
        3. Never invent facts, financial figures or assumptions.
        4. Never perform additional financial calculations.
        5. Never change the meaning or severity of an insight.
        6. Do not make unsupported claims about the user's behaviour.
        7. Do not provide recommendations; Java handles recommendations.
        8. Do not mention numerical values, percentages, monetary
           amounts or currency symbols.
        9. Do not use digits or number words in descriptions.
        10. Write one or two concise, natural sentences per insight.
        11. Avoid generic phrases that could apply to every insight.
        12. Avoid repeating the title word for word.
        13. Use simple, professional and helpful language.
        14. Maintain a calm and supportive tone.
        15. Do not use foreign currency references.

        OUTPUT FORMAT:

        Return ONLY valid JSON in this structure:

        {
          "descriptions": [
            {
              "index": 0,
              "description": "Your contextual explanation."
            }
          ]
        }

        Return exactly one description for every input index.
        Preserve all original indices.
        Do not return Markdown or additional text.
        """.formatted(inputJson);



            String response = chatClient
                    .prompt()
                    .user(prompt)
                    .call()
                    .content();


            if (response == null || response.isBlank()) {
                log.warn("Groq returned an empty response. Using Java fallback.");
                return Map.of();
            }


            // Parse Groq's JSON response.
            String cleanResponse = cleanJson(response);

            JsonNode root = objectMapper.readTree(cleanResponse);
            JsonNode descriptionArray = root.path("descriptions");


            if (!descriptionArray.isArray()) {
                log.warn(
                        "Groq returned an invalid JSON structure. Expected a descriptions array. Using Java fallback."
                );
                return Map.of();
            }

            Map<Integer, String> result = new HashMap<>();

            for (JsonNode item : descriptionArray) {

                int index = item.path("index").asInt(-1);

                String description =
                        item.path("description").asText("").trim();

                // Accept only valid indices and descriptions
                // that do not contain financial figures.
                if (index >= 0
                        && index < insights.size()
                        && !description.isBlank()
                        && !containsFinancialFigures(description)) {

                    result.putIfAbsent(index, description);
                }
            }


            log.info(
                    "Groq descriptions accepted: {}/{}",
                    result.size(),
                    insights.size()
            );

            return result;


        } catch (Exception exception) {
            log.error(
                    "Groq insight generation failed. Using Java fallback descriptions.",
                    exception
            );

            return Map.of();
        }
    }

    /**
     * Reject descriptions containing numerical values,
     * percentages or common currency symbols.
     */
    private boolean containsFinancialFigures(String description) {
        return description.matches("(?s).*[0-9₹$%].*");
    }

    private String cleanJson(String response) {

        String cleaned = response.trim();

        // Handle responses wrapped in Markdown code fences.
        if (cleaned.startsWith("```")) {

            int firstNewLine = cleaned.indexOf('\n');

            if (firstNewLine != -1) {
                cleaned = cleaned.substring(firstNewLine + 1);
            }

            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(
                        0, cleaned.length() - 3);
            }
        }

        return cleaned.trim();
    }

    // Data sent to Groq.
    private record InsightPromptItem(
            int index,
            String type,
            String severity,
            String title,
            String verifiedDescription,
            String category,
            BigDecimal amount,
            BigDecimal percentage
    ) {}

    // Existing frontend response structure is preserved.
    public record GeneratedInsight(
            String id,
            String type,
            String severity,
            String title,
            String description,
            String category,
            BigDecimal actualAmount,
            BigDecimal percentageChange,
            String recommendation,
            LocalDateTime generatedAt
    ) {}
}
