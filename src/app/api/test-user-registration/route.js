import { NextResponse } from 'next/server'
import { getOrCreateUser } from '../../../../lib/userService.js'

export async function GET() {
  try {
    // Test data
    const testUserData = {
      googleId: 'test_google_id_123',
      email: 'test@example.com',
      name: 'Test User',
      imageUrl: 'https://example.com/test-image.jpg'
    }

    console.log('Testing user registration with:', testUserData)

    const result = await getOrCreateUser(testUserData)

    return NextResponse.json({
      success: true,
      testResult: result,
      message: 'User registration test completed'
    })
  } catch (error) {
    console.error('User registration test failed:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 })
  }
} 