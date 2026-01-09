import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Check if authenticated user is trying to access auth routes
    if (token && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // Check if user is trying to access profile route
    if (pathname === '/profile') {
      // If not authenticated, redirect to home
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    // Check if user is trying to access admin routes
    if (pathname.startsWith('/admin')) {
      // If user role is not admin, redirect to home
      if (token?.role !== 'admin') {
        return NextResponse.redirect(new URL('/', req.url))
      }
    }
    
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to auth routes when not authenticated
        if (pathname === '/auth/signin' || pathname === '/auth/signup') {
          return true
        }

        // If accessing profile route, require authentication
        if (pathname === '/profile') {
          return !!token
        }

        // If accessing admin routes, require authentication
        if (pathname.startsWith('/admin')) {
          return !!token
        }
        
        // For all other routes, allow access
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\..*$).*)',
  ],
}