import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('accessToken')?.value

  if (pathname.startsWith('/management')) {
    if (pathname === '/management/login') {
      if (token) {
        return NextResponse.redirect(new URL('/management', request.url))
      }
      return NextResponse.next()
    }

    if (!token) {
      return NextResponse.redirect(new URL('/management/login', request.url))
    }

    return NextResponse.next()
  }

  const publicPaths = ['/', '/login', '/register']
  if (publicPaths.includes(pathname)) {
    if (token && (pathname === '/login' || pathname === '/register')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
    return NextResponse.next()
  }

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}
