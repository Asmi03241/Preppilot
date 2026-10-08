package com.preppilot.app.service;

import com.preppilot.app.model.GenerationSession;
import com.preppilot.app.repository.GenerationSessionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GenerationSessionService {

    private final GenerationSessionRepository repository;

    public GenerationSessionService(GenerationSessionRepository repository) {
        this.repository = repository;
    }

    public GenerationSession saveSession(GenerationSession session) {
        return repository.save(session);
    }

    public List<GenerationSession> getRecentSessions() {
        return repository.findAllByOrderByCreatedAtDesc();
    }

    public GenerationSession getSessionById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteSession(Long id) {
        repository.deleteById(id);
    }
}
