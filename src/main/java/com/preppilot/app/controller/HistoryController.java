package com.preppilot.app.controller;

import com.preppilot.app.model.GenerationSession;
import com.preppilot.app.service.GenerationSessionService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/history")
@CrossOrigin(origins = "*")
public class HistoryController {

    private final GenerationSessionService sessionService;

    public HistoryController(GenerationSessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping
    public ResponseEntity<List<GenerationSession>> getRecentSessions() {
        List<GenerationSession> sessions = sessionService.getRecentSessions();
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getSessionById(@PathVariable Long id) {
        GenerationSession session = sessionService.getSessionById(id);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Generation session not found with ID: " + id));
        }
        return ResponseEntity.ok(session);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSession(@PathVariable Long id) {
        GenerationSession session = sessionService.getSessionById(id);
        if (session == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Generation session not found with ID: " + id));
        }
        sessionService.deleteSession(id);
        return ResponseEntity.ok(Map.of("success", true, "message", "Session deleted successfully"));
    }
}
