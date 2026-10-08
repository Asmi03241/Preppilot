package com.preppilot.app.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.util.HashMap;
import java.util.Map;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class GenerationResponse {

    private boolean success;
    private String message;
    private String type;
    private Long materialId;
    private String fileName;
    private Object data;
    private Map<String, Object> metadata = new HashMap<>();

    public GenerationResponse() {
    }

    public static GenerationResponse success(String type, Long materialId, String fileName, Object data, String message) {
        GenerationResponse resp = new GenerationResponse();
        resp.setSuccess(true);
        resp.setType(type);
        resp.setMaterialId(materialId);
        resp.setFileName(fileName);
        resp.setData(data);
        resp.setMessage(message);
        return resp;
    }

    public static GenerationResponse error(String message) {
        GenerationResponse resp = new GenerationResponse();
        resp.setSuccess(false);
        resp.setMessage(message);
        return resp;
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getMaterialId() {
        return materialId;
    }

    public void setMaterialId(Long materialId) {
        this.materialId = materialId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Object getData() {
        return data;
    }

    public void setData(Object data) {
        this.data = data;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public void addMetadata(String key, Object value) {
        if (this.metadata == null) {
            this.metadata = new HashMap<>();
        }
        this.metadata.put(key, value);
    }
}
