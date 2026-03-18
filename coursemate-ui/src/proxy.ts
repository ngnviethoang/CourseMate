import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect all routes under /management
  if (pathname.startsWith('/management')) {
    const token = request.cookies.get('accessToken')?.value

    // If trying to access the login page while already authenticated
    if (pathname === '/management/login') {
      if (token) {
        return NextResponse.redirect(new URL('/management', request.url))
      }
      return NextResponse.next()
    }

    // If trying to access protected dashboard pages without a token
    if (!token) {
      return NextResponse.redirect(new URL('/management/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths under management, ensuring fast execution.
     * We don't need to match static files or api routes here.
     */
    '/management/:path*'
  ]
}
