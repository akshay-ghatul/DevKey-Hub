import { useState, useEffect } from 'react';
import { getApiKeys, createApiKey, updateApiKey, deleteApiKey } from '../../lib/api';

export function useApiKeys() {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load API keys from database
  useEffect(() => {
    loadApiKeys();
  }, []);

  const loadApiKeys = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getApiKeys();
      setApiKeys(data);
    } catch (error) {
      console.error('Failed to load API keys:', error);
      setError('Failed to load API keys');
    } finally {
      setLoading(false);
    }
  };

  const createKey = async (keyData) => {
    try {
      const newKey = await createApiKey(keyData);
      setApiKeys([newKey, ...apiKeys]);
      return { success: true, data: newKey };
    } catch (error) {
      console.error('Failed to create API key:', error);
      return { success: false, error: 'Failed to create API key' };
    }
  };

  const updateKey = async (id, keyData) => {
    try {
      const updatedKey = await updateApiKey(id, keyData);
      const updatedKeys = apiKeys.map(key => 
        key.id === id ? updatedKey : key
      );
      setApiKeys(updatedKeys);
      return { success: true, data: updatedKey };
    } catch (error) {
      console.error('Failed to update API key:', error);
      return { success: false, error: 'Failed to update API key' };
    }
  };

  const deleteKey = async (id) => {
    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key.id !== id));
      return { success: true };
    } catch (error) {
      console.error('Failed to delete API key:', error);
      return { success: false, error: 'Failed to delete API key' };
    }
  };

  return {
    apiKeys,
    loading,
    error,
    createKey,
    updateKey,
    deleteKey,
    refresh: loadApiKeys
  };
} 