import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here if needed
    console.log("Middleware: User authenticated for dashboards/playground route")
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Return true if user is authenticated, false otherwise
        const isAuthenticated = !!token
        const isProtectedRoute = req.nextUrl.pathname.startsWith('/dashboards') || 
                                req.nextUrl.pathname.startsWith('/playground')
        
        if (isProtectedRoute && !isAuthenticated) {
          return false
        }
        
        return true
      },
    },
    pages: {
      signIn: '/auth/signin',
    }
  }
)

// Specify which routes should be protected
export const config = {
  matcher: [
    '/dashboards/:path*',
    '/playground/:path*'
  ]
}