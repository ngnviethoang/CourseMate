'use client'

import { useState, useEffect } from 'react'
import { StudentHeader } from '@/components/home/student-header'
import { HeroSection } from '@/components/home/hero-section'
import { ContinueLearning } from '@/components/home/continue-learning'
import { Categories } from '@/components/home/categories'
import { RecommendedCourses } from '@/components/home/recommended-courses'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('accessToken='))
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />
      <HeroSection onSearch={setSearchQuery} searchQuery={searchQuery} />

      <main className="mx-auto max-w-7xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
        {!searchQuery && isLoggedIn && <ContinueLearning />}
        {!searchQuery && <Categories />}
        <RecommendedCourses searchQuery={searchQuery} />
      </main>

      <footer className="mt-16 border-t py-8 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CourseMate. All rights reserved.
      </footer>
    </div>
  )
}
