'use client'

import { StudentShell } from '@/components/home/student-shell'
import { usePathname } from 'next/navigation'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLearningRoute = pathname.startsWith('/learning/')

  if (isLearningRoute) {
    return <div className="h-screen w-screen overflow-hidden bg-background">{children}</div>
  }

  return <StudentShell mainClassName="py-8">{children}</StudentShell>
}
