package com.preppilot.app.dto.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class StudyPlanContent {
    private String title;
    private String targetExamDate;
    private String dailyCommitment;
    private List<StudyPlanBlock> schedule = new ArrayList<>();
    private List<String> keyMilestones = new ArrayList<>();

    public StudyPlanContent() {}

    public StudyPlanContent(String title, String targetExamDate, String dailyCommitment, List<StudyPlanBlock> schedule, List<String> keyMilestones) {
        this.title = title;
        this.targetExamDate = targetExamDate;
        this.dailyCommitment = dailyCommitment;
        this.schedule = schedule != null ? schedule : new ArrayList<>();
        this.keyMilestones = keyMilestones != null ? keyMilestones : new ArrayList<>();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTargetExamDate() {
        return targetExamDate;
    }

    public void setTargetExamDate(String targetExamDate) {
        this.targetExamDate = targetExamDate;
    }

    public String getDailyCommitment() {
        return dailyCommitment;
    }

    public void setDailyCommitment(String dailyCommitment) {
        this.dailyCommitment = dailyCommitment;
    }

    public List<StudyPlanBlock> getSchedule() {
        return schedule;
    }

    public void setSchedule(List<StudyPlanBlock> schedule) {
        this.schedule = schedule;
    }

    public List<String> getKeyMilestones() {
        return keyMilestones;
    }

    public void setKeyMilestones(List<String> keyMilestones) {
        this.keyMilestones = keyMilestones;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class StudyPlanBlock {
        private String period; // e.g. "Week 1: Foundations"
        private String focus;  // e.g. "Core Definitions & Principles"
        private String duration; // e.g. "2 hrs/day"
        private List<String> tasks = new ArrayList<>();
        private String status = "upcoming"; // "completed", "active", "upcoming"

        public StudyPlanBlock() {}

        public StudyPlanBlock(String period, String focus, String duration, List<String> tasks, String status) {
            this.period = period;
            this.focus = focus;
            this.duration = duration;
            this.tasks = tasks != null ? tasks : new ArrayList<>();
            this.status = status;
        }

        public String getPeriod() {
            return period;
        }

        public void setPeriod(String period) {
            this.period = period;
        }

        public String getFocus() {
            return focus;
        }

        public void setFocus(String focus) {
            this.focus = focus;
        }

        public String getDuration() {
            return duration;
        }

        public void setDuration(String duration) {
            this.duration = duration;
        }

        public List<String> getTasks() {
            return tasks;
        }

        public void setTasks(List<String> tasks) {
            this.tasks = tasks;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
