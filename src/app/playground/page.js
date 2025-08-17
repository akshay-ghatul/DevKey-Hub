'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import AuthGuard from '../../components/auth/AuthGuard';
import Sidebar from '../../components/dashboard/Sidebar';
import { useToast } from '../../hooks/useToast';

export default function Playground() {
  const [apiKey, setApiKey] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!apiKey.trim()) {
      showError('Please enter an API key');
      return;
    }

    if (!githubUrl.trim()) {
      showError('Please enter a GitHub repository URL');
      return;
    }

    // Validate GitHub URL format
    if (!githubUrl.trim().match(/^https:\/\/github\.com\/[^\/]+\/[^\/]+/)) {
      showError('Please enter a valid GitHub repository URL (e.g., https://github.com/user/repo)');
      return;
    }

    setIsSubmitting(true);
    setIsLoading(true);

    try {
      // Call the GitHub summarizer API
      const response = await fetch('/api/github-summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey.trim(),
        },
        body: JSON.stringify({ githubUrl: githubUrl.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        showSuccess('Repository analyzed successfully!');
        setResults(data);
        // Store the API key in sessionStorage for future use
        sessionStorage.setItem('validApiKey', apiKey.trim());
      } else {
        // Show the specific error message from the API
        const errorMessage = data.error || 'Failed to analyze repository';
        showError(errorMessage);
        setResults(null);
      }
    } catch (error) {
      console.error('Error calling GitHub summarizer API:', error);
      showError('Failed to call API. Please try again.');
      setResults(null);
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setResults(null);
    setGithubUrl('');
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 relative">
        {/* Toast Notification */}
        <Toast toast={toast} onClose={hideToast} />

        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Main Content */}
        <div className={`transition-all duration-300 ease-in-out ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <div className="px-8 py-6">
            {/* Header */}
            <div className="mb-8">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <button
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className="mr-4 p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    aria-label="Toggle sidebar"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                  <div>
                    <nav className="text-sm text-gray-500 mb-2">
                      Pages / API Playground
                    </nav>
                    <h1 className="text-2xl font-bold text-gray-900">GitHub Repository Analyzer</h1>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Operational</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Form */}
            <div className="bg-white shadow rounded-lg p-6 mb-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                      API Key
                    </label>
                    <input
                      id="apiKey"
                      name="apiKey"
                      type="password"
                      autoComplete="off"
                      required
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Enter your API key"
                    />
                  </div>

                  <div>
                    <label htmlFor="githubUrl" className="block text-sm font-medium text-gray-700 mb-2">
                      GitHub Repository URL
                    </label>
                    <input
                      id="githubUrl"
                      name="githubUrl"
                      type="url"
                      autoComplete="off"
                      required
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                      placeholder="https://github.com/user/repo"
                    />
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                    className="px-8 py-3"
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Analyzing Repository...
                      </div>
                    ) : (
                      'Analyze Repository'
                    )}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/dashboards"
                  className="text-sm font-medium text-purple-600 hover:text-purple-500"
                >
                  Need an API key? Go to Dashboard to create one
                </Link>
              </div>
            </div>

            {/* Results Display */}
            {results && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                  <Button
                    onClick={clearResults}
                    variant="secondary"
                    className="text-sm"
                  >
                    Clear Results
                  </Button>
                </div>

                <div className="space-y-6">
                  {/* Repository Summary */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Summary</h4>
                    <p className="text-gray-900 bg-gray-50 p-4 rounded-md">{results.summary}</p>
                  </div>

                  {/* Cool Facts */}
                  <div>
                    <h4 className="text-md font-medium text-gray-700 mb-2">Interesting Facts</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {results.cool_facts.map((fact, index) => (
                        <li key={index} className="text-gray-900 bg-gray-50 p-3 rounded-md">{fact}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Repository Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="text-sm font-medium text-blue-600">Stars</div>
                      <div className="text-2xl font-bold text-blue-900">{results.stars.toLocaleString()}</div>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-md">
                      <div className="text-sm font-medium text-green-600">Latest Version</div>
                      <div className="text-2xl font-bold text-green-900">{results.latest_version}</div>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-md">
                      <div className="text-sm font-medium text-purple-600">License</div>
                      <div className="text-2xl font-bold text-purple-900">{results.license}</div>
                    </div>
                  </div>

                  {/* Website URL if available */}
                  {results.website && (
                    <div>
                      <h4 className="text-md font-medium text-gray-700 mb-2">Website</h4>
                      <a 
                        href={results.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-purple-600 hover:text-purple-500 underline break-all"
                      >
                        {results.website}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    How it works
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>
                      Enter your API key and a GitHub repository URL. The system will analyze the repository's README content and provide a comprehensive summary including interesting facts, star count, latest version, license, and website information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
} 