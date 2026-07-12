'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ChatWidget } from '@/components/(student)/chat/chat-widget'
import { StudentShell } from '@/components/home/student-shell'
import { isAuthenticated, isTokenExpired, getDecodedToken, removeToken } from '@/lib/auth-token.util'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLearningRoute = pathname.startsWith('/learning/')

  useEffect(() => {
    if (isLearningRoute) return
    if (typeof window === 'undefined') return
    if (!isAuthenticated()) {
      const next = encodeURIComponent(pathname || '/')
      window.location.href = `/login?next=${next}`
      return
    }
    if (isTokenExpired(getDecodedToken())) {
      removeToken()
      const next = encodeURIComponent(pathname || '/')
      window.location.href = `/login?next=${next}`
    }
  }, [pathname, isLearningRoute])

  if (isLearningRoute) {
    return (
      <div className="h-screen w-screen overflow-hidden bg-background">
        {children}
        <ChatWidget />
      </div>
    )
  }

  return (
    <StudentShell mainClassName="py-4">
      {children}
      <ChatWidget />
    </StudentShell>
  )
}
