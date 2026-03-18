import { StudentHeader } from '@/components/home/student-header'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <StudentHeader />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CourseMate. All rights reserved.
      </footer>
    </div>
  )
}
