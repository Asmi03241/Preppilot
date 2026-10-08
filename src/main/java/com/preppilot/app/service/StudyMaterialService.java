package com.preppilot.app.service;

import com.preppilot.app.model.StudyMaterial;
import com.preppilot.app.repository.StudyMaterialRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudyMaterialService {

    private final StudyMaterialRepository repository;

    public StudyMaterialService(StudyMaterialRepository repository) {
        this.repository = repository;
    }

    public StudyMaterial saveMaterial(StudyMaterial material) {
        return repository.save(material);
    }

    public List<StudyMaterial> getAllMaterials() {
        return repository.findAll();
    }

    public StudyMaterial getMaterialById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public void deleteMaterial(Long id) {
        repository.deleteById(id);
    }
}