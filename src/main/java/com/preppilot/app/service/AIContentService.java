package com.preppilot.app.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.preppilot.app.config.AIConfig;
import com.preppilot.app.dto.GenerationRequest;
import com.preppilot.app.dto.content.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AIContentService {

    private static final Logger log = LoggerFactory.getLogger(AIContentService.class);

    private final AIConfig aiConfig;
    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public AIContentService(AIConfig aiConfig, RestClient restClient, ObjectMapper objectMapper) {
        this.aiConfig = aiConfig;
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public MCQContent generateMCQs(String content, GenerationRequest req) {
        int count = req.getCount() != null ? req.getCount() : 10;
        String difficulty = req.getDifficulty();
        boolean explanations = req.getExplanations();

        try {
            String prompt = buildMCQPrompt(content, count, difficulty, req.getQuestionType(), explanations);
            String jsonResponse = callAI(prompt);
            MCQContent result = parseJson(jsonResponse, MCQContent.class);
            if (result != null && result.getQuestions() != null && !result.getQuestions().isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            log.error("AI generation failed for MCQs: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate MCQs with Gemini", e);
        }
        
        throw new RuntimeException("Failed to generate valid MCQ JSON from Gemini");
    }

    public FlashcardContent generateFlashcards(String content, GenerationRequest req) {
        int count = req.getCount() != null ? req.getCount() : 10;
        String style = req.getCardStyle();

        try {
            String prompt = buildFlashcardPrompt(content, count, style);
            String jsonResponse = callAI(prompt);
            FlashcardContent result = parseJson(jsonResponse, FlashcardContent.class);
            if (result != null && result.getCards() != null && !result.getCards().isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            log.error("AI generation failed for Flashcards: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Flashcards with Gemini", e);
        }
        
        throw new RuntimeException("Failed to generate valid Flashcard JSON from Gemini");
    }

    public MindMapContent generateMindMap(String content, GenerationRequest req) {
        String detailLevel = req.getDetailLevel();
        String organization = req.getOrganization();

        try {
            String prompt = buildMindMapPrompt(content, detailLevel, organization);
            String jsonResponse = callAI(prompt);
            MindMapContent result = parseJson(jsonResponse, MindMapContent.class);
            if (result != null && result.getNodes() != null && !result.getNodes().isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            log.error("AI generation failed for MindMap: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Mind Map with Gemini", e);
        }
        
        throw new RuntimeException("Failed to generate valid Mind Map JSON from Gemini");
    }

    public TheoryContent generateTheoryQuestions(String content, GenerationRequest req) {
        int count = req.getCount() != null ? req.getCount() : 5;
        String difficulty = req.getDifficulty();
        String questionType = req.getQuestionType();

        try {
            String prompt = buildTheoryPrompt(content, count, difficulty, questionType);
            String jsonResponse = callAI(prompt);
            TheoryContent result = parseJson(jsonResponse, TheoryContent.class);
            if (result != null && result.getQuestions() != null && !result.getQuestions().isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            log.error("AI generation failed for Theory Questions: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Theory Questions with Gemini", e);
        }
        
        throw new RuntimeException("Failed to generate valid Theory JSON from Gemini");
    }

    public StudyPlanContent generateStudyPlan(String content, GenerationRequest req) {
        String examDate = req.getExamDate();
        String dailyTime = req.getDailyStudyTime();
        String priority = req.getPriority();

        try {
            String prompt = buildStudyPlanPrompt(content, examDate, dailyTime, priority);
            String jsonResponse = callAI(prompt);
            StudyPlanContent result = parseJson(jsonResponse, StudyPlanContent.class);
            if (result != null && result.getSchedule() != null && !result.getSchedule().isEmpty()) {
                return result;
            }
        } catch (Exception e) {
            log.error("AI generation failed for Study Plan: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to generate Study Plan with Gemini", e);
        }
        
        throw new RuntimeException("Failed to generate valid Study Plan JSON from Gemini");
    }

    /* ============================================================
       AI API CALL DISPATCHER (Gemini)
       ============================================================ */

    private String callAI(String prompt) throws Exception {
        return callGemini(prompt);
    }

    private String callGemini(String prompt) throws Exception {
        String apiKey = aiConfig.getApiKey();
        String baseUrl = aiConfig.getBaseUrl();

        String url = baseUrl + (baseUrl.contains("?") ? "&" : "?") + "key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "responseMimeType", "application/json",
                        "temperature", 0.3
                )
        );

        // Retry up to 3 times on transient 503 overload errors
        int maxRetries = 3;
        Exception lastException = null;
        for (int attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                String responseStr = restClient.post()
                        .uri(url)
                        .contentType(MediaType.APPLICATION_JSON)
                        .body(body)
                        .retrieve()
                        .body(String.class);

                JsonNode root = objectMapper.readTree(responseStr);
                JsonNode candidates = root.path("candidates");
                if (candidates.isArray() && !candidates.isEmpty()) {
                    JsonNode parts = candidates.get(0).path("content").path("parts");
                    if (parts.isArray() && !parts.isEmpty()) {
                        JsonNode textNode = parts.get(0).path("text");
                        return cleanJsonMarkdown(textNode.asText());
                    }
                }
                throw new IllegalStateException("Empty or unexpected response from Gemini API");

            } catch (org.springframework.web.client.HttpServerErrorException e) {
                lastException = e;
                if (e.getStatusCode().value() == 503 && attempt < maxRetries) {
                    long waitMs = 2000L * attempt; // 2s, 4s backoff
                    log.warn("Gemini 503 overload on attempt {}/{}. Retrying in {}ms...", attempt, maxRetries, waitMs);
                    Thread.sleep(waitMs);
                } else {
                    throw e;
                }
            }
        }
        throw lastException != null ? lastException : new IllegalStateException("All Gemini retries exhausted");
    }

    private String cleanJsonMarkdown(String raw) {
        if (raw == null) return "{}";
        String trimmed = raw.trim();
        if (trimmed.startsWith("```json")) {
            trimmed = trimmed.substring(7);
        } else if (trimmed.startsWith("```")) {
            trimmed = trimmed.substring(3);
        }
        if (trimmed.endsWith("```")) {
            trimmed = trimmed.substring(0, trimmed.length() - 3);
        }
        return trimmed.trim();
    }

    private <T> T parseJson(String json, Class<T> clazz) {
        try {
            return objectMapper.readValue(json, clazz);
        } catch (Exception e) {
            log.error("Failed to parse AI JSON response into {}: {}", clazz.getSimpleName(), e.getMessage());
            return null;
        }
    }

    /* ============================================================
       PROMPT BUILDERS (Enforcing strict JSON output)
       ============================================================ */

    private String truncate(String text, int maxChars) {
        if (text == null) return "";
        return text.length() > maxChars ? text.substring(0, maxChars) + "..." : text;
    }

    private String buildMCQPrompt(String text, int count, String diff, String type, boolean exp) {
        return "Analyze the following study material and generate exactly " + count + " Multiple Choice Questions (MCQs).\n"
                + "Difficulty level: " + diff + ". Question style: " + type + ".\n"
                + "Include clear explanations: " + exp + ".\n\n"
                + "STUDY MATERIAL:\n" + truncate(text, 14000) + "\n\n"
                + "OUTPUT INSTRUCTIONS:\n"
                + "Return ONLY a JSON object strictly following this JSON schema:\n"
                + "{\n"
                + "  \"title\": \"Subject / Topic Title\",\n"
                + "  \"questions\": [\n"
                + "    {\n"
                + "      \"id\": 1,\n"
                + "      \"question\": \"Question text here?\",\n"
                + "      \"options\": [\"Option A\", \"Option B\", \"Option C\", \"Option D\"],\n"
                + "      \"correctIndex\": 0,\n"
                + "      \"explanation\": \"Detailed explanation of why the correct answer is right\",\n"
                + "      \"difficulty\": \"" + diff + "\",\n"
                + "      \"topic\": \"Topic Name\"\n"
                + "    }\n"
                + "  ]\n"
                + "}\n"
                + "Ensure all options are distinct and plausible distractors.";
    }

    private String buildFlashcardPrompt(String text, int count, String style) {
        return "Analyze the following study material and generate exactly " + count + " flashcards for active recall revision.\n"
                + "Card style: " + style + ".\n\n"
                + "STUDY MATERIAL:\n" + truncate(text, 14000) + "\n\n"
                + "OUTPUT INSTRUCTIONS:\n"
                + "Return ONLY a JSON object strictly following this JSON schema:\n"
                + "{\n"
                + "  \"title\": \"Subject Flashcards\",\n"
                + "  \"cards\": [\n"
                + "    {\n"
                + "      \"id\": 1,\n"
                + "      \"front\": \"Concept / Question / Term\",\n"
                + "      \"back\": \"Concise, memorable definition or answer\",\n"
                + "      \"category\": \"Category or Topic\"\n"
                + "    }\n"
                + "  ]\n"
                + "}\n";
    }

    private String buildMindMapPrompt(String text, String detailLevel, String org) {
        return "Analyze the following study material and construct a hierarchical Mind Map.\n"
                + "Detail level: " + detailLevel + ". Organization structure: " + org + ".\n\n"
                + "STUDY MATERIAL:\n" + truncate(text, 14000) + "\n\n"
                + "OUTPUT INSTRUCTIONS:\n"
                + "Return ONLY a JSON object strictly following this JSON schema:\n"
                + "{\n"
                + "  \"centralTopic\": \"Main Topic Name\",\n"
                + "  \"nodes\": [\n"
                + "    {\n"
                + "      \"id\": \"1\",\n"
                + "      \"name\": \"Major Branch 1\",\n"
                + "      \"color\": \"#451E49\",\n"
                + "      \"children\": [\n"
                + "        { \"id\": \"1.1\", \"name\": \"Subtopic\", \"children\": [] }\n"
                + "      ]\n"
                + "    }\n"
                + "  ]\n"
                + "}\n";
    }

    private String buildTheoryPrompt(String text, int count, String diff, String type) {
        return "Analyze the following study material and generate " + count + " exam-style descriptive theory questions.\n"
                + "Difficulty level: " + diff + ". Question format: " + type + ".\n\n"
                + "STUDY MATERIAL:\n" + truncate(text, 14000) + "\n\n"
                + "OUTPUT INSTRUCTIONS:\n"
                + "Return ONLY a JSON object strictly following this JSON schema:\n"
                + "{\n"
                + "  \"title\": \"Exam Theory Questions\",\n"
                + "  \"questions\": [\n"
                + "    {\n"
                + "      \"id\": 1,\n"
                + "      \"question\": \"Explain the architecture of ...\",\n"
                + "      \"marks\": 5,\n"
                + "      \"modelAnswer\": \"Comprehensive model answer covering fundamental concepts...\",\n"
                + "      \"keyPoints\": [\"Key point 1\", \"Key point 2\", \"Key point 3\"],\n"
                + "      \"difficulty\": \"" + diff + "\"\n"
                + "    }\n"
                + "  ]\n"
                + "}\n";
    }

    private String buildStudyPlanPrompt(String text, String examDate, String dailyTime, String priority) {
        return "Create a strategic study and revision roadmap based on the following material.\n"
                + "Target Exam Date: " + (examDate != null && !examDate.isBlank() ? examDate : "Upcoming Exam") + "\n"
                + "Daily study time commitment: " + dailyTime + " hours/day.\n"
                + "Preparation priority: " + priority + ".\n\n"
                + "STUDY MATERIAL:\n" + truncate(text, 14000) + "\n\n"
                + "OUTPUT INSTRUCTIONS:\n"
                + "Return ONLY a JSON object strictly following this JSON schema:\n"
                + "{\n"
                + "  \"title\": \"Personalized Study Master Plan\",\n"
                + "  \"targetExamDate\": \"" + (examDate != null ? examDate : "Flexible") + "\",\n"
                + "  \"dailyCommitment\": \"" + dailyTime + " hours/day\",\n"
                + "  \"schedule\": [\n"
                + "    {\n"
                + "      \"period\": \"Week 1: Core Fundamentals\",\n"
                + "      \"focus\": \"Foundation & Key Definitions\",\n"
                + "      \"duration\": \"" + dailyTime + " hrs/day\",\n"
                + "      \"tasks\": [\"Task 1\", \"Task 2\", \"Task 3\"],\n"
                + "      \"status\": \"active\"\n"
                + "    }\n"
                + "  ],\n"
                + "  \"keyMilestones\": [\"Complete Foundations Checkpoint\", \"Mock Test Revision\"]\n"
                + "}\n";
    }


}
