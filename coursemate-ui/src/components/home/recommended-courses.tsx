'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronLeft, ChevronRight, Loader2, ShoppingCart, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { orderService } from '@/lib/order-service'
import { courseService } from '@/lib/course-service'
import { CourseDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'

function getReview(idx: number) {
  const ratings = [4.9, 4.8, 4.7, 4.6, 4.8, 4.5, 4.9, 4.7]
  const students = [18400, 12700, 24900, 9300, 15200, 8100, 21000, 11000]
  const badges = ['Bán chạy', 'Mới', 'Đánh giá cao', null, 'Bán chạy', null, 'Đánh giá cao', 'Mới']
  return {
    rating: ratings[idx % ratings.length],
    students: students[idx % students.length],
    badge: badges[idx % badges.length] as string | null
  }
}

const BADGE_STYLES: Record<string, string> = {
  'Bán chạy': 'bg-amber-500 text-white border-0',
  Mới: 'bg-emerald-500 text-white border-0',
  'Đánh giá cao': 'bg-blue-500 text-white border-0'
}

const GRADIENT_FALLBACKS = [
  'from-indigo-400 to-blue-600',
  'from-violet-400 to-purple-600',
  'from-emerald-400 to-teal-600',
  'from-pink-400 to-rose-600',
  'from-amber-400 to-orange-500',
  'from-sky-400 to-cyan-600',
  'from-fuchsia-400 to-pink-600',
  'from-lime-400 to-green-500'
]

function CourseCardSkeleton() {
  return (
    <div className="rounded-2xl bg-card overflow-hidden animate-pulse">
      <div className="h-44 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded-full w-3/4" />
        <div className="h-3 bg-muted rounded-full w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 bg-muted rounded-full w-16" />
          <div className="h-3 bg-muted rounded-full w-20" />
        </div>
        <div className="flex justify-between items-center pt-1">
          <div className="h-5 bg-muted rounded-full w-20" />
          <div className="h-7 bg-muted rounded-full w-20" />
        </div>
      </div>
    </div>
  )
}

interface CourseCardProps {
  course: CourseDto
  index: number
}

function CourseCard({ course, index }: CourseCardProps) {
  const router = useRouter()
  const { rating, students, badge } = getReview(index)
  const [adding, setAdding] = useState(false)
  const gradient = GRADIENT_FALLBACKS[index % GRADIENT_FALLBACKS.length]

  const handleAction = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (course.isEnrollment) {
      router.push(`/learning/${course.id}`)
      return
    }

    if (course.isInCart) {
      router.push('/cart')
      return
    }

    try {
      setAdding(true)
      if (course.price === 0) {
        await orderService.enrollFree(course.id)
        toast.success(`Bạn đã tham gia khóa học "${course.title}" thành công!`)
        course.isEnrollment = true 
        course.isInCart = false 
        router.push(`/learning/${course.id}`)
      } else {
        await orderService.addToCart(course.id)
        toast.success(`"${course.title}" đã được thêm vào giỏ hàng!`)
        course.isInCart = true 
      }
    } catch {
      // error toast handled by apiClient
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        {course.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={e => {
              ;(e.target as HTMLImageElement).style.display = 'none'
              ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        {/* Gradient fallback */}
        <div
          className={`${course.imageUrl ? 'hidden' : 'flex'} h-44 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <BookOpen className="h-12 w-12 text-white/80" />
        </div>

        {/* Badge */}
        {badge && (
          <Badge className={`absolute left-3 top-3 text-[10px] font-semibold shadow ${BADGE_STYLES[badge]}`}>
            {badge}
          </Badge>
        )}

        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category chip */}
        {course.categoryName && (
          <span className="mb-2 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            {course.categoryName}
          </span>
        )}

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>

        {/* Instructor */}
        <p className="mt-1 text-xs text-muted-foreground">{course.instructorName ?? 'Giảng viên'}</p>

        {/* Rating + students */}
        <div className="mt-2 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold">{rating.toFixed(1)}</span>
            <span className="text-muted-foreground">({students.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="h-3 w-3" />
            {students.toLocaleString()}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer: price + cart */}
        <div className="mt-3 flex items-center justify-between border-t pt-3">
          <span className="text-base font-bold text-primary">{formatCurrency(course.price)}</span>
          <button
            onClick={handleAction}
            disabled={adding}
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-60"
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : !course.isEnrollment && course.price > 0 ? (
              <ShoppingCart className="h-3.5 w-3.5" />
            ) : null}
            {adding
              ? '...'
              : course.isEnrollment
                ? 'Vào học'
                : course.isInCart
                  ? 'Đã thêm vào giỏ'
                  : course.price === 0
                    ? 'Vào học'
                    : 'Thêm giỏ hàng'}
          </button>
        </div>
      </div>
    </Link>
  )
}

interface RecommendedCoursesProps {
  searchQuery?: string
  isLoggedIn?: boolean
  selectedCategoryId?: string
  headerAction?: React.ReactNode
}

export function RecommendedCourses({
  searchQuery,
  isLoggedIn,
  selectedCategoryId,
  headerAction
}: RecommendedCoursesProps) {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const PAGE_SIZE = 12

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  const fetchCourses = useCallback(
    async (page: number, filter?: string, categoryId?: string, loggedIn?: boolean) => {
      setLoading(true)
      try {
        const res =
          filter || categoryId
            ? await courseService.list({ pageIndex: page - 1, pageSize: PAGE_SIZE, filter, categoryId })
            : await courseService.list({ pageIndex: page - 1, pageSize: PAGE_SIZE })
        setCourses(res.items)
        setTotalCount(res.totalCount)
      } catch {
        // error handled by apiClient
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const refreshCurrentPage = useCallback(
    async (courseId: string, changes: Partial<Pick<CourseDto, 'isInCart' | 'isEnrollment'>>) => {
      setCourses(currentCourses =>
        currentCourses.map(course => (course.id === courseId ? { ...course, ...changes } : course))
      )
    },
    []
  )

  // Trở về trang 1 khi bộ lọc thay đổi
  useEffect(() => {
    setPageIndex(1)
  }, [searchQuery, selectedCategoryId, isLoggedIn])

  useEffect(() => {
    fetchCourses(pageIndex, searchQuery, selectedCategoryId, isLoggedIn)
  }, [pageIndex, searchQuery, selectedCategoryId, isLoggedIn, fetchCourses])

  const isRecommended = !searchQuery && !selectedCategoryId && isLoggedIn
  const visibleCourses = isRecommended ? courses.filter(course => !course.isEnrollment) : courses
  const title = searchQuery ? `Kết quả cho "${searchQuery}"` : isRecommended ? 'Gợi ý cho bạn' : 'Khám phá khoá học'

  // Build visible page numbers
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (pageIndex > 3) pages.push('ellipsis')
      const start = Math.max(2, pageIndex - 1)
      const end = Math.min(totalPages - 1, pageIndex + 1)
      for (let i = start; i <= end; i++) pages.push(i)
      if (pageIndex < totalPages - 2) pages.push('ellipsis')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <section>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        </div>
        {headerAction && <div className="shrink-0">{headerAction}</div>}
      </div>

      {loading && visibleCourses.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : visibleCourses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12 opacity-30" />
          <p className="text-sm">Không tìm thấy khoá học{searchQuery ? ` cho "${searchQuery}"` : ''}.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visibleCourses.map((course, idx) => (
              <CourseCard
                key={course.id}
                course={course}
                index={(pageIndex - 1) * PAGE_SIZE + idx}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-1.5">
              {/* Previous */}
              <button
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
                className="flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium shadow-sm transition-all hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Trước</span>
              </button>

              {/* Page numbers */}
              {getPageNumbers().map((page, i) =>
                page === 'ellipsis' ? (
                  <span
                    key={`e-${i}`}
                    className="flex h-9 w-9 items-center justify-center text-sm text-muted-foreground"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setPageIndex(page)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      page === pageIndex
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'border border-border bg-card shadow-sm hover:bg-accent'
                    }`}
                  >
                    {page}
                  </button>
                )
              )}

              {/* Next */}
              <button
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                disabled={pageIndex === totalPages}
                className="flex h-9 items-center gap-1 rounded-lg border border-border bg-card px-3 text-sm font-medium shadow-sm transition-all hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
              >
                <span className="hidden sm:inline">Sau</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </section>
  )
}
