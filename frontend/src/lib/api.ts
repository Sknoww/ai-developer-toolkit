import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ApiDocumentation {
    id: number;
    projectName: string;
    apiEndpoint: string;
    generatedDocumentation: string;
    sourceCode: string;
    createdAt: string;
    updatedAt: string;
}

export interface GenerateDocRequest {
    projectName: string;
    apiEndpoint: string;
    sourceCode: string;
}

// API functions
export const apiService = {
    // Test API connection
    test: async () => {
        const response = await api.get('/api/docs/test');
        return response.data;
    },

    // Generate documentation
    generateDoc: async (
        request: GenerateDocRequest
    ): Promise<ApiDocumentation> => {
        const response = await api.post('/api/docs/generate', request);
        return response.data;
    },

    // Get all documentation
    getAllDocs: async (): Promise<ApiDocumentation[]> => {
        const response = await api.get('/api/docs/all');
        return response.data;
    },

    // Get documentation by project
    getDocsByProject: async (
        projectName: string
    ): Promise<ApiDocumentation[]> => {
        const response = await api.get(`/api/docs/project/${projectName}`);
        return response.data;
    },

    // Get documentation by ID
    getDocById: async (id: number): Promise<ApiDocumentation> => {
        const response = await api.get(`/api/docs/${id}`);
        return response.data;
    },

    // Get all project names
    getProjects: async (): Promise<string[]> => {
        const response = await api.get('/api/docs/projects');
        return response.data;
    },

    // Delete documentation
    deleteDoc: async (id: number): Promise<void> => {
        await api.delete(`/api/docs/${id}`);
    },
};
