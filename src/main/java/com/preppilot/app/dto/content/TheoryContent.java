package com.preppilot.app.dto.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class TheoryContent {
    private String title;
    private int totalQuestions;
    private List<TheoryQuestion> questions = new ArrayList<>();

    public TheoryContent() {}

    public TheoryContent(String title, List<TheoryQuestion> questions) {
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

    public List<TheoryQuestion> getQuestions() {
        return questions;
    }

    public void setQuestions(List<TheoryQuestion> questions) {
        this.questions = questions;
        if (questions != null) {
            this.totalQuestions = questions.size();
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class TheoryQuestion {
        private int id;
        private String question;
        private int marks = 5;
        private String modelAnswer;
        private List<String> keyPoints = new ArrayList<>();
        private String difficulty = "medium";

        public TheoryQuestion() {}

        public TheoryQuestion(int id, String question, int marks, String modelAnswer, List<String> keyPoints, String difficulty) {
            this.id = id;
            this.question = question;
            this.marks = marks;
            this.modelAnswer = modelAnswer;
            this.keyPoints = keyPoints != null ? keyPoints : new ArrayList<>();
            this.difficulty = difficulty;
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

        public int getMarks() {
            return marks;
        }

        public void setMarks(int marks) {
            this.marks = marks;
        }

        public String getModelAnswer() {
            return modelAnswer;
        }

        public void setModelAnswer(String modelAnswer) {
            this.modelAnswer = modelAnswer;
        }

        public List<String> getKeyPoints() {
            return keyPoints;
        }

        public void setKeyPoints(List<String> keyPoints) {
            this.keyPoints = keyPoints;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }
    }
}
