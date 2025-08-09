import { supabase } from './supabase.js'

/**
 * Get or create a user in the database
 * @param {Object} userData - User data from OAuth provider
 * @param {string} userData.googleId - Google user ID
 * @param {string} userData.email - User's email
 * @param {string} userData.name - User's name
 * @param {string} userData.imageUrl - User's profile image URL
 * @returns {Promise<Object>} User data with isNewUser flag
 */
export async function getOrCreateUser(userData) {
  try {
    // Validate input parameter
    if (!userData || typeof userData !== 'object') {
      throw new Error('userData parameter is required and must be an object')
    }
    
    const { googleId, email, name, imageUrl } = userData
    
    // Validate required fields
    if (!googleId || !email) {
      throw new Error('googleId and email are required fields')
    }

    console.log('UserService: Getting or creating user:', { googleId, email, name, imageUrl })

    // Call the Supabase function
    const { data, error } = await supabase.rpc('get_or_create_user', {
      p_google_id: googleId,
      p_email: email,
      p_name: name || null,
      p_image_url: imageUrl || null
    })

    if (error) {
      console.error('UserService: Error in get_or_create_user:', error)
      throw error
    }

    if (!data || data.length === 0) {
      throw new Error('No user data returned from database')
    }

    const dbUser = data[0]
    console.log('UserService: User data retrieved:', dbUser)

    return {
      success: true,
      user: dbUser,
      isNewUser: dbUser.is_new_user
    }
  } catch (error) {
    console.error('UserService: Failed to get or create user:', error)
    return {
      success: false,
      error: error.message,
      user: null,
      isNewUser: false
    }
  }
}

/**
 * Update user's last login time
 * @param {string} userId - User's UUID
 * @returns {Promise<Object>} Success status
 */
export async function updateLastLogin(userId) {
  try {
    const { error } = await supabase
      .from('users')
      .update({ 
        last_login: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    if (error) {
      console.error('UserService: Error updating last login:', error)
      throw error
    }

    return { success: true }
  } catch (error) {
    console.error('UserService: Failed to update last login:', error)
    return { success: false, error: error.message }
  }
}

/**
 * Get user by Google ID
 * @param {string} googleId - Google user ID
 * @returns {Promise<Object>} User data
 */
export async function getUserByGoogleId(googleId) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('google_id', googleId)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('UserService: Error getting user by Google ID:', error)
      throw error
    }

    return {
      success: true,
      user: data,
      found: !!data
    }
  } catch (error) {
    console.error('UserService: Failed to get user by Google ID:', error)
    return {
      success: false,
      error: error.message,
      user: null,
      found: false
    }
  }
}

/**
 * Get user by email
 * @param {string} email - User's email
 * @returns {Promise<Object>} User data
 */
export async function getUserByEmail(email) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('UserService: Error getting user by email:', error)
      throw error
    }

    return {
      success: true,
      user: data,
      found: !!data
    }
  } catch (error) {
    console.error('UserService: Failed to get user by email:', error)
    return {
      success: false,
      error: error.message,
      user: null,
      found: false
    }
  }
}

/**
 * Update user profile information
 * @param {string} userId - User's UUID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated user data
 */
export async function updateUserProfile(userId, updates) {
  try {
    const allowedUpdates = ['name', 'image_url']
    const sanitizedUpdates = {}
    
    // Only allow specific fields to be updated
    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key) && value !== undefined && value !== null) {
        sanitizedUpdates[key] = value
      }
    }

    if (Object.keys(sanitizedUpdates).length === 0) {
      return { success: true, user: null, message: 'No updates to apply' }
    }

    // Add updated_at timestamp
    sanitizedUpdates.updated_at = new Date().toISOString()

    const { data, error } = await supabase
      .from('users')
      .update(sanitizedUpdates)
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      console.error('UserService: Error updating user profile:', error)
      throw error
    }

    return {
      success: true,
      user: data
    }
  } catch (error) {
    console.error('UserService: Failed to update user profile:', error)
    return {
      success: false,
      error: error.message,
      user: null
    }
  }
}

/**
 * Get user statistics
 * @param {string} userId - User's UUID
 * @returns {Promise<Object>} User statistics
 */
export async function getUserStats(userId) {
  try {
    // Get API key count
    const { data: apiKeys, error: apiKeysError } = await supabase
      .from('api_keys')
      .select('id, usage, monthly_limit')
      .eq('user_id', userId)

    if (apiKeysError) {
      console.error('UserService: Error getting user API keys:', apiKeysError)
      throw apiKeysError
    }

    const totalApiKeys = apiKeys?.length || 0
    const totalUsage = apiKeys?.reduce((sum, key) => sum + (key.usage || 0), 0) || 0
    const totalLimit = apiKeys?.reduce((sum, key) => sum + (key.monthly_limit || 0), 0) || 0

    return {
      success: true,
      stats: {
        totalApiKeys,
        totalUsage,
        totalLimit,
        usagePercentage: totalLimit > 0 ? Math.round((totalUsage / totalLimit) * 100) : 0
      }
    }
  } catch (error) {
    console.error('UserService: Failed to get user stats:', error)
    return {
      success: false,
      error: error.message,
      stats: null
    }
  }
}