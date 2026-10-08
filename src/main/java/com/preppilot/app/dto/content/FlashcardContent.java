package com.preppilot.app.dto.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class FlashcardContent {
    private String title;
    private int totalCards;
    private List<FlashcardItem> cards = new ArrayList<>();

    public FlashcardContent() {}

    public FlashcardContent(String title, List<FlashcardItem> cards) {
        this.title = title;
        this.cards = cards != null ? cards : new ArrayList<>();
        this.totalCards = this.cards.size();
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public int getTotalCards() {
        return cards != null ? cards.size() : totalCards;
    }

    public void setTotalCards(int totalCards) {
        this.totalCards = totalCards;
    }

    public List<FlashcardItem> getCards() {
        return cards;
    }

    public void setCards(List<FlashcardItem> cards) {
        this.cards = cards;
        if (cards != null) {
            this.totalCards = cards.size();
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class FlashcardItem {
        private int id;
        private String front;
        private String back;
        private String category;

        public FlashcardItem() {}

        public FlashcardItem(int id, String front, String back, String category) {
            this.id = id;
            this.front = front;
            this.back = back;
            this.category = category;
        }

        public int getId() {
            return id;
        }

        public void setId(int id) {
            this.id = id;
        }

        public String getFront() {
            return front;
        }

        public void setFront(String front) {
            this.front = front;
        }

        public String getBack() {
            return back;
        }

        public void setBack(String back) {
            this.back = back;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }
}
