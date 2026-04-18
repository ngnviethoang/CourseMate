import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getRoles, isAuthenticated } from '@/lib/auth-token.util'
import { Roles } from './lib/consts'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const roles = getRoles()
  const isAuth = isAuthenticated()
  const isAdmin = roles.includes(Roles.Admin) || roles.includes(Roles.Instructor)
  const publicPaths = ['/', '/login', '/register']
  const isPublicPath = publicPaths.includes(pathname)
  const isAuthPage = pathname === '/login' || pathname === '/register'

  if (pathname.startsWith('/management')) {
    if (pathname === '/management/login') {
      if (isAuth && isAdmin) {
        return NextResponse.redirect(new URL('/management', request.url))
      }

      return NextResponse.next()
    }

    if (!isAuth) {
      return NextResponse.redirect(new URL('/management/login', request.url))
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
  }

  if (isPublicPath) {
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuth) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
