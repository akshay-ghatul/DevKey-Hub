'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '../../components/ui/Button';
import Toast from '../../components/ui/Toast';
import { useToast } from '../../hooks/useToast';

export default function Protected() {
  const [isLoading, setIsLoading] = useState(true);
  const [apiKey, setApiKey] = useState('');
  const [response, setResponse] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const router = useRouter();
  const { toast, showSuccess, showError, hideToast } = useToast();

  useEffect(() => {
    // Check if user has a valid API key
    const storedApiKey = sessionStorage.getItem('validApiKey');
    
    if (!storedApiKey) {
      showError('No valid API key found. Please go back to the playground.');
      setTimeout(() => {
        router.push('/playground');
      }, 2000);
      return;
    }

    setApiKey(storedApiKey);
    setIsLoading(false);
    showSuccess('Welcome to the protected playground!');
  }, [router, showError, showSuccess]);

  const handleLogout = () => {
    sessionStorage.removeItem('validApiKey');
    router.push('/playground');
  };

  const testEndpoint = async (endpoint, method = 'GET', data = null) => {
    setIsTesting(true);
    setResponse('Testing...');

    try {
      const options = {
        method,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      };

      if (data && method === 'POST') {
        options.body = JSON.stringify(data);
      }

      const response = await fetch(`/api/${endpoint}`, options);
      const result = await response.json();

      if (response.ok) {
        setResponse(JSON.stringify(result, null, 2));
        showSuccess(`${method} ${endpoint} successful!`);
      } else {
        setResponse(JSON.stringify(result, null, 2));
        showError(`${method} ${endpoint} failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Error testing endpoint:', error);
      setResponse(JSON.stringify({ error: 'Network error or invalid response' }, null, 2));
      showError('Failed to test endpoint');
    } finally {
      setIsTesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading playground...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={hideToast} />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">DevKey Hub - API Playground</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                API Key: {apiKey.substring(0, 8)}...
              </span>
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* API Testing Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Test API Endpoints
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Use your API key to test various endpoints and see the responses.
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">GET /api/test</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Test a simple GET endpoint
                </p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => testEndpoint('test', 'GET')}
                  disabled={isTesting}
                >
                  {isTesting ? 'Testing...' : 'Test Endpoint'}
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">POST /api/test</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Test a POST endpoint with sample data
                </p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => testEndpoint('test', 'POST', { name: 'Test Item', description: 'This is a test' })}
                  disabled={isTesting}
                >
                  {isTesting ? 'Testing...' : 'Test Endpoint'}
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-2">GET /api/status</h3>
                <p className="text-sm text-gray-600 mb-3">
                  Check API status and limits
                </p>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => testEndpoint('status', 'GET')}
                  disabled={isTesting}
                >
                  {isTesting ? 'Testing...' : 'Test Endpoint'}
                </Button>
              </div>
            </div>
          </div>

          {/* Response Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              API Response
            </h2>
            <div className="bg-gray-50 rounded-lg p-4 h-64 overflow-auto">
              <pre className="text-sm text-gray-700">
                {response || `{
  "message": "Welcome to the API Playground!",
  "status": "success",
  "timestamp": "${new Date().toISOString()}",
  "apiKey": "${apiKey.substring(0, 8)}...",
  "endpoints": [
    "/api/test",
    "/api/status"
  ]
}`}
              </pre>
            </div>
          </div>
        </div>

        {/* Documentation Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            API Documentation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Authentication</h3>
              <p className="text-sm text-gray-600">
                Include your API key in the Authorization header: 
                <code className="bg-gray-100 px-1 rounded text-xs">Authorization: Bearer YOUR_API_KEY</code>
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Rate Limits</h3>
              <p className="text-sm text-gray-600">
                Each API key has a monthly limit. Check your usage in the dashboard.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Error Handling</h3>
              <p className="text-sm text-gray-600">
                All errors return a consistent format with status codes and error messages.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link href="/dashboards">
            <Button variant="outline">
              Go to Dashboard
            </Button>
          </Link>
          <Button variant="primary" onClick={() => window.open('/playground', '_blank')}>
            Open New Playground
          </Button>
        </div>
      </div>
    </div>
  );
} 