'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Loader2, ShoppingCart, Star, Users, Zap } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { studentService } from '@/lib/student-service'
import { CourseDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

import { useRouter } from 'next/navigation'

// Static mock reviews – no review API yet
function getReview(idx: number) {
  const ratings = [4.9, 4.8, 4.7, 4.6, 4.8, 4.5, 4.9, 4.7]
  const students = [18400, 12700, 24900, 9300, 15200, 8100, 21000, 11000]
  const badges = ['Bestseller', 'New', 'Top Rated', null, 'Bestseller', null, 'Top Rated', 'New']
  return {
    rating: ratings[idx % ratings.length],
    students: students[idx % students.length],
    badge: badges[idx % badges.length] as string | null
  }
}

const BADGE_STYLES: Record<string, string> = {
  Bestseller: 'bg-amber-500 text-white border-0',
  New: 'bg-emerald-500 text-white border-0',
  'Top Rated': 'bg-blue-500 text-white border-0'
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
    <div className="rounded-2xl border bg-card overflow-hidden animate-pulse">
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

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Redirect logic: if there is no accessToken, jump to login.
    const hasToken = document.cookie.includes('accessToken=')
    if (!hasToken) {
      router.push('/login')
      return
    }

    try {
      setAdding(true)
      await studentService.addToCart(course.id)
      toast.success(`"${course.title}" đã được thêm vào giỏ hàng!`)
    } catch {
      // error toast handled by apiClient
    } finally {
      setAdding(false)
    }
  }

  return (
    <Link
      href={`/courses/${course.id}`}
      className="group flex flex-col rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl overflow-hidden"
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
        <p className="mt-1 text-xs text-muted-foreground">{course.instructorName ?? 'Instructor'}</p>

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
            onClick={handleAddToCart}
            disabled={adding}
            className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-60"
          >
            {adding ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShoppingCart className="h-3.5 w-3.5" />
            )}
            {adding ? '...' : 'Enroll'}
          </button>
        </div>
      </div>
    </Link>
  )
}

interface RecommendedCoursesProps {
  searchQuery?: string
}

export function RecommendedCourses({ searchQuery }: RecommendedCoursesProps) {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 12

  const fetchCourses = useCallback(async (filter?: string) => {
    setLoading(true)
    try {
      const res = filter 
        ? await studentService.getCourses(1, PAGE_SIZE, filter)
        : await studentService.getRecommendedCourses(1, PAGE_SIZE)
      setCourses(res.items)
    } catch {
      // error handled by apiClient
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCourses(searchQuery)
  }, [searchQuery, fetchCourses])

  const title = searchQuery ? `Kết quả cho "${searchQuery}"` : 'Gợi ý cho bạn'
  const subtitle = searchQuery ? `${courses.length} khoá học được tìm thấy` : 'Dựa trên các khoá học mới nhất'

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          {!searchQuery && (
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">
              <Zap className="mr-1 inline h-3 w-3" />
              Dành riêng cho bạn
            </p>
          )}
          <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {!searchQuery && (
          <Link
            href="/courses"
            className={buttonVariants({ variant: 'ghost', size: 'sm', className: 'group gap-1 text-primary' })}
          >
            Xem tất cả
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>

      {loading && courses.length === 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed py-20 text-muted-foreground">
          <BookOpen className="h-12 w-12 opacity-30" />
          <p className="text-sm">Không tìm thấy khoá học{searchQuery ? ` cho "${searchQuery}"` : ''}.</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {courses.map((course, idx) => (
            <CourseCard key={course.id} course={course} index={idx} />
          ))}
        </div>
      )}
    </section>
  )
}
