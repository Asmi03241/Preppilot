package com.preppilot.app.repository;

import com.preppilot.app.model.StudyMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyMaterialRepository extends JpaRepository<StudyMaterial, Long> {
}