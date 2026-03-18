'use client'

import { usePathname } from 'next/navigation'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { AdminSidebar } from '@/components/admin/admin-sidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  if (pathname === '/management/login') {
    return <>{children}</>
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-h-screen bg-muted/30">
        <header className="flex h-14 items-center gap-3 border-b bg-background/95 backdrop-blur px-4 shadow-sm">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="h-5 w-px bg-border" />
          <span className="text-sm font-semibold text-primary">Admin Dashboard</span>
        </header>
        <div className="flex-1 p-6 space-y-6">{children}</div>
      </main>
    </SidebarProvider>
  )
}
