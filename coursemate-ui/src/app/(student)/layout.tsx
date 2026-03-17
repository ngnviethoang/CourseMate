import Link from 'next/link'

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <nav className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-6">
          <Link href="/" className="font-bold text-lg">
            CourseMate
          </Link>
          <Link href="/courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Courses
          </Link>
          <Link href="/my-courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            My Courses
          </Link>
        </nav>
      </header>
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">{children}</main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} CourseMate. All rights reserved.
      </footer>
    </div>
  )
}
