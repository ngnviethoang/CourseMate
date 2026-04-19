import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRoles, isAuthenticated } from '@/lib/auth-token.util'
import { Roles } from './lib/consts'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const roles = getRoles()
  const isAuth = isAuthenticated()
  const publicPaths = ['/', '/login', '/register', '/about', '/contact']

  if (publicPaths.includes(pathname)) {
    return NextResponse.next()
  }

  if (isAuth) {
    if (pathname.startsWith('/management') && (roles.includes(Roles.Admin) || roles.includes(Roles.Instructor))) {
      return NextResponse.next()
    } else {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
