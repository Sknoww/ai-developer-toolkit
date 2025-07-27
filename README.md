# AI Developer Toolkit

A full-stack application that uses AI to automatically generate comprehensive API documentation from source code analysis.

## 🎯 Project Overview

This application demonstrates modern full-stack development skills with AI integration, built as part of a professional portfolio to showcase expertise in:

- **Backend**: Java 17, Spring Boot 3.4, PostgreSQL, Redis
- **Frontend**: React, Next.js, TypeScript, Tailwind CSS  
- **AI Integration**: OpenAI GPT & Anthropic Claude APIs
- **DevOps**: Docker, Flyway migrations, professional configuration management
- **Architecture**: RESTful APIs, proper error handling, database design

## 🚀 Features

- **AI-Powered Documentation Generation**: Upload source code and get professional API documentation
- **Intelligent Fallback System**: Graceful handling when AI services are unavailable
- **Professional Database Design**: Proper migrations, indexing, and relationships
- **Modern Architecture**: Clean separation of concerns, dependency injection, error handling
- **Environment Management**: Secure configuration with .env support
- **RESTful API Design**: Complete CRUD operations with proper HTTP status codes

## 🛠️ Tech Stack

### Backend
- **Java 17** with **Spring Boot 3.4**
- **PostgreSQL 15** for data persistence
- **Redis** for caching and session management
- **Flyway** for database migrations
- **Maven** for dependency management
- **Docker** for containerization

### Frontend (Coming Soon)
- **React 18** with **Next.js 14**
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Axios** for API communication

### AI Integration
- **OpenAI GPT-3.5/4** for intelligent documentation generation
- **Anthropic Claude** as fallback AI service
- **Custom prompt engineering** for professional output

## 📋 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/docs/test` | Health check and API status |
| POST | `/api/docs/generate` | Generate AI documentation from source code |
| GET | `/api/docs/all` | Retrieve all generated documentation |
| GET | `/api/docs/project/{name}` | Get documentation by project name |
| GET | `/api/docs/{id}` | Get specific documentation by ID |
| DELETE | `/api/docs/{id}` | Delete documentation entry |
| GET | `/api/docs/projects` | List all project names |

## 🏃‍♂️ Getting Started

### Prerequisites
- Java 17+
- Docker Desktop
- Node.js 18+ (for frontend)
- Git

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ai-developer-toolkit