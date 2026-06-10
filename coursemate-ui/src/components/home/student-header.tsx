'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  ShoppingCart,
  LogOut,
  User,
  ChevronDown,
  BookMarked,
  Trophy,
  Code2,
  Home,
  Search,
  X,
  LayoutDashboard
} from 'lucide-react'
import { getAccessToken, getDecodedToken, removeToken } from '@/lib/auth-token.util'
import { CourseMateLogoIcon } from '@/components/icons/coursemate-logo'
import { buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { NotificationDropdown } from '@/components/home/notification-dropdown'
import { Input } from '@/components/ui/input'
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
    const token = getAccessToken()
    if (!token) return null
    const payload = getDecodedToken(token) as Record<string, string | undefined>
    if (!payload) return null
    const name: string =
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ??
      payload['unique_name'] ??
      payload['name'] ??
      payload['sub'] ??
      'Người dùng'
    const role: string =
      payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? payload['role'] ?? ''
    return { name, role }
  } catch {
    return null
  }
}

const NAV_LINKS = [
  { href: '/', label: 'Trang chủ', icon: Home },
  { href: '/contests', label: 'Cuộc thi', icon: Trophy },
  { href: '/exercises', label: 'Bài tập', icon: Code2 }
]

export function StudentHeader({
  searchValue,
  onSearchChange,
  onClearSearch
}: {
  searchValue?: string
  onSearchChange?: (value: string) => void
  onClearSearch?: () => void
}) {
  const router = useRouter()
  const pathname = usePathname()

  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [mounted, setMounted] = useState(false)
  const [prevSearchValue, setPrevSearchValue] = useState(searchValue)
  const [localSearchVal, setLocalSearchVal] = useState(searchValue || '')

  if (searchValue !== prevSearchValue) {
    setPrevSearchValue(searchValue)
    setLocalSearchVal(searchValue || '')
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getUserFromToken())
    setMounted(true)
  }, [])

  const initials = mounted && user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'
  const displayName = mounted && user?.name ? user.name : 'Người dùng'
  const displayRole = mounted && user?.role ? user.role : ''

  const handleLogout = () => {
    removeToken()
    router.push('/login')
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (typeof onSearchChange !== 'function') {
      router.push(`/?search=${encodeURIComponent(localSearchVal)}`)
    }
  }

  const handleClear = () => {
    setLocalSearchVal('')
    if (typeof onClearSearch === 'function') {
      onClearSearch()
    } else {
      router.push('/')
    }
  }

  const isMyCoursesActive = pathname === '/my-courses'

  return (
    <header className="sticky top-0 z-50 bg-background/90 shadow-[0_10px_28px_rgba(15,23,42,0.05)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4">
        {/* Phần 1: Logo và Navigation Links */}
        <div className="flex flex-1 items-center gap-6 min-w-0">
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-2xl px-1.5 py-1">
            <CourseMateLogoIcon className="h-8 w-8 rounded-lg" />
            <span className="text-[17px] font-bold tracking-tight text-foreground">CourseMate</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex shrink-0">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Phần 2: Thanh tìm kiếm */}
        <div className="flex flex-1 justify-center min-w-0">
          <form onSubmit={handleSearchSubmit} className="relative w-full max-w-[400px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm khoá học, chủ đề, giảng viên…"
              className="h-10 rounded-2xl border-transparent bg-muted/55 pl-9 pr-9 shadow-none transition-all focus-visible:bg-background focus-visible:ring-2 focus-visible:ring-primary/25"
              value={localSearchVal}
              onChange={event => {
                const val = event.target.value
                setLocalSearchVal(val)
                if (typeof onSearchChange === 'function') {
                  onSearchChange(val)
                }
              }}
            />
            {localSearchVal && (
              <button
                type="button"
                onClick={handleClear}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </form>
        </div>

        {/* Phần 3: User actions (Notify, Cart, Avatar, Đăng nhập) */}
        <div className="flex flex-1 justify-end items-center gap-1.5">
          {user ? (
            <>
              <Link
                href="/my-courses"
                className={`hidden shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors md:inline-flex ${
                  isMyCoursesActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                }`}
              >
                Khoá học của tôi
              </Link>

              {['Admin', 'Instructor'].includes(displayRole) && (
                <Link
                  href="/management"
                  className="hidden shrink-0 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors md:inline-flex text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                >
                  Quản lý
                </Link>
              )}

              <NotificationDropdown />

              <Link
                href="/cart"
                aria-label="Giỏ hàng"
                className={buttonVariants({
                  variant: 'ghost',
                  size: 'icon',
                  className: 'rounded-full hover:bg-muted/70'
                })}
              >
                <ShoppingCart className="h-5 w-5" />
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className="ml-1 flex items-center gap-2 rounded-2xl px-2 py-1.5 text-sm transition-colors hover:bg-muted/70 outline-none"
                  style={{ opacity: mounted ? 1 : 0.7 }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className="bg-primary text-primary-foreground text-xs font-semibold"
                      suppressHydrationWarning
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden font-medium text-foreground sm:block" suppressHydrationWarning>
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
                    {['Admin', 'Instructor'].includes(displayRole) && (
                      <DropdownMenuItem onClick={() => router.push('/management')}>
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Trang quản lý
                      </DropdownMenuItem>
                    )}
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
            <Link href="/login" className={buttonVariants({ size: 'sm', className: 'rounded-xl' })}>
              Đăng nhập
            </Link>
          )}
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {NAV_LINKS.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors ${
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
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
