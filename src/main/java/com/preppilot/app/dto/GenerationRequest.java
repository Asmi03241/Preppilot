package com.preppilot.app.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class GenerationRequest {

    private String type; // "mcq", "flashcards", "mindmap", "theory", "studyplan"

    // Common / MCQ parameters
    private Integer count = 10;
    private String difficulty = "medium";
    private String questionType = "mixed";
    private Boolean explanations = true;

    // Flashcard parameters
    private String cardStyle = "qa"; // "qa", "cd", "te"

    // Mind map parameters
    private String detailLevel = "detailed"; // "basic", "detailed", "comprehensive"
    private String organization = "topic"; // "topic", "hierarchical", "concept"

    // Study plan parameters
    private String examDate;
    private String dailyStudyTime = "2";
    private String priority = "weak";

    public GenerationRequest() {
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getCount() {
        return count != null && count > 0 ? count : 10;
    }

    public void setCount(Integer count) {
        this.count = count;
    }

    public String getDifficulty() {
        return difficulty != null && !difficulty.isBlank() ? difficulty : "medium";
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getQuestionType() {
        return questionType != null && !questionType.isBlank() ? questionType : "mixed";
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public Boolean getExplanations() {
        return explanations != null ? explanations : true;
    }

    public void setExplanations(Boolean explanations) {
        this.explanations = explanations;
    }

    public String getCardStyle() {
        return cardStyle != null && !cardStyle.isBlank() ? cardStyle : "qa";
    }

    public void setCardStyle(String cardStyle) {
        this.cardStyle = cardStyle;
    }

    public String getDetailLevel() {
        return detailLevel != null && !detailLevel.isBlank() ? detailLevel : "detailed";
    }

    public void setDetailLevel(String detailLevel) {
        this.detailLevel = detailLevel;
    }

    public String getOrganization() {
        return organization != null && !organization.isBlank() ? organization : "topic";
    }

    public void setOrganization(String organization) {
        this.organization = organization;
    }

    public String getExamDate() {
        return examDate;
    }

    public void setExamDate(String examDate) {
        this.examDate = examDate;
    }

    public String getDailyStudyTime() {
        return dailyStudyTime != null && !dailyStudyTime.isBlank() ? dailyStudyTime : "2";
    }

    public void setDailyStudyTime(String dailyStudyTime) {
        this.dailyStudyTime = dailyStudyTime;
    }

    public String getPriority() {
        return priority != null && !priority.isBlank() ? priority : "weak";
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }
}
