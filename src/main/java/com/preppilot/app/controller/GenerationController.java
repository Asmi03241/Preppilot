package com.preppilot.app.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.preppilot.app.dto.GenerationRequest;
import com.preppilot.app.dto.GenerationResponse;
import com.preppilot.app.model.GenerationSession;
import com.preppilot.app.model.StudyMaterial;
import com.preppilot.app.service.AIContentService;
import com.preppilot.app.service.DocumentExtractionService;
import com.preppilot.app.service.GenerationSessionService;
import com.preppilot.app.service.StudyMaterialService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class GenerationController {

    private static final Logger log = LoggerFactory.getLogger(GenerationController.class);

    private final DocumentExtractionService extractionService;
    private final StudyMaterialService materialService;
    private final AIContentService aiService;
    private final GenerationSessionService sessionService;
    private final ObjectMapper objectMapper;

    public GenerationController(DocumentExtractionService extractionService,
                                StudyMaterialService materialService,
                                AIContentService aiService,
                                GenerationSessionService sessionService,
                                ObjectMapper objectMapper) {
        this.extractionService = extractionService;
        this.materialService = materialService;
        this.aiService = aiService;
        this.sessionService = sessionService;
        this.objectMapper = objectMapper;
    }

    @PostMapping({"/generate", "/study-material/generate"})
    public ResponseEntity<GenerationResponse> generate(
            @RequestParam(value = "file", required = false) MultipartFile file,
            @RequestParam(value = "type", defaultValue = "mcq") String type,
            @RequestParam(value = "config", required = false) String configJson,
            @RequestParam(value = "materialId", required = false) Long materialId
    ) {
        try {
            String extractedText;
            String fileName = "document.txt";
            Long currentMaterialId = materialId;

            if (file != null && !file.isEmpty()) {
                fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.txt";
                log.info("Processing uploaded document: {}, size: {} bytes, type: {}", fileName, file.getSize(), type);
                extractedText = extractionService.extractText(file);

                if (extractedText == null || extractedText.trim().isEmpty()) {
                    return ResponseEntity.badRequest().body(
                            GenerationResponse.error("Uploaded document does not contain readable text.")
                    );
                }

                // Save or update document in PostgreSQL
                String title = fileName != null && fileName.contains(".") ? fileName.substring(0, fileName.lastIndexOf('.')) : (fileName != null ? fileName : "document");
                StudyMaterial saved = materialService.saveMaterial(new StudyMaterial(title, extractedText, fileName));
                currentMaterialId = saved.getId();
                log.info("Saved StudyMaterial entity to database with ID: {}", currentMaterialId);

            } else if (materialId != null) {
                StudyMaterial existing = materialService.getMaterialById(materialId);
                if (existing == null) {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                            GenerationResponse.error("Study material with ID " + materialId + " not found.")
                    );
                }
                extractedText = existing.getContent();
                if (existing.getFileName() != null) {
                    fileName = existing.getFileName();
                }
            } else {
                return ResponseEntity.badRequest().body(
                        GenerationResponse.error("Please provide a file to upload or an existing materialId.")
                );
            }

            // Parse generation configuration
            GenerationRequest req = new GenerationRequest();
            if (configJson != null && !configJson.trim().isEmpty()) {
                try {
                    req = objectMapper.readValue(configJson, GenerationRequest.class);
                } catch (Exception e) {
                    log.warn("Failed to parse config JSON: {}, using defaults", e.getMessage());
                }
            }
            req.setType(type);

            // Generate content
            Object payload;
            String normalizedType = type.toLowerCase().trim();
            switch (normalizedType) {
                case "flashcards":
                case "flashcard":
                    payload = aiService.generateFlashcards(extractedText, req);
                    break;
                case "mindmap":
                case "mind-map":
                    payload = aiService.generateMindMap(extractedText, req);
                    break;
                case "theory":
                case "questions":
                    payload = aiService.generateTheoryQuestions(extractedText, req);
                    break;
                case "studyplan":
                case "study-plan":
                case "plan":
                    payload = aiService.generateStudyPlan(extractedText, req);
                    break;
                case "mcq":
                default:
                    payload = aiService.generateMCQs(extractedText, req);
                    normalizedType = "mcq";
                    break;
            }

            // Save generation session to PostgreSQL
            Long savedSessionId = null;
            try {
                if (payload != null) {
                    String materialName = fileName;
                    if (materialName != null && materialName.contains(".")) {
                        materialName = materialName.substring(0, materialName.lastIndexOf('.'));
                    }
                    String materialType = "DOCUMENT";
                    if (fileName != null && fileName.contains(".")) {
                        materialType = fileName.substring(fileName.lastIndexOf('.') + 1).toUpperCase();
                    }

                    String configStr = (configJson != null && !configJson.trim().isEmpty())
                            ? configJson
                            : objectMapper.writeValueAsString(req);
                    String contentStr = objectMapper.writeValueAsString(payload);

                    if (contentStr != null && !contentStr.trim().isEmpty()) {
                        GenerationSession session = new GenerationSession(
                                materialName,
                                materialType,
                                normalizedType,
                                configStr,
                                contentStr
                        );
                        GenerationSession savedSession = sessionService.saveSession(session);
                        savedSessionId = savedSession.getId();
                        log.info("Saved generation session with ID: {}", savedSessionId);
                    }
                }
            } catch (Exception ex) {
                log.error("Failed to save generation session: {}", ex.getMessage(), ex);
            }

            GenerationResponse resp = GenerationResponse.success(
                    normalizedType,
                    currentMaterialId,
                    fileName,
                    payload,
                    "Study material successfully generated."
            );
            resp.addMetadata("extractedLength", extractedText.length());
            if (savedSessionId != null) {
                resp.addMetadata("sessionId", savedSessionId);
            }

            return ResponseEntity.ok(resp);

        } catch (IllegalArgumentException e) {
            log.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest().body(GenerationResponse.error(e.getMessage()));
        } catch (Exception e) {
            log.error("Generation failed: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(GenerationResponse.error("Failed to process document: " + e.getMessage()));
        }
    }

    @GetMapping("/study-materials")
    public ResponseEntity<List<StudyMaterial>> listMaterials() {
        return ResponseEntity.ok(materialService.getAllMaterials());
    }

    @GetMapping("/study-material/{id}")
    public ResponseEntity<?> getMaterial(@PathVariable Long id) {
        StudyMaterial m = materialService.getMaterialById(id);
        if (m == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(GenerationResponse.error("Material not found"));
        }
        return ResponseEntity.ok(m);
    }
}
