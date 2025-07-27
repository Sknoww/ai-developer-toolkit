package com.portfolio.toolkit.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.portfolio.toolkit.entity.ApiDocumentation;
import com.portfolio.toolkit.exception.ResourceNotFoundException;
import com.portfolio.toolkit.repository.ApiDocumentationRepository;

@Service
public class ApiDocumentationService {

    @Autowired
    private ApiDocumentationRepository repository;

    @Autowired
    private AiDocumentationService aiService;

    public ApiDocumentation generateDocumentation(String projectName, String apiEndpoint, String sourceCode) {
        // Check if documentation already exists
        Optional<ApiDocumentation> existing = repository.findByProjectNameAndApiEndpoint(projectName, apiEndpoint);

        ApiDocumentation documentation;
        if (existing.isPresent()) {
            documentation = existing.get();
            documentation.setSourceCode(sourceCode);
        } else {
            documentation = new ApiDocumentation(projectName, apiEndpoint, sourceCode);
        }

        // Generate AI documentation
        String aiGeneratedDocs = aiService.generateApiDocumentation(sourceCode, apiEndpoint);
        documentation.setGeneratedDocumentation(aiGeneratedDocs);

        return repository.save(documentation);
    }

    public List<ApiDocumentation> getAllDocumentation() {
        return repository.findAll();
    }

    public List<ApiDocumentation> getDocumentationByProject(String projectName) {
        return repository.findByProjectName(projectName);
    }

    public ApiDocumentation getDocumentationById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Documentation not found with id: " + id));
    }

    public List<String> getAllProjectNames() {
        return repository.findAllProjectNames();
    }

    public void deleteDocumentation(Long id) {
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Documentation not found with id: " + id);
        }
        repository.deleteById(id);
    }
}