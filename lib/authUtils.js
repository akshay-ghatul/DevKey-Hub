import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { supabase } from './supabase'

/**
 * Get user ID from the current session
 * @returns {Promise<string|null>} User ID or null if not authenticated
 */
export async function getUserIdFromSession() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return null
    }

    // Get user from database using email
    const { data: user, error } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (error || !user) {
      console.error('Error getting user from database:', error)
      return null
    }

    return user.id
  } catch (error) {
    console.error('Error in getUserIdFromSession:', error)
    return null
  }
}

/**
 * Verify if a user owns a specific resource
 * @param {string} tableName - Name of the table to check
 * @param {string} resourceId - ID of the resource to verify
 * @param {string} userId - User ID to verify ownership
 * @returns {Promise<boolean>} True if user owns the resource
 */
export async function verifyResourceOwnership(tableName, resourceId, userId) {
  try {
    const { data, error } = await supabase
      .from(tableName)
      .select('id')
      .eq('id', resourceId)
      .eq('user_id', userId)
      .single()

    if (error || !data) {
      return false
    }

    return true
  } catch (error) {
    console.error(`Error verifying ownership for ${tableName}:`, error)
    return false
  }
}

/**
 * Check if user is authenticated and return user ID
 * @returns {Promise<{success: boolean, userId: string|null, error: string|null}>}
 */
export async function authenticateUser() {
  const userId = await getUserIdFromSession()
  
  if (!userId) {
    return {
      success: false,
      userId: null,
      error: 'Unauthorized - User not authenticated'
    }
  }

  return {
    success: true,
    userId,
    error: null
  }
} 