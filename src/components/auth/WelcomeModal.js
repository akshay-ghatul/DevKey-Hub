'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function WelcomeModal() {
  const { data: session } = useSession()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    // Show welcome modal for new users
    if (session?.user?.isNewUser) {
      setShowWelcome(true)
      
      // Remove the isNewUser flag after showing welcome
      // This prevents the modal from showing again on page refresh
      setTimeout(() => {
        if (session.user) {
          session.user.isNewUser = false
        }
      }, 1000)
    }
  }, [session])

  if (!showWelcome || !session?.user) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md mx-4 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome to DevKey Hub! 🎉
          </h2>
          <p className="text-gray-600">
            Hi {session.user.name?.split(' ')[0] || 'there'}! Your account has been created successfully.
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-left">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Account created and synced with Google</span>
          </div>
          
          <div className="flex items-center text-left">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Ready to create and manage API keys</span>
          </div>
          
          <div className="flex items-center text-left">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <span className="text-sm text-gray-700">Access to API playground and testing tools</span>
          </div>
        </div>

        <button
          onClick={() => setShowWelcome(false)}
          className="w-full bg-gradient-to-r from-purple-500 to-purple-700 text-white py-3 px-6 rounded-lg font-medium hover:from-purple-600 hover:to-purple-800 transition-all duration-200"
        >
          Get Started
        </button>
      </div>
    </div>
  )
}