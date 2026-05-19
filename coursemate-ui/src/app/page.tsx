'use client'

import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { StudentHeader } from '@/components/home/student-header'
import { HeroSection } from '@/components/home/hero-section'
import { ContinueLearning } from '@/components/home/continue-learning'
import { CategoryDropdown } from '@/components/home/category-dropdown'
import { RecommendedCourses } from '@/components/home/recommended-courses'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(document.cookie.includes('accessToken='))
  }, [])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [localSearch])

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <HeroSection />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {!searchQuery && isLoggedIn && <ContinueLearning />}

        {/* Search + Category filter bar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm khoá học, chủ đề, giảng viên…"
              className="h-11 rounded-xl border-transparent bg-card pl-10 pr-10 shadow-md border-0 transition-all focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:-primary/40"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
            {localSearch && (
              <button
                onClick={() => setLocalSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category dropdown */}
          <CategoryDropdown value={selectedCategoryId} onChange={setSelectedCategoryId} />
        </div>

        <RecommendedCourses
          searchQuery={searchQuery}
          isLoggedIn={isLoggedIn}
          selectedCategoryId={selectedCategoryId || undefined}
        />
      </main>

      <footer className="mt-16 shadow-md border-0 border-t-0 py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CourseMate. All rights reserved.
      </footer>
    </div>
  )
}
