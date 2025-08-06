'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export default function TestDB() {
  const [status, setStatus] = useState('Testing connection...');
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      setStatus('Testing Supabase connection...');
      
      // Test basic connection
      const { data, error } = await supabase
        .from('api_keys')
        .select('count')
        .limit(1);

      if (error) {
        setStatus(`Connection failed: ${error.message}`);
        return;
      }

      setStatus('Connection successful! Fetching API keys...');

      // Fetch all keys
      const { data: keysData, error: keysError } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (keysError) {
        setStatus(`Failed to fetch keys: ${keysError.message}`);
        return;
      }

      setKeys(keysData);
      setStatus(`Success! Found ${keysData.length} API keys.`);
    } catch (error) {
      setStatus(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Database Connection Test</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <p className="text-gray-700">{status}</p>
          
          <button
            onClick={testConnection}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Test Again
          </button>
        </div>

        {keys.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">API Keys in Database</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Key</th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {keys.map((key) => (
                    <tr key={key.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{key.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{key.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{key.value.substring(0, 20)}...</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(key.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Setup Instructions</h3>
          <ol className="list-decimal list-inside text-blue-800 space-y-1">
            <li>Create a Supabase project at <a href="https://supabase.com" className="underline">supabase.com</a></li>
            <li>Get your project URL and anon key from Settings → API</li>
            <li>Create a <code className="bg-blue-100 px-1 rounded">.env.local</code> file with your credentials</li>
            <li>Run the SQL from <code className="bg-blue-100 px-1 rounded">database-setup.sql</code> in Supabase SQL Editor</li>
            <li>Test the connection on this page</li>
            <li>Go to <a href="/dashboards" className="underline">/dashboards</a> to use the full application</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 