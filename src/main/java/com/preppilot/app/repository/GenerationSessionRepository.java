package com.preppilot.app.repository;

import com.preppilot.app.model.GenerationSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GenerationSessionRepository extends JpaRepository<GenerationSession, Long> {

    List<GenerationSession> findAllByOrderByCreatedAtDesc();
}
