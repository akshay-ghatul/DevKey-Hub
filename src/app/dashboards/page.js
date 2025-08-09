'use client';

import { useState } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import ApiKeyTable from '../../components/dashboard/ApiKeyTable';
import CreateApiKeyModal from '../../components/dashboard/CreateApiKeyModal';
import EditApiKeyModal from '../../components/dashboard/EditApiKeyModal';
import DeleteConfirmModal from '../../components/dashboard/DeleteConfirmModal';
import Toast from '../../components/ui/Toast';
import Button from '../../components/ui/Button';
import AuthGuard from '../../components/auth/AuthGuard';
import SessionDebug from '../../components/auth/SessionDebug';
import { useApiKeys } from '../../hooks/useApiKeys';
import { useToast } from '../../hooks/useToast';
import { copyToClipboard } from '../../utils/clipboard';

export default function Dashboard() {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, keyId: null, keyName: '' });
  const [visibleKeys, setVisibleKeys] = useState(new Set());

  // Custom hooks
  const { apiKeys, loading, createKey, updateKey, deleteKey } = useApiKeys();
  const { toast, showSuccess, showError, showDelete, hideToast } = useToast();

  // Event handlers
  const handleCreate = async (keyData) => {
    const result = await createKey(keyData);
    if (result.success) {
      showSuccess('API key created successfully');
      setIsCreateModalOpen(false);
    } else {
      showError(result.error);
    }
  };

  const handleEdit = async (keyData) => {
    const result = await updateKey(editingKey.id, keyData);
    if (result.success) {
      showSuccess('API key updated successfully');
      setIsEditModalOpen(false);
      setEditingKey(null);
    } else {
      showError(result.error);
    }
  };

  const handleDelete = async (id) => {
    const result = await deleteKey(id);
    if (result.success) {
      showDelete('API key deleted successfully');
      setDeleteConfirm({ show: false, keyId: null, keyName: '' });
    } else {
      showError(result.error);
    }
  };

  const handleCopy = async (text) => {
    const result = await copyToClipboard(text);
    if (result.success) {
      showSuccess('API key copied to clipboard');
    } else {
      showError(result.error);
    }
  };

  const openEditModal = (key) => {
    setEditingKey(key);
    setIsEditModalOpen(true);
  };

  const confirmDelete = (id, name) => {
    setDeleteConfirm({ show: true, keyId: id, keyName: name });
  };

  const toggleKeyVisibility = (keyId) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading API keys...</p>
        </div>
      </div>
    );
  }

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
                    Pages / Overview
                  </nav>
                  <h1 className="text-2xl font-bold text-gray-900">DevKey Hub - Overview</h1>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Operational</span>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-gray-400 hover:text-gray-600" aria-label="GitHub">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" aria-label="Twitter">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" aria-label="Email">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button className="text-gray-400 hover:text-gray-600" aria-label="Dark mode">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Current Plan Card */}
          <div className="mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm opacity-90 mb-1">CURRENT PLAN</p>
                  <h2 className="text-2xl font-bold mb-4">Researcher</h2>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-sm">API Limit</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex items-center">
                      <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2 mr-3">
                        <div className="bg-white h-2 rounded-full" style={{ width: '2.4%' }}></div>
                      </div>
                      <span className="text-sm">24/1,000 Requests</span>
                    </div>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="bg-white text-purple-600 hover:bg-gray-50 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                  Manage Plan
                </Button>
              </div>
            </div>
          </div>

          {/* API Keys Card */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
                <Button
                  variant="primary"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Key
                </Button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                The key is used to authenticate your requests to the Research API. To learn more, see the{' '}
                <a href="#" className="text-indigo-600 hover:text-indigo-800">documentation page</a>.
              </p>
            </div>

            {/* API Keys Table */}
            <ApiKeyTable
              apiKeys={apiKeys}
              onEdit={openEditModal}
              onDelete={confirmDelete}
              onCopy={handleCopy}
              visibleKeys={visibleKeys}
              onToggleVisibility={toggleKeyVisibility}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateApiKeyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreate}
      />

      <EditApiKeyModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingKey(null);
        }}
        onSubmit={handleEdit}
        apiKey={editingKey}
      />

      <DeleteConfirmModal
        isOpen={deleteConfirm.show}
        onClose={() => setDeleteConfirm({ show: false, keyId: null, keyName: '' })}
        onConfirm={() => handleDelete(deleteConfirm.keyId)}
        keyName={deleteConfirm.keyName}
      />
      </div>
      <SessionDebug />
    </AuthGuard>
  );
} 