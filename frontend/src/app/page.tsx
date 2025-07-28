'use client';

import CopyButton from '@/components/copyButton';
import {
    apiService,
    type ApiDocumentation,
    type GenerateDocRequest,
} from '@/lib/api';
import { BookOpen, Code2, FileText, Upload, Zap } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
    const [formData, setFormData] = useState<GenerateDocRequest>({
        projectName: '',
        apiEndpoint: '',
        sourceCode: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<ApiDocumentation | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const documentation = await apiService.generateDoc(formData);
            setResult(documentation);
        } catch (err) {
            setError('Failed to generate documentation. Please try again.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (
        field: keyof GenerateDocRequest,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100'>
            {/* Header */}
            <header className='bg-white shadow-sm border-b'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex justify-between items-center py-4'>
                        <div className='flex items-center space-x-2'>
                            <Zap className='h-8 w-8 text-blue-600' />
                            <h1 className='text-2xl font-bold text-gray-900'>
                                AI Developer Toolkit
                            </h1>
                        </div>
                        <nav className='flex space-x-4'>
                            <Link
                                href='/'
                                className='text-blue-600 font-medium'
                            >
                                Generator
                            </Link>
                            <Link
                                href='/docs'
                                className='text-gray-500 hover:text-gray-700'
                            >
                                Documentation
                            </Link>
                            <Link
                                href='/projects'
                                className='text-gray-500 hover:text-gray-700'
                            >
                                Projects
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='text-center mb-12'>
                    <h2 className='text-4xl font-bold text-gray-900 mb-4'>
                        AI-Powered API Documentation Generator
                    </h2>
                    <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
                        Transform your source code into professional,
                        comprehensive API documentation using advanced AI
                        technology. Perfect for teams who want to maintain
                        up-to-date documentation effortlessly.
                    </p>
                </div>

                <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
                    {/* Input Form */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center space-x-2 mb-6'>
                            <Code2 className='h-6 w-6 text-blue-600' />
                            <h3 className='text-xl font-semibold text-gray-900'>
                                Generate Documentation
                            </h3>
                        </div>

                        <form onSubmit={handleSubmit} className='space-y-6'>
                            <div>
                                <label
                                    htmlFor='projectName'
                                    className='block text-sm font-medium text-gray-700 mb-2'
                                >
                                    Project Name
                                </label>
                                <input
                                    id='projectName'
                                    type='text'
                                    value={formData.projectName}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'projectName',
                                            e.target.value
                                        )
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400'
                                    placeholder='my-awesome-api'
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='apiEndpoint'
                                    className='block text-sm font-medium text-gray-700 mb-2'
                                >
                                    API Endpoint
                                </label>
                                <input
                                    id='apiEndpoint'
                                    type='text'
                                    value={formData.apiEndpoint}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'apiEndpoint',
                                            e.target.value
                                        )
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 bg-white placeholder-gray-400'
                                    placeholder='/api/users'
                                    required
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='sourceCode'
                                    className='block text-sm font-medium text-gray-700 mb-2'
                                >
                                    Source Code
                                </label>
                                <textarea
                                    id='sourceCode'
                                    value={formData.sourceCode}
                                    onChange={(e) =>
                                        handleInputChange(
                                            'sourceCode',
                                            e.target.value
                                        )
                                    }
                                    rows={12}
                                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm text-gray-900 bg-white placeholder-gray-400'
                                    placeholder={`@GetMapping("/users")
public ResponseEntity<List<User>> getAllUsers() {
    List<User> users = userService.findAll();
    return ResponseEntity.ok(users);
}

@PostMapping("/users")
public ResponseEntity<User> createUser(@RequestBody User user) {
    User savedUser = userService.save(user);
    return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
}`}
                                    required
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={isLoading}
                                className='w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2'
                            >
                                {isLoading ? (
                                    <>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-2 border-white'></div>
                                        <span>Generating Documentation...</span>
                                    </>
                                ) : (
                                    <>
                                        <FileText className='h-5 w-5' />
                                        <span>Generate Documentation</span>
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Output */}
                    <div className='bg-white rounded-lg shadow-lg p-6'>
                        <div className='flex items-center space-x-2 mb-6'>
                            <BookOpen className='h-6 w-6 text-green-600' />
                            <h3 className='text-xl font-semibold text-gray-900'>
                                Generated Documentation
                            </h3>
                        </div>

                        {error && (
                            <div className='bg-red-50 border border-red-200 rounded-md p-4 mb-4'>
                                <div className='text-red-800'>{error}</div>
                            </div>
                        )}

                        {result ? (
                            <div className='space-y-4'>
                                <div className='prose prose-sm max-w-none'>
                                    <div className='bg-gray-50 border border-gray-200 rounded-md p-4 overflow-auto max-h-96'>
                                        <pre className='whitespace-pre-wrap text-sm text-gray-900 font-mono leading-relaxed'>
                                            {result.generatedDocumentation}
                                        </pre>
                                    </div>
                                </div>
                                <div className='flex justify-between items-center text-xs text-gray-500'>
                                    <span>
                                        Generated on{' '}
                                        {new Date(
                                            result.createdAt
                                        ).toLocaleString()}
                                    </span>
                                    <CopyButton
                                        text={result.generatedDocumentation}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className='text-center py-12 text-gray-500'>
                                <Upload className='h-12 w-12 mx-auto mb-4 text-gray-300' />
                                <p>
                                    Enter your source code and generate
                                    AI-powered documentation
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-8'>
                    <div className='text-center'>
                        <div className='bg-blue-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
                            <Zap className='h-6 w-6 text-blue-600' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            AI-Powered Analysis
                        </h3>
                        <p className='text-gray-600'>
                            Advanced AI analyzes your source code to generate
                            comprehensive, professional documentation
                            automatically.
                        </p>
                    </div>

                    <div className='text-center'>
                        <div className='bg-green-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
                            <Code2 className='h-6 w-6 text-green-600' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Multiple Languages
                        </h3>
                        <p className='text-gray-600'>
                            Supports Java, Python, JavaScript, and more. Works
                            with any REST API framework or library.
                        </p>
                    </div>

                    <div className='text-center'>
                        <div className='bg-purple-100 rounded-full p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center'>
                            <BookOpen className='h-6 w-6 text-purple-600' />
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>
                            Professional Output
                        </h3>
                        <p className='text-gray-600'>
                            Generates detailed documentation with examples,
                            error codes, and usage instructions ready for
                            production.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
}
