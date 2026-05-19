'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/admin-sidebar'
import {
 DropdownMenu,
 DropdownMenuContent,
 DropdownMenuGroup,
 DropdownMenuItem,
 DropdownMenuLabel,
 DropdownMenuSeparator,
 DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { ChevronDown, LogOut, Settings, User } from 'lucide-react'
import { NotificationDropdown } from '@/components/home/notification-dropdown'

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

function UserDropdown({
 user,
 mounted,
 onLogout
}: {
 user: { name: string; role: string } | null
 mounted: boolean
 onLogout: () => void
}) {
 // Use a stable initials value for the first render to match SSR
 const initials = mounted && user?.name ? user.name.slice(0, 2).toUpperCase() : 'U'
 const displayName = mounted && user?.name ? user.name : 'User'
 const displayRole = mounted && user?.role ? user.role : ''

 return (
 <DropdownMenu>
 <DropdownMenuTrigger
 className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm hover:bg-muted transition-colors outline-none"
 style={{ opacity: mounted ? 1 : 0.7 }}
 >
 <Avatar className="h-7 w-7">
 <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold" suppressHydrationWarning>
 {initials}
 </AvatarFallback>
 </Avatar>
 <div className="hidden sm:flex flex-col items-start leading-none">
 <span className="font-medium text-foreground" suppressHydrationWarning>
 {displayName}
 </span>
 {displayRole && (
 <span className="text-[11px] text-muted-foreground capitalize" suppressHydrationWarning>
 {displayRole}
 </span>
 )}
 </div>
 <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
 </DropdownMenuTrigger>
 <DropdownMenuContent align="end" className="w-48">
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
 <DropdownMenuItem onClick={() => (window.location.href = '/management/profile')}>
 <User className="mr-2 h-4 w-4" />
 Profile
 </DropdownMenuItem>
 <DropdownMenuItem onClick={() => (window.location.href = '/management/settings')}>
 <Settings className="mr-2 h-4 w-4" />
 Settings
 </DropdownMenuItem>
 </DropdownMenuGroup>
 <DropdownMenuSeparator />
 <DropdownMenuGroup>
 <DropdownMenuItem variant="destructive" onClick={onLogout}>
 <LogOut className="mr-2 h-4 w-4" />
 Logout
 </DropdownMenuItem>
 </DropdownMenuGroup>
 </DropdownMenuContent>
 </DropdownMenu>
 )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
 const pathname = usePathname()
 const router = useRouter()
 const [user, setUser] = useState<{ name: string; role: string } | null>(null)
 const [mounted, setMounted] = useState(false)

 useEffect(() => {
 // eslint-disable-next-line react-hooks/set-state-in-effect
 setUser(getUserFromToken())
 setMounted(true)
 }, [])

 const handleLogout = () => {
 document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
 router.push('/management/login')
 }

 if (pathname === '/management/login') {
 return <>{children}</>
 }

 return (
 <SidebarProvider>
 <AdminSidebar />
 <main className="flex-1 flex flex-col min-h-screen bg-muted/20">
 <header className="flex h-20 items-center gap-4 shadow-md border-0 border-b-0 bg-background/95 backdrop-blur px-8 shadow-md border-0 transition-all">
 <SidebarTrigger className="h-10 w-10 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all" />
 <div className="h-6 w-px bg-" />
 <span className="text-lg font-bold tracking-tight text-foreground">
 {user?.role === 'Instructor' ? 'Hệ thống Giảng viên' : 'Hệ thống Quản trị'}
 </span>
 <div className="ml-auto flex items-center gap-2">
 <NotificationDropdown />
 <UserDropdown user={user} mounted={mounted} onLogout={handleLogout} />
 </div>
 </header>
 <div className="flex-1 p-10 space-y-10 max-w-[1700px] mx-auto w-full">{children}</div>
 </main>
 </SidebarProvider>
 )
}
