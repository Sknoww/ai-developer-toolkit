package com.portfolio.toolkit.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.portfolio.toolkit.entity.ApiDocumentation;
import com.portfolio.toolkit.service.ApiDocumentationService;

@RestController
@RequestMapping("/api/docs")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001" })
public class ApiDocController {

    @Autowired
    private ApiDocumentationService documentationService;

    @Value("${ai.openai.api-key:NOT_FOUND}")
    private String openaiApiKey;

    @Value("${ai.anthropic.api-key:NOT_FOUND}")
    private String anthropicApiKey;

    @GetMapping("/test")
    public Map<String, String> test() {
        return Map.of(
                "message", "AI Developer Toolkit API is running!",
                "version", "1.0.0",
                "features", "API Documentation Generator");
    }

    @PostMapping("/generate")
    public ResponseEntity<ApiDocumentation> generateDocumentation(@RequestBody GenerateDocRequest request) {
        ApiDocumentation result = documentationService.generateDocumentation(
                request.getProjectName(),
                request.getApiEndpoint(),
                request.getSourceCode());
        return ResponseEntity.ok(result);
    }

    @GetMapping("/all")
    public ResponseEntity<List<ApiDocumentation>> getAllDocumentation() {
        List<ApiDocumentation> docs = documentationService.getAllDocumentation();
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/project/{projectName}")
    public ResponseEntity<List<ApiDocumentation>> getDocumentationByProject(@PathVariable String projectName) {
        List<ApiDocumentation> docs = documentationService.getDocumentationByProject(projectName);
        return ResponseEntity.ok(docs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiDocumentation> getDocumentationById(@PathVariable Long id) {
        ApiDocumentation doc = documentationService.getDocumentationById(id);
        return ResponseEntity.ok(doc);
    }

    @GetMapping("/projects")
    public ResponseEntity<List<String>> getAllProjects() {
        List<String> projects = documentationService.getAllProjectNames();
        return ResponseEntity.ok(projects);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteDocumentation(@PathVariable Long id) {
        documentationService.deleteDocumentation(id);
        return ResponseEntity.ok(Map.of("message", "Documentation deleted successfully"));
    }

    @GetMapping("/debug/config")
    public Map<String, Object> debugConfig() {
        return Map.of(
                "openaiKeyPresent", !openaiApiKey.equals("NOT_FOUND") && !openaiApiKey.equals("your_openai_key_here"),
                "anthropicKeyPresent",
                !anthropicApiKey.equals("NOT_FOUND") && !anthropicApiKey.equals("your_anthropic_key_here"),
                "openaiKeyLength", openaiApiKey.length(),
                "anthropicKeyLength", anthropicApiKey.length(),
                "openaiKeyStart", openaiApiKey.substring(0, Math.min(10, openaiApiKey.length())));
    }

    // DTO class for request body
    public static class GenerateDocRequest {
        private String projectName;
        private String apiEndpoint;
        private String sourceCode;

        // Getters and setters
        public String getProjectName() {
            return projectName;
        }

        public void setProjectName(String projectName) {
            this.projectName = projectName;
        }

        public String getApiEndpoint() {
            return apiEndpoint;
        }

        public void setApiEndpoint(String apiEndpoint) {
            this.apiEndpoint = apiEndpoint;
        }

        public String getSourceCode() {
            return sourceCode;
        }

        public void setSourceCode(String sourceCode) {
            this.sourceCode = sourceCode;
        }
    }
}