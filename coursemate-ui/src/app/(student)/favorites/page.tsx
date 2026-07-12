'use client'

import { Heart, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { CourseBrowseCard } from '@/components/(student)/course-browse-card'
import { useFavorites } from '@/contexts/favorites-context'
import { buttonVariants } from '@/components/ui/button'
import { favoritesService, type FavoriteCourseDto } from '@/lib/favorites-service'
import type { CourseDto } from '@/lib/types'
import { toast } from 'sonner'

export default function FavoritesPage() {
  const { favorites, toggle } = useFavorites()
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!favorites || favorites.length === 0) {
      setCourses([])
      setLoading(false)
      return
    }

    const fetchCourseDetails = async () => {
      try {
        const courseIds = favorites.map(f => f.courseId)
        const results = await Promise.allSettled(
          courseIds.map(id =>
            import('@/lib/course-service').then(m =>
              m.courseService.getById(id) as Promise<CourseDto | null>
            )
          )
        )

        const fetchedCourses: CourseDto[] = []
        for (const result of results) {
          if (result.status === 'fulfilled' && result.value) {
            fetchedCourses.push(result.value as CourseDto)
          }
        }
        setCourses(fetchedCourses)
      } catch {
        toast.error('Không thể tải danh sách yêu thích')
      } finally {
        setLoading(false)
      }
    }

    fetchCourseDetails()
  }, [favorites])

  const handleToggle = async (courseId: string) => {
    await toggle(courseId)
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500 text-white shadow-lg shadow-red-500/25">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Khóa học yêu thích</h1>
            <p className="text-sm text-muted-foreground">
              {courses.length > 0
                ? `${courses.length} khóa học đang được bạn quan tâm`
                : 'Chưa có khóa học nào'}
            </p>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Đang tải danh sách yêu thích...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-card border border-dashed rounded-[2rem] shadow-sm">
            <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
              <Heart className="h-12 w-12" />
            </div>
            <div className="space-y-2 max-w-md">
              <h3 className="text-2xl font-bold text-foreground">Chưa có khóa học yêu thích</h3>
              <p className="text-muted-foreground text-base">
                Nhấn biểu tượng trái tim trên khóa học bạn quan tâm để lưu lại và xem lại sau.
              </p>
            </div>
            <Link
              href="/courses"
              className={buttonVariants({ size: 'lg', className: 'rounded-full h-12 px-8 text-base shadow-lg shadow-primary/25' })}
            >
              Khám phá khóa học ngay
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map(course => (
              <CourseBrowseCard
                key={course.id}
                course={course}
                onClick={() => { window.location.href = `/courses/${course.id}` }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
