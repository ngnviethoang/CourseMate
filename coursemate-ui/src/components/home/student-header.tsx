'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { ShoppingCart, LogOut, User, ChevronDown, BookMarked, Trophy, Code2, Home } from 'lucide-react'
import { CourseMateLogoIcon } from '@/components/icons/coursemate-logo'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

function getUserFromToken() {
  try {
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/)
    if (!match) return null
    const payload = JSON.parse(atob(match[1].split('.')[1]))
    const name: string =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      payload['unique_name'] ??
      payload['name'] ??
      payload['sub'] ??
      'User'
    const role: string =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? payload['role'] ?? ''
    return { name, role }
  } catch {
    return null
  }
}

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/my-courses', label: 'Khoá học của tôi', icon: BookMarked },
  { href: '/contests', label: 'Cuộc thi', icon: Trophy },
  { href: '/exercises', label: 'Bài tập', icon: Code2 }
]

export function StudentHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setUser(getUserFromToken())
    setMounted(true)
  }, [])

  const initials = mounted && user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'
  const displayName = mounted && user?.name ? user.name : 'User'
  const displayRole = mounted && user?.role ? user.role : ''

  const handleLogout = () => {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <CourseMateLogoIcon className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight">CourseMate</span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-1 ml-auto">
          {user ? (
            <>
              <Link
                href="/cart"
                aria-label="Giỏ hàng"
                className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'rounded-full' })}
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition-colors outline-none ml-1"
                  style={{ opacity: mounted ? 1 : 0.7 }}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarFallback
                      className="bg-primary text-primary-foreground text-xs font-semibold"
                      suppressHydrationWarning
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium text-foreground" suppressHydrationWarning>
                    {displayName}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium" suppressHydrationWarning>
                          {displayName}
                        </span>
                        {displayRole && (
                          <span className="text-xs text-muted-foreground capitalize" suppressHydrationWarning>
                            {displayRole}
                          </span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Hồ sơ của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/my-courses')}>
                      <BookMarked className="mr-2 h-4 w-4" />
                      Khoá học của tôi
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      Đơn hàng
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Đăng xuất
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Link href="/login" className={buttonVariants({ size: 'sm' })}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden border-t px-4 py-2 flex gap-1 overflow-x-auto">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}
