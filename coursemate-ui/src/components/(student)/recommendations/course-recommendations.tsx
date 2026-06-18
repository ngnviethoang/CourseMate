'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { RecommendedCourseDto, recommendationService } from '@/lib/recommendation-service'
import { formatCurrency } from '@/lib/utils'

type RecommendationVariant = 'for-me' | 'trending' | 'similar'

interface CourseRecommendationsProps {
  variant: RecommendationVariant
  courseId?: string
  title?: string
  limit?: number
}

const DEFAULT_TITLES: Record<RecommendationVariant, string> = {
  'for-me': 'Gợi ý cho bạn',
  trending: 'Xu hướng',
  similar: 'Khóa học liên quan'
}

export function CourseRecommendations({ variant, courseId, title, limit }: CourseRecommendationsProps) {
  const [courses, setCourses] = useState<RecommendedCourseDto[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      if (variant === 'similar' && courseId) {
        setCourses(await recommendationService.getSimilar(courseId, limit ?? 8))
      } else if (variant === 'trending') {
        setCourses(await recommendationService.getTrending(limit ?? 12))
      } else {
        setCourses(await recommendationService.getForMe(limit ?? 12))
      }
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [variant, courseId, limit])

  useEffect(() => {
    if (variant === 'similar' && !courseId) return
    fetchData()
  }, [variant, courseId, fetchData])

  if (!loading && courses.length === 0) {
    return null
  }

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold tracking-tight">{title ?? DEFAULT_TITLES[variant]}</h2>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-56 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map(course => (
            <RecommendedCourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </section>
  )
}

function RecommendedCourseCard({ course }: { course: RecommendedCourseDto }) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-shadow duration-200 hover:shadow-lg"
    >
      <div className="relative h-40 w-full overflow-hidden">
        {course.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/40 to-primary">
            <BookOpen className="h-10 w-10 text-white/80" />
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        {course.categoryName && (
          <span className="mb-2 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            {course.categoryName}
          </span>
        )}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <div className="flex-1" />
        <div className="mt-3 border-t pt-3">
          <span className="text-base font-bold text-primary">
            {course.price === 0 ? 'Miễn phí' : formatCurrency(course.price)}
          </span>
        </div>
      </div>
    </Link>
  )
}
