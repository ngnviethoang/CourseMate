'use client'

import Link from 'next/link'
import { GraduationCap } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { NotificationDropdown } from '@/components/home/notification-dropdown'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">CourseMate</span>
        </div>

        {/* Nav links */}
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link href="/" className="text-primary">
            Trang chủ
          </Link>
          <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
            Khám phá khóa học
          </Link>
          <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
            Giỏ hàng
          </Link>
          <Link href="/orders" className="text-muted-foreground hover:text-foreground transition-colors">
            Đơn hàng
          </Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <NotificationDropdown />
          <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-primary/20">
            <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="Học viên" />
            <AvatarFallback>HN</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
