-- Create API Documentation table
CREATE TABLE api_documentation (
    id BIGSERIAL PRIMARY KEY,
    project_name VARCHAR(255) NOT NULL,
    api_endpoint VARCHAR(255) NOT NULL,
    generated_documentation TEXT,
    source_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_api_doc_project ON api_documentation(project_name);
CREATE UNIQUE INDEX idx_api_doc_project_endpoint ON api_documentation(project_name, api_endpoint);

-- Add comments for documentation
COMMENT ON TABLE api_documentation IS 'Stores AI-generated API documentation for different projects';
COMMENT ON COLUMN api_documentation.project_name IS 'Name of the project being documented';
COMMENT ON COLUMN api_documentation.api_endpoint IS 'The API endpoint path being documented';
COMMENT ON COLUMN api_documentation.generated_documentation IS 'AI-generated documentation in markdown format';
COMMENT ON COLUMN api_documentation.source_code IS 'Original source code that was analyzed';