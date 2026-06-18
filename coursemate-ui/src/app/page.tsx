'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { ContinueLearning } from '@/components/home/continue-learning'
import { CategoryDropdown } from '@/components/home/category-dropdown'
import { RecommendedCourses } from '@/components/home/recommended-courses'
import { CourseRecommendations } from '@/components/(student)/recommendations/course-recommendations'
import { BannerSlider } from '@/components/home/banner-slider'
import { buttonVariants } from '@/components/ui/button'
import { StudentShell } from '@/components/home/student-shell'

export default function Home() {
  const searchParams = useSearchParams()
  const queryParam = searchParams ? (searchParams.get('search') ?? '') : ''

  const [searchQuery, setSearchQuery] = useState('')
  const [localSearch, setLocalSearch] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState('')

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoggedIn(document.cookie.includes('accessToken='))
  }, [])

  useEffect(() => {
    setLocalSearch(queryParam)
  }, [queryParam])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch)
    }, 500)
    return () => clearTimeout(timer)
  }, [localSearch])

  const hasSearch = searchQuery.trim().length > 0
  const hasCategory = selectedCategoryId.length > 0
  const hasActiveFilter = hasSearch || hasCategory

  return (
    <StudentShell
      mainClassName="space-y-6 py-5"
      footerClassName="mt-8"
      searchValue={localSearch}
      onSearchChange={setLocalSearch}
      onClearSearch={() => setLocalSearch('')}
    >
      <BannerSlider />
      {!hasActiveFilter && isLoggedIn && <ContinueLearning />}
      {!hasActiveFilter && (
        <CourseRecommendations variant={isLoggedIn ? 'for-me' : 'trending'} />
      )}

      <RecommendedCourses
        searchQuery={searchQuery}
        isLoggedIn={isLoggedIn}
        selectedCategoryId={selectedCategoryId || undefined}
        headerAction={
          <div className="flex w-[320px] items-center gap-2">
            <CategoryDropdown value={selectedCategoryId} onChange={setSelectedCategoryId} />
            {hasActiveFilter && (
              <button
                type="button"
                onClick={() => {
                  setLocalSearch('')
                  setSearchQuery('')
                  setSelectedCategoryId('')
                }}
                className={buttonVariants({ variant: 'outline', className: 'shrink-0 rounded-xl px-3' })}
              >
                Xoá lọc
              </button>
            )}
          </div>
        }
      />
    </StudentShell>
  )
}
