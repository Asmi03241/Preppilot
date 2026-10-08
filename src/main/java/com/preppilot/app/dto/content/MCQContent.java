package com.preppilot.app.dto.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MCQContent {
    private String title;
    private int totalQuestions;
    private List<MCQQuestion> questions = new ArrayList<>();

    public MCQContent() {}

    public MCQContent(String title, List<MCQQuestion> questions) {
        this.title = title;
        this.questions = questions != null ? questions : new ArrayList<>();
        this.totalQuestions = this.questions.size();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getTotalQuestions() {
        return questions != null ? questions.size() : totalQuestions;
    }

    public void setTotalQuestions(int totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public List<MCQQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<MCQQuestion> questions) {
        this.questions = questions;
        if (questions != null) {
            this.totalQuestions = questions.size();
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MCQQuestion {
        private int id;
        private String question;
        private List<String> options = new ArrayList<>();
        private int correctIndex;
        private String explanation;
        private String difficulty = "medium";
        private String topic;

        public MCQQuestion() {}

        public MCQQuestion(int id, String question, List<String> options, int correctIndex, String explanation, String difficulty, String topic) {
            this.id = id;
            this.question = question;
            this.options = options;
            this.correctIndex = correctIndex;
            this.explanation = explanation;
            this.difficulty = difficulty;
            this.topic = topic;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getQuestion() {
            return question;
        }

        public void setQuestion(String question) {
            this.question = question;
        }

        public List<String> getOptions() {
            return options;
        }

        public void setOptions(List<String> options) {
            this.options = options;
        }

        public int getCorrectIndex() {
            return correctIndex;
        }

        public void setCorrectIndex(int correctIndex) {
            this.correctIndex = correctIndex;
        }

        public String getExplanation() {
            return explanation;
        }

        public void setExplanation(String explanation) {
            this.explanation = explanation;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getTopic() {
            return topic;
        }

        public void setTopic(String topic) {
            this.topic = topic;
        }
    }
}
