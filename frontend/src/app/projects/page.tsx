'use client';

import CopyButton from '@/components/copyButton';
import { apiService, type ApiDocumentation } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import {
    BarChart3,
    Calendar,
    Code2,
    FileText,
    FolderOpen,
    Plus,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface ProjectStats {
    name: string;
    documentCount: number;
    lastUpdated: string;
    endpoints: string[];
    totalLines: number;
}

export default function ProjectsPage() {
    const [projects, setProjects] = useState<ProjectStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState<ProjectStats | null>(
        null
    );
    const [projectDocs, setProjectDocs] = useState<ApiDocumentation[]>([]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const [projectNames, allDocs] = await Promise.all([
                apiService.getProjects(),
                apiService.getAllDocs(),
            ]);

            const projectStats: ProjectStats[] = projectNames.map((name) => {
                const docs = allDocs.filter((doc) => doc.projectName === name);
                const lastDoc = docs.sort(
                    (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                )[0];

                return {
                    name,
                    documentCount: docs.length,
                    lastUpdated: lastDoc?.updatedAt || '',
                    endpoints: docs.map((doc) => doc.apiEndpoint),
                    totalLines: docs.reduce(
                        (total, doc) =>
                            total + (doc.sourceCode?.split('\n').length || 0),
                        0
                    ),
                };
            });

            setProjects(
                projectStats.sort((a, b) => b.documentCount - a.documentCount)
            );
        } catch (error) {
            console.error('Failed to load projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProjectDocs = async (projectName: string) => {
        try {
            const docs = await apiService.getDocsByProject(projectName);
            setProjectDocs(docs);
        } catch (error) {
            console.error('Failed to load project docs:', error);
        }
    };

    const handleProjectSelect = (project: ProjectStats) => {
        setSelectedProject(project);
        loadProjectDocs(project.name);
    };

    const getTotalStats = () => {
        return {
            totalProjects: projects.length,
            totalDocs: projects.reduce((sum, p) => sum + p.documentCount, 0),
            totalEndpoints: projects.reduce(
                (sum, p) => sum + p.endpoints.length,
                0
            ),
            totalLines: projects.reduce((sum, p) => sum + p.totalLines, 0),
        };
    };

    const stats = getTotalStats();

    if (loading) {
        return (
            <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
                <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600'></div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center py-4'>
                        <div className='flex items-center space-x-2'>
                            <FolderOpen className='h-8 w-8 text-blue-600' />
                            <h1 className='text-2xl font-bold text-gray-900'>
                                Project Overview
                            </h1>
                        </div>
                        <nav className='flex space-x-4'>
                            <Link
                                href='/'
                                className='text-gray-500 hover:text-gray-700'
                            >
                                Generator
                            </Link>
                            <a
                                href='/docs'
                                className='text-gray-500 hover:text-gray-700'
                            >
                                Documentation
                            </a>
                            <button className='text-blue-600 font-medium'>
                                Projects
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Stats Overview */}
                <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center'>
                            <FolderOpen className='h-8 w-8 text-blue-600' />
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Total Projects
                                </p>
                                <p className='text-2xl font-semibold text-gray-900'>
                                    {stats.totalProjects}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center'>
                            <FileText className='h-8 w-8 text-green-600' />
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Documentation Entries
                                </p>
                                <p className='text-2xl font-semibold text-gray-900'>
                                    {stats.totalDocs}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center'>
                            <BarChart3 className='h-8 w-8 text-purple-600' />
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    API Endpoints
                                </p>
                                <p className='text-2xl font-semibold text-gray-900'>
                                    {stats.totalEndpoints}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center'>
                            <Code2 className='h-8 w-8 text-orange-600' />
                            <div className='ml-4'>
                                <p className='text-sm font-medium text-gray-600'>
                                    Lines of Code
                                </p>
                                <p className='text-2xl font-semibold text-gray-900'>
                                    {stats.totalLines.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Projects List */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                            <div className='p-4 border-b bg-gray-50'>
                                <h3 className='font-semibold text-gray-900'>
                                    Projects ({projects.length})
                                </h3>
                            </div>
                            <div className='max-h-96 overflow-y-auto'>
                                {projects.length === 0 ? (
                                    <div className='p-6 text-center text-gray-500'>
                                        <FolderOpen className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                                        <p>No projects found</p>
                                        <Link
                                            href='/'
                                            className='text-blue-600 hover:text-blue-800 text-sm font-medium'
                                        >
                                            Create your first documentation
                                        </Link>
                                    </div>
                                ) : (
                                    projects.map((project) => (
                                        <div
                                            key={project.name}
                                            onClick={() =>
                                                handleProjectSelect(project)
                                            }
                                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedProject?.name ===
                                                project.name
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : ''
                                            }`}
                                        >
                                            <div className='flex justify-between items-start'>
                                                <div className='flex-1'>
                                                    <h4 className='font-medium text-gray-900'>
                                                        {project.name}
                                                    </h4>
                                                    <div className='flex items-center space-x-4 text-sm text-gray-600 mt-1'>
                                                        <span>
                                                            {
                                                                project.documentCount
                                                            }{' '}
                                                            docs
                                                        </span>
                                                        <span>
                                                            {
                                                                project
                                                                    .endpoints
                                                                    .length
                                                            }{' '}
                                                            endpoints
                                                        </span>
                                                    </div>
                                                    {project.lastUpdated && (
                                                        <div className='flex items-center text-xs text-gray-500 mt-2'>
                                                            <Calendar className='h-3 w-3 mr-1' />
                                                            Updated{' '}
                                                            {formatDate(
                                                                project.lastUpdated
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className='lg:col-span-2'>
                        {selectedProject ? (
                            <div className='space-y-6'>
                                {/* Project Header */}
                                <div className='bg-white rounded-lg shadow-lg p-6'>
                                    <div className='flex justify-between items-start'>
                                        <div>
                                            <h3 className='text-2xl font-semibold text-gray-900'>
                                                {selectedProject.name}
                                            </h3>
                                            <div className='grid grid-cols-2 md:grid-cols-3 gap-4 mt-4'>
                                                <div>
                                                    <p className='text-sm text-gray-600'>
                                                        Documentation
                                                    </p>
                                                    <p className='text-lg font-semibold text-gray-900'>
                                                        {
                                                            selectedProject.documentCount
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-sm text-gray-600'>
                                                        Endpoints
                                                    </p>
                                                    <p className='text-lg font-semibold text-gray-900'>
                                                        {
                                                            selectedProject
                                                                .endpoints
                                                                .length
                                                        }
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className='text-sm text-gray-600'>
                                                        Lines of Code
                                                    </p>
                                                    <p className='text-lg font-semibold text-gray-900'>
                                                        {selectedProject.totalLines.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <Link
                                            href='/'
                                            className='inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors'
                                        >
                                            <Plus className='h-4 w-4' />
                                            <span>Add Documentation</span>
                                        </Link>
                                    </div>
                                </div>

                                {/* Project Documentation */}
                                <div className='bg-white rounded-lg shadow-lg'>
                                    <div className='p-6 border-b'>
                                        <h4 className='font-semibold text-gray-900'>
                                            API Documentation
                                        </h4>
                                    </div>
                                    <div className='divide-y'>
                                        {projectDocs.map((doc) => (
                                            <div key={doc.id} className='p-6'>
                                                <div className='flex justify-between items-start mb-4'>
                                                    <div>
                                                        <h5 className='font-medium text-gray-900'>
                                                            {doc.apiEndpoint}
                                                        </h5>
                                                        <p className='text-sm text-gray-600'>
                                                            Generated{' '}
                                                            {formatDate(
                                                                doc.createdAt
                                                            )}
                                                            {doc.updatedAt !==
                                                                doc.createdAt &&
                                                                ` • Updated ${formatDate(
                                                                    doc.updatedAt
                                                                )}`}
                                                        </p>
                                                    </div>
                                                    <CopyButton
                                                        text={
                                                            doc.generatedDocumentation
                                                        }
                                                    />
                                                </div>
                                                <div className='prose prose-sm max-w-none'>
                                                    <div className='bg-gray-50 p-4 rounded-md max-h-64 overflow-y-auto'>
                                                        <pre className='whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed'>
                                                            {
                                                                doc.generatedDocumentation
                                                            }
                                                        </pre>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className='bg-white rounded-lg shadow-lg p-12 text-center text-gray-500'>
                                <FolderOpen className='h-16 w-16 mx-auto mb-4 text-gray-300' />
                                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                                    Select a Project
                                </h3>
                                <p>
                                    Choose a project from the list to view its
                                    documentation and details
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
