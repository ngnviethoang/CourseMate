'use client'

import { ReactNode } from 'react'
import { StudentHeader } from '@/components/home/student-header'
import { cn } from '@/lib/utils'

interface StudentShellProps {
  children: ReactNode
  mainClassName?: string
  footerClassName?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onClearSearch?: () => void
}

export function StudentShell({
  children,
  mainClassName,
  footerClassName,
  searchValue,
  onSearchChange,
  onClearSearch
}: StudentShellProps) {
  return (
    <div className="min-h-screen bg-background">
      <StudentHeader searchValue={searchValue} onSearchChange={onSearchChange} onClearSearch={onClearSearch} />
      <main className={cn('mx-auto w-full max-w-7xl px-4 py-8', mainClassName)}>{children}</main>
      <footer
        className={cn(
          'mt-10 border-t border-border/60 py-6 text-center text-xs text-muted-foreground',
          footerClassName
        )}
      >
        © {new Date().getFullYear()} CourseMate. Bảo lưu mọi quyền.
      </footer>
    </div>
  )
}
