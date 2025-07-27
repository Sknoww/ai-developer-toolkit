package com.portfolio.toolkit.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.portfolio.toolkit.entity.ApiDocumentation;

@Repository
public interface ApiDocumentationRepository extends JpaRepository<ApiDocumentation, Long> {

    List<ApiDocumentation> findByProjectName(String projectName);

    Optional<ApiDocumentation> findByProjectNameAndApiEndpoint(String projectName, String apiEndpoint);

    @Query("SELECT DISTINCT d.projectName FROM ApiDocumentation d")
    List<String> findAllProjectNames();

    @Query("SELECT COUNT(d) FROM ApiDocumentation d WHERE d.projectName = ?1")
    Long countByProjectName(String projectName);
}