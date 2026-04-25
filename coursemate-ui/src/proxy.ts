import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRoles, isAuthenticated } from '@/lib/auth-token.util'
import { Roles } from './lib/consts'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value
  const roles = getRoles(token)
  const isAuth = isAuthenticated(token)
  const publicPaths = ['/', '/login', '/register', '/about', '/contact']

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  if (isAuth) {
    if (pathname.startsWith('/management')) {
      if (roles.includes(Roles.Admin) || roles.includes(Roles.Instructor)) {
        return NextResponse.next()
      }
      // Redirect students away from management pages
      return NextResponse.redirect(new URL('/', request.url))
    }
    // Allow access to all other pages (student pages) for authenticated users
    return NextResponse.next()
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
