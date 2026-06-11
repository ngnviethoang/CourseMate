'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  LayoutGrid,
  BookOpen,
  Users,
  Tag,
  GraduationCap,
  LogOut,
  ShoppingCart,
  UserCheck,
  Code2,
  Trophy,
  Images
} from 'lucide-react'
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
  { href: '/management', label: 'Tổng quan', icon: LayoutGrid, roles: ['Admin', 'Instructor'] },
  { href: '/management/categories', label: 'Danh mục', icon: Tag, roles: ['Admin'] },
  { href: '/management/courses', label: 'Khóa học', icon: BookOpen, roles: ['Admin', 'Instructor'] },
  { href: '/management/exercises', label: 'Bài tập', icon: Code2, roles: ['Admin', 'Instructor'] },
  { href: '/management/contests', label: 'Cuộc thi', icon: Trophy, roles: ['Admin', 'Instructor'] },
  { href: '/management/users', label: 'Người dùng', icon: Users, roles: ['Admin'] },
  { href: '/management/instructors', label: 'Giảng viên', icon: UserCheck, roles: ['Admin'] },
  { href: '/management/orders', label: 'Đơn hàng', icon: ShoppingCart, roles: ['Admin', 'Instructor'] },
  { href: '/management/banners', label: 'Banner', icon: Images, roles: ['Admin'] }
]

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [role, setRole] = useState('')

  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/)
    if (match) {
      try {
        const payload = JSON.parse(atob(match[1].split('.')[1]))
        const r = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? payload['role'] ?? ''
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setRole(r)
      } catch (e) {
        console.error('Failed to parse token', e)
      }
    }
  }, [])

  const filteredItems = navItems.filter(
    item => !item.roles || item.roles.includes(role) || (Array.isArray(role) && role.some(r => item.roles.includes(r)))
  )

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
            <p className="text-[11px] text-white/70 mt-0.5">
              {role === 'Instructor' ? 'Bảng điều khiển giảng viên' : 'Bảng điều khiển quản trị'}
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="pt-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[11px] uppercase tracking-widest text-muted-foreground/70 px-4 mb-1">
            Quản lý
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5 px-2">
              {filteredItems.map(({ href, label, icon: Icon, disabled, disabledReason }) => {
                const isDisabled = Boolean(disabled)
                const active = !isDisabled && pathname === href
                return (
                  <SidebarMenuItem key={href}>
                    <button
                      onClick={() => {
                        if (isDisabled) {
                          toast.info(disabledReason ?? 'Tính năng này chưa khả dụng.')
                          return
                        }
                        router.push(href)
                      }}
                      aria-disabled={isDisabled}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-150
                        ${
                          active
                            ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30 font-medium'
                            : isDisabled
                              ? 'cursor-not-allowed text-foreground/40'
                              : 'text-foreground/70 hover:bg-primary/10 hover:text-primary'
                        }`}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span>{label}</span>
                      {isDisabled && (
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Soon
                        </span>
                      )}
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
          <span className="font-medium">Đăng xuất</span>
        </button>
      </SidebarFooter>
    </Sidebar>
  )
}
