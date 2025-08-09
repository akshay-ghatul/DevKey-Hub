'use client'

import { useSession } from 'next-auth/react'

export default function SessionDebug() {
  const { data: session, status } = useSession()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg text-xs max-w-sm z-50 max-h-96 overflow-y-auto">
      <h3 className="font-bold mb-2">Session Debug:</h3>
      <p><strong>Status:</strong> {status}</p>
      <p><strong>Has Session:</strong> {session ? 'Yes' : 'No'}</p>
      {session && (
        <>
          <p><strong>User Name:</strong> {session.user?.name || 'Not available'}</p>
          <p><strong>User Email:</strong> {session.user?.email || 'Not available'}</p>
          <p><strong>User Image:</strong> {session.user?.image ? 'Available' : 'Not available'}</p>
          {session.user?.image && (
            <>
              <p><strong>Image URL:</strong></p>
              <p className="break-all text-green-400">{session.user.image}</p>
              <img 
                src={session.user.image} 
                alt="Debug preview" 
                className="w-8 h-8 rounded-full mt-1"
                onError={() => console.log('Debug image failed to load')}
                onLoad={() => console.log('Debug image loaded successfully')}
              />
            </>
          )}
          <div className="mt-2">
            <p><strong>Full Session:</strong></p>
            <pre className="text-xs bg-gray-800 p-2 rounded mt-1 overflow-x-auto">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}