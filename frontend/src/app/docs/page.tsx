'use client';

import CopyButton from '@/components/copyButton';
import { apiService, type ApiDocumentation } from '@/lib/api';
import { formatDate } from '@/lib/utils';
import { Clock, Eye, FileText, Filter, Search, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function DocumentationPage() {
    const [docs, setDocs] = useState<ApiDocumentation[]>([]);
    const [filteredDocs, setFilteredDocs] = useState<ApiDocumentation[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProject, setSelectedProject] = useState<string>('all');
    const [projects, setProjects] = useState<string[]>([]);
    const [selectedDoc, setSelectedDoc] = useState<ApiDocumentation | null>(
        null
    );

    useEffect(() => {
        loadDocumentation();
        loadProjects();
    }, []);

    useEffect(() => {
        filterDocumentation();
    }, [docs, searchTerm, selectedProject]);

    const loadDocumentation = async () => {
        try {
            const documentation = await apiService.getAllDocs();
            setDocs(documentation);
        } catch (error) {
            console.error('Failed to load documentation:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadProjects = async () => {
        try {
            const projectNames = await apiService.getProjects();
            setProjects(projectNames);
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const filterDocumentation = () => {
        let filtered = docs;

        // Filter by search term
        if (searchTerm) {
            filtered = filtered.filter(
                (doc) =>
                    doc.projectName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    doc.apiEndpoint
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    doc.generatedDocumentation
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Filter by project
        if (selectedProject && selectedProject !== 'all') {
            filtered = filtered.filter(
                (doc) => doc.projectName === selectedProject
            );
        }

        setFilteredDocs(filtered);
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this documentation?')) {
            try {
                await apiService.deleteDoc(id);
                await loadDocumentation();
                await loadProjects();
                setSelectedDoc(null);
            } catch (error) {
                console.error('Failed to delete documentation:', error);
            }
        }
    };

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
                            <FileText className='h-8 w-8 text-blue-600' />
                            <h1 className='text-2xl font-bold text-gray-900'>
                                Documentation Library
                            </h1>
                        </div>
                        <nav className='flex space-x-4'>
                            <Link
                                href='/'
                                className='text-gray-500 hover:text-gray-700'
                            >
                                Generator
                            </Link>
                            <button className='text-blue-600 font-medium'>
                                Documentation
                            </button>
                            <a
                                href='/projects'
                                className='text-gray-500 hover:text-gray-700'
                            >
                                Projects
                            </a>
                        </nav>
                    </div>
                </div>
            </header>

            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                {/* Search and Filter Bar */}
                <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
                    <div className='flex flex-col md:flex-row gap-4'>
                        <div className='flex-1 relative'>
                            <Search className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                            <input
                                type='text'
                                placeholder='Search documentation...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900'
                            />
                        </div>
                        <div className='relative'>
                            <Filter className='absolute left-3 top-3 h-4 w-4 text-gray-400' />
                            <select
                                value={selectedProject}
                                onChange={(e) =>
                                    setSelectedProject(e.target.value)
                                }
                                className='pl-10 pr-8 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-white'
                            >
                                <option value='all'>All Projects</option>
                                {projects.map((project) => (
                                    <option key={project} value={project}>
                                        {project}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
                    {/* Documentation List */}
                    <div className='lg:col-span-1'>
                        <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                            <div className='p-4 border-b bg-gray-50'>
                                <h3 className='font-semibold text-gray-900'>
                                    Generated Documentation (
                                    {filteredDocs.length})
                                </h3>
                            </div>
                            <div className='max-h-96 overflow-y-auto'>
                                {filteredDocs.length === 0 ? (
                                    <div className='p-6 text-center text-gray-500'>
                                        <FileText className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                                        <p>No documentation found</p>
                                    </div>
                                ) : (
                                    filteredDocs.map((doc) => (
                                        <div
                                            key={doc.id}
                                            onClick={() => setSelectedDoc(doc)}
                                            className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition-colors ${
                                                selectedDoc?.id === doc.id
                                                    ? 'bg-blue-50 border-blue-200'
                                                    : ''
                                            }`}
                                        >
                                            <div className='flex justify-between items-start'>
                                                <div className='flex-1'>
                                                    <h4 className='font-medium text-gray-900 truncate'>
                                                        {doc.apiEndpoint}
                                                    </h4>
                                                    <p className='text-sm text-gray-600 truncate'>
                                                        {doc.projectName}
                                                    </p>
                                                    <div className='flex items-center text-xs text-gray-500 mt-1'>
                                                        <Clock className='h-3 w-3 mr-1' />
                                                        {formatDate(
                                                            doc.createdAt
                                                        )}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(doc.id);
                                                    }}
                                                    className='text-red-400 hover:text-red-600 transition-colors'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Documentation Viewer */}
                    <div className='lg:col-span-2'>
                        <div className='bg-white rounded-lg shadow-lg'>
                            {selectedDoc ? (
                                <>
                                    <div className='p-6 border-b'>
                                        <div className='flex justify-between items-start'>
                                            <div>
                                                <h3 className='text-xl font-semibold text-gray-900'>
                                                    {selectedDoc.apiEndpoint}
                                                </h3>
                                                <p className='text-gray-600'>
                                                    {selectedDoc.projectName}
                                                </p>
                                                <p className='text-sm text-gray-500 mt-1'>
                                                    Generated{' '}
                                                    {formatDate(
                                                        selectedDoc.createdAt
                                                    )}
                                                </p>
                                            </div>
                                            <CopyButton
                                                text={
                                                    selectedDoc.generatedDocumentation
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className='p-6'>
                                        <div className='prose prose-sm max-w-none'>
                                            <pre className='whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed bg-gray-50 p-4 rounded-md'>
                                                {
                                                    selectedDoc.generatedDocumentation
                                                }
                                            </pre>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='p-12 text-center text-gray-500'>
                                    <Eye className='h-16 w-16 mx-auto mb-4 text-gray-300' />
                                    <h3 className='text-lg font-medium text-gray-900 mb-2'>
                                        Select Documentation to View
                                    </h3>
                                    <p>
                                        Choose a documentation entry from the
                                        list to view its details
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
