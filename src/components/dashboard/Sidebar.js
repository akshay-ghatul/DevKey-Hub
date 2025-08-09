'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';

const navigationItems = [
  {
    href: '/',
    label: 'Overview',
    icon: (
      <svg className="w-4 h-4 mr-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    active: true
  },
  {
    href: '#',
    label: 'Research Assistant',
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    )
  },
  {
    href: '#',
    label: 'Research Reports',
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z" />
      </svg>
    )
  },
  {
    href: '/playground',
    label: 'API Playground',
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    )
  },
  {
    href: '#',
    label: 'Invoices',
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
  {
    href: '#',
    label: 'Documentation',
    icon: (
      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    external: true
  }
];

export default function Sidebar({ isOpen }) {
  const { data: session } = useSession();
  
  // Debug logging to see what we're getting from the session
  console.log('Session data:', session);
  console.log('User image:', session?.user?.image);
  return (
    <div className={`fixed inset-y-0 left-0 bg-white border-r border-gray-200 transition-transform duration-300 ease-in-out ${
      isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full'
    }`}>
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center px-6 py-6 border-b border-gray-200">
          <span className="text-xl font-bold text-gray-900">DevKey Hub</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  item.active 
                    ? 'text-purple-600 bg-purple-50' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {item.icon}
                {item.label}
                {item.external && (
                  <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                )}
              </Link>
            ))}
          </div>
        </nav>

        {/* User Profile */}
        <div className="px-4 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center">
            {session?.user?.image ? (
              <div className="relative">
                <img 
                  src={session.user.image} 
                  alt={`${session.user.name || 'User'}'s profile`}
                  className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
                  onError={(e) => {
                    console.log('Image failed to load:', session.user.image);
                    e.target.style.display = 'none';
                    e.target.parentNode.nextSibling.style.display = 'flex';
                  }}
                  onLoad={() => {
                    console.log('Image loaded successfully:', session.user.image);
                  }}
                />
              </div>
            ) : (
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <span className="text-sm font-semibold text-white">
                  {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
            )}
            
            {/* Fallback for broken images */}
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-full items-center justify-center border-2 border-white shadow-sm" style={{ display: 'none' }}>
              <span className="text-sm font-semibold text-white">
                {session?.user?.name?.charAt(0)?.toUpperCase() || session?.user?.email?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            </div>
            
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name || session?.user?.email || 'User'}
              </p>
              {session?.user?.email && session?.user?.name && (
                <p className="text-xs text-gray-600 truncate">{session.user.email}</p>
              )}
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-500 ml-1">Online</span>
              </div>
            </div>
            
            <button 
              onClick={() => signOut()}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-md hover:bg-red-50" 
              aria-label="Sign out"
              title="Sign out"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 