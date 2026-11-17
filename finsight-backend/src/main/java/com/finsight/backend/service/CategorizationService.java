package com.finsight.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finsight.backend.dto.CategorizeResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class CategorizationService {

    private static final Logger log = LoggerFactory.getLogger(CategorizationService.class);

    private final AiGenerationService aiGenerationService;
    private final ObjectMapper objectMapper;

    // Cache to prevent duplicate AI calls for identical/repeated transaction descriptions
    private final Map<String, CategorizeResponse> classificationCache = new ConcurrentHashMap<>(256);

    // Canonical list of supported FinSight categories
    public static final List<String> SUPPORTED_CATEGORIES = List.of(
            "Food",
            "Groceries",
            "Transport",
            "Shopping",
            "Bills",
            "Entertainment",
            "Healthcare",
            "Education",
            "Salary",
            "Freelance",
            "Other"
    );

    // Rule-based keyword dictionary
    private static final Map<String, List<String>> KEYWORD_RULES = new LinkedHashMap<>();

    static {
        KEYWORD_RULES.put("Food", List.of(
                "swiggy", "zomato", "dinner", "lunch", "breakfast", "cafe", "restaurant",
                "burger", "pizza", "tea", "coffee", "chai", "dining", "kfc", "mcdonald",
                "starbucks", "subway", "dominos", "bakery", "sweets", "snack"
        ));

        KEYWORD_RULES.put("Groceries", List.of(
                "blinkit", "zepto", "instamart", "bigbasket", "grocery", "groceries",
                "supermarket", "milk", "vegetables", "fruits", "dmart", "reliance fresh",
                "nature basket", "spencer", "kirana", "provisions"
        ));

        KEYWORD_RULES.put("Transport", List.of(
                "uber", "ola", "metro", "fuel", "petrol", "diesel", "rapido", "taxi",
                "cab", "bus", "train", "irctc", "toll", "parking", "fastag", "flight",
                "airline", "auto", "railway"
        ));

        KEYWORD_RULES.put("Shopping", List.of(
                "amazon", "flipkart", "myntra", "ajio", "zara", "clothes", "clothing",
                "shoes", "footwear", "electronics", "shopping", "mall", "apparel",
                "fashion", "h&m", "meesho", "nykaa", "tatacliq"
        ));

        KEYWORD_RULES.put("Bills", List.of(
                "bescom", "electricity", "power", "wifi", "broadband", "water", "rent",
                "bill", "gas", "recharge", "mobile bill", "utility", "lpg", "cylinder",
                "airtel", "jio", "vi", "maintenance"
        ));

        KEYWORD_RULES.put("Entertainment", List.of(
                "netflix", "prime", "prime video", "spotify", "hotstar", "disney", "movie",
                "cinema", "pvr", "inox", "game", "gaming", "steam", "playstation",
                "concert", "event", "bookmyshow", "theatre", "audible"
        ));

        KEYWORD_RULES.put("Healthcare", List.of(
                "apollo", "pharmacy", "doctor", "clinic", "medicine", "hospital", "dental",
                "dentist", "pharma", "1mg", "netmeds", "diagnostic", "lab test", "medplus",
                "health", "physiotherapy", "consultation"
        ));

        KEYWORD_RULES.put("Education", List.of(
                "course", "coursera", "udemy", "books", "tuition", "college", "university",
                "school", "training", "certification", "textbook", "edx", "pluralsight",
                "exam fee"
        ));

        KEYWORD_RULES.put("Salary", List.of(
                "salary", "payroll", "stipend", "wage", "wages", "monthly salary",
                "compensation", "bonus"
        ));

        KEYWORD_RULES.put("Freelance", List.of(
                "freelance", "consulting", "upwork", "fiverr", "contract", "client payment",
                "consultancy", "honorarium"
        ));
    }

    public CategorizationService(AiGenerationService aiGenerationService, ObjectMapper objectMapper) {
        this.aiGenerationService = aiGenerationService;
        this.objectMapper = objectMapper;
    }

    public CategorizeResponse categorize(String description) {
        if (description == null || description.trim().isEmpty()) {
            return new CategorizeResponse("Other", 50);
        }

        String normalized = description.toLowerCase().trim();

        // 1. First Layer: Rule-based keyword matching (Fast, reliable, 0 token cost)
        for (Map.Entry<String, List<String>> entry : KEYWORD_RULES.entrySet()) {
            String category = entry.getKey();
            for (String keyword : entry.getValue()) {
                if (normalized.contains(keyword)) {
                    int confidence = category.equals("Salary") ? 99 : 94;
                    return new CategorizeResponse(category, confidence);
                }
            }
        }

        // 2. Check in-memory cache for repeated descriptions
        CategorizeResponse cached = classificationCache.get(normalized);
        if (cached != null) {
            return cached;
        }

        // 3. Second Layer: AI-based categorization with Spring AI / Groq
        CategorizeResponse aiResult = classifyWithAi(description);

        // Put in cache (prevent cache from growing unbounded)
        if (classificationCache.size() > 500) {
            classificationCache.clear();
        }
        classificationCache.put(normalized, aiResult);

        return aiResult;
    }

    private CategorizeResponse classifyWithAi(String description) {
        try {
            String systemPrompt = """
                    You are a financial transaction categorizer for the FinSight personal finance application.
                    Given a transaction description, classify it into EXACTLY ONE of the following supported categories:
                    - Food
                    - Groceries
                    - Transport
                    - Shopping
                    - Bills
                    - Entertainment
                    - Healthcare
                    - Education
                    - Salary
                    - Freelance
                    - Other

                    Respond ONLY with a valid JSON object matching this schema:
                    {"category": "<one of the supported categories above>", "confidence": <integer between 50 and 100>}
                    Do not include Markdown backticks, explanation, or extra keys.
                    """;

            String userPrompt = "Transaction description: \"" + description.replace("\"", "") + "\"";

            String rawResponse = aiGenerationService.generate(systemPrompt, userPrompt);
            if (rawResponse == null || rawResponse.isBlank()) {
                return new CategorizeResponse("Other", 50);
            }

            // Clean markdown wrapping if present
            String cleaned = rawResponse.trim();
            if (cleaned.startsWith("```json")) {
                cleaned = cleaned.substring(7);
            } else if (cleaned.startsWith("```")) {
                cleaned = cleaned.substring(3);
            }
            if (cleaned.endsWith("```")) {
                cleaned = cleaned.substring(0, cleaned.length() - 3);
            }
            cleaned = cleaned.trim();

            JsonNode root = objectMapper.readTree(cleaned);
            String categoryName = root.path("category").asText("Other");
            int confidence = root.path("confidence").asInt(75);

            // Validate that the returned category is one of the supported categories
            String matchedCategory = SUPPORTED_CATEGORIES.stream()
                    .filter(c -> c.equalsIgnoreCase(categoryName))
                    .findFirst()
                    .orElse("Other");

            // Clamp confidence between 50 and 100
            int clampedConfidence = Math.max(50, Math.min(100, confidence));

            return new CategorizeResponse(matchedCategory, clampedConfidence);

        } catch (Exception ex) {
            log.warn("AI categorization failed for description '{}': {}. Falling back to 'Other'.",
                    description, ex.getMessage());
            return new CategorizeResponse("Other", 50);
        }
    }
}
