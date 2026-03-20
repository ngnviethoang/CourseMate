'use client'

import { usePathname, useRouter } from 'next/navigation'
import { LayoutGrid, BookOpen, Users, Tag, GraduationCap, LogOut } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar'

const navItems = [
  { href: '/management', label: 'Dashboard', icon: LayoutGrid },
  { href: '/management/categories', label: 'Categories', icon: Tag },
  { href: '/management/courses', label: 'Courses', icon: BookOpen },
  { href: '/management/users', label: 'Users', icon: Users }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Sidebar className="border-r border-border/50">
      {/* Header */}
      <SidebarHeader className="bg-gradient-to-b from-primary to-primary/90 px-4 py-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 shadow-inner">
            <GraduationCap className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">CourseMate</p>
            <p className="text-[11px] text-white/70 mt-0.5">Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 px-4 mb-1">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-2">
              {navItems.map(({ href, label, icon: Icon }) => {
                const active = pathname === href
                return (
                  <SidebarMenuItem key={href}>
                    <button
                      onClick={() => router.push(href)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150
                        ${active
                          ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-medium'
                          : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
                        }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{label}</span>
                      {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground/70" />}
                    </button>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/50 p-4">
        <button
          onClick={() => {
            document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
            router.push('/management/login')
          }}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 hover:text-red-600 dark:hover:text-red-400 transition-colors"
        >
          <LogOut className="size-4 shrink-0" />
          <span className="font-medium">Logout</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
