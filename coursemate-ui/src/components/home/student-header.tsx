'use client'

import Link from 'next/link'
import { GraduationCap, ShoppingCart, ClipboardList } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function StudentHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">CourseMate</span>
        </Link>

        {/* Right side icons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="rounded-full" render={<Link href="/cart" aria-label="Cart" />}>
            <ShoppingCart className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            render={<Link href="/orders" aria-label="Orders" />}
          >
            <ClipboardList className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
