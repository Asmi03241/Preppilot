package com.preppilot.app.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class AIConfig {

    @Value("${gemini.api.key:}")
    private String apiKey;

    @Value("${gemini.api.url:}")
    private String baseUrl;

    @Bean
    public RestClient restClient() {
        return RestClient.builder().build();
    }

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.findAndRegisterModules();
        return mapper;
    }

    public String getApiKey() {
        // First: value from application.properties (resolved from GEMINI_API_KEY env var)
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            return apiKey.trim();
        }
        // Fallback: read GEMINI_API_KEY or AI_API_KEY from environment or system properties
        String envKey = System.getenv("GEMINI_API_KEY");
        if (envKey != null && !envKey.trim().isEmpty()) return envKey.trim();
        envKey = System.getenv("AI_API_KEY");
        if (envKey != null && !envKey.trim().isEmpty()) return envKey.trim();
        envKey = System.getProperty("GEMINI_API_KEY");
        if (envKey != null && !envKey.trim().isEmpty()) return envKey.trim();
        envKey = System.getProperty("gemini.api.key");
        if (envKey != null && !envKey.trim().isEmpty()) return envKey.trim();
        return "";
    }

    public boolean hasApiKey() {
        String key = getApiKey();
        return key != null && !key.trim().isEmpty();
    }

    public String getBaseUrl() {
        return (baseUrl != null && !baseUrl.trim().isEmpty()) 
                ? baseUrl.trim() 
                : "https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent";
    }
}
