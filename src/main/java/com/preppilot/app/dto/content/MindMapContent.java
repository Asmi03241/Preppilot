package com.preppilot.app.dto.content;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.util.ArrayList;
import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class MindMapContent {
    private String centralTopic;
    private List<MindMapNode> nodes = new ArrayList<>();

    public MindMapContent() {}

    public MindMapContent(String centralTopic, List<MindMapNode> nodes) {
        this.centralTopic = centralTopic;
        this.nodes = nodes != null ? nodes : new ArrayList<>();
    }

    public String getCentralTopic() {
        return centralTopic;
    }

    public void setCentralTopic(String centralTopic) {
        this.centralTopic = centralTopic;
    }

    public List<MindMapNode> getNodes() {
        return nodes;
    }

    public void setNodes(List<MindMapNode> nodes) {
        this.nodes = nodes;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class MindMapNode {
        private String id;
        private String name;
        private String color;
        private List<MindMapNode> children = new ArrayList<>();

        public MindMapNode() {}

        public MindMapNode(String id, String name, String color, List<MindMapNode> children) {
            this.id = id;
            this.name = name;
            this.color = color;
            this.children = children != null ? children : new ArrayList<>();
        }

        public String getId() {
            return id;
        }

        public void setId(String id) {
            this.id = id;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getColor() {
            return color;
        }

        public void setColor(String color) {
            this.color = color;
        }

        public List<MindMapNode> getChildren() {
            return children;
        }

        public void setChildren(List<MindMapNode> children) {
            this.children = children;
        }
    }
}
