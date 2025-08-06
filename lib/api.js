// API utility functions for CRUD operations

// Get all API keys
export async function getApiKeys() {
  try {
    const response = await fetch('/api/keys')
    if (!response.ok) {
      throw new Error('Failed to fetch API keys')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching API keys:', error)
    throw error
  }
}

// Create a new API key
export async function createApiKey(keyData) {
  try {
    const response = await fetch('/api/keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(keyData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to create API key')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error creating API key:', error)
    throw error
  }
}

// Update an API key
export async function updateApiKey(id, keyData) {
  try {
    const response = await fetch(`/api/keys/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(keyData),
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to update API key')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error updating API key:', error)
    throw error
  }
}

// Delete an API key
export async function deleteApiKey(id) {
  try {
    const response = await fetch(`/api/keys/${id}`, {
      method: 'DELETE',
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to delete API key')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error deleting API key:', error)
    throw error
  }
} 