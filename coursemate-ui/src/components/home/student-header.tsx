'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, ShoppingCart, ClipboardList, LogOut, User, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payload['role'] ??
      ''
    return { name, role }
  } catch {
    return null
  }
}

export function StudentHeader() {
  const router = useRouter()
  const user = useMemo(() => getUserFromToken(), [])

  const initials = user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'

  const handleLogout = () => {
    document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">CourseMate</span>
        </Link>

        <div className="flex items-center gap-1">
          {user ? (
            <>
              <Button variant="ghost" size="icon" className="rounded-full" render={<Link href="/cart" aria-label="Cart" />}>
                <ShoppingCart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full" render={<Link href="/orders" aria-label="Orders" />}>
                <ClipboardList className="h-5 w-5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition-colors outline-none ml-1">
                  <Avatar className="h-7 w-7">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block font-medium text-foreground">{user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{user.name}</span>
                        {user.role && (
                          <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                        )}
                      </div>
                    </DropdownMenuLabel>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => router.push('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/orders')}>
                      <ClipboardList className="mr-2 h-4 w-4" />
                      My Orders
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem variant="destructive" onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button size="sm" render={<Link href="/login" />}>
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}

