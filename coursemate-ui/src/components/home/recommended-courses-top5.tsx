'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Loader2, ShoppingCart, Star } from 'lucide-react'

import { orderService } from '@/lib/order-service'
import { recommendationService, RecommendedCourseDto } from '@/lib/recommendation-service'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { useRouter } from 'next/navigation'

const GRADIENT_FALLBACKS = [
  'from-indigo-500 to-blue-700',
  'from-violet-500 to-purple-700',
  'from-emerald-500 to-teal-700',
  'from-pink-500 to-rose-700',
  'from-amber-500 to-orange-700'
]

// Mock reviews – no review API yet. Cycle 0..4 across 5 cards.
const MOCK_RATINGS = [4.9, 4.8, 4.7, 4.6, 4.8]
const MOCK_STUDENTS = [18400, 12700, 24900, 9300, 15200]

interface Props {
  /** Source page where this component is rendered – used for analytics later */
  source?: 'home' | 'courses' | 'exercises'
  /** Optional title override */
  title?: string
  /** Number of items to show (default 5) */
  topN?: number
}

export function RecommendedCoursesTop5({ source = 'home', title = 'Top 5 gợi ý cho bạn', topN = 5 }: Props) {
  const router = useRouter()
  const [courses, setCourses] = useState<RecommendedCourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [addingId, setAddingId] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await recommendationService.getForMe(topN)
        if (!cancelled) setCourses((res || []).slice(0, topN))
      } catch {
        if (!cancelled) setCourses([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [topN])

  const handleAction = async (e: React.MouseEvent, course: RecommendedCourseDto) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      setAddingId(course.id)
      if (course.price === 0) {
        await orderService.enrollFree(course.id)
        toast.success(`Bạn đã tham gia "${course.title}"`)
        router.push(`/learning/${course.id}`)
      } else {
        await orderService.addToCart(course.id)
        toast.success(`"${course.title}" đã thêm vào giỏ hàng`)
      }
    } catch {
      // error toast handled by apiClient
    } finally {
      setAddingId(null)
    }
  }

  // Hide the entire section if not logged in OR no data
  if (!loading && courses.length === 0) return null

  return (
    <section className="relative overflow-hidden rounded-3xl border-2 border-primary/15 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6 shadow-sm sm:p-8">
      {/* Decorative blur */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-violet-500/10 blur-3xl" />

     

      {/* Cards – 5 columns on lg, scroll on mobile */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: topN }).map((_, i) => (
            <div key={i} className="rounded-2xl bg-card p-4 shadow-sm">
              <div className="mb-3 h-32 animate-pulse rounded-xl bg-muted" />
              <div className="space-y-2">
                <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {courses.map((course, idx) => (
            <RecommendedCourseCard
              key={course.id}
              course={course}
              rank={idx + 1}
              gradient={GRADIENT_FALLBACKS[idx % GRADIENT_FALLBACKS.length]}
              rating={MOCK_RATINGS[idx % MOCK_RATINGS.length]}
              students={MOCK_STUDENTS[idx % MOCK_STUDENTS.length]}
              isAdding={addingId === course.id}
              onAction={e => handleAction(e, course)}
            />
          ))}
        </div>
      )}
    </section>
  )
}

function RecommendedCourseCard({
  course,
  rank,
  gradient,
  rating,
  students,
  isAdding,
  onAction
}: {
  course: RecommendedCourseDto
  rank: number
  gradient: string
  rating: number
  students: number
  isAdding: boolean
  onAction: (e: React.MouseEvent) => void
}) {
  return (
    <Link
      href={`/courses/${course.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
      data-source="recommended-top5"
    >
      {/* Rank badge */}
      <div className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-xs font-extrabold text-white shadow-lg shadow-amber-500/40 ring-2 ring-white">
        #{rank}
      </div>

      {/* Thumbnail */}
      <div className="relative overflow-hidden">
        {course.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.imageUrl}
            alt={course.title}
            className="h-32 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={e => {
              ;(e.target as HTMLImageElement).style.display = 'none'
              ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
            }}
          />
        ) : null}
        <div
          className={`${course.imageUrl ? 'hidden' : 'flex'} h-32 w-full items-center justify-center bg-gradient-to-br ${gradient}`}
        >
          <BookOpen className="h-10 w-10 text-white/90" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-3.5">
        {course.categoryName && (
          <span className="mb-1.5 w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
            {course.categoryName}
          </span>
        )}
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {course.title}
        </h3>
        <p className="mt-1 line-clamp-1 text-[11px] text-muted-foreground">
          {course.categoryName || 'Khóa học'}
        </p>

        <div className="mt-2 flex items-center gap-2 text-[11px]">
          <div className="flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="font-bold">{rating.toFixed(1)}</span>
          </div>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">{(students / 1000).toFixed(0)}k học viên</span>
        </div>

        <div className="flex-1" />

        <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-2.5">
          <span className="text-sm font-extrabold text-primary">{formatCurrency(course.price)}</span>
          <button
            onClick={onAction}
            disabled={isAdding}
            className="flex h-7 items-center gap-1 rounded-full bg-primary/10 px-2.5 text-[11px] font-semibold text-primary transition-all hover:bg-primary hover:text-white disabled:opacity-60"
          >
            {isAdding ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : course.price > 0 ? (
              <ShoppingCart className="h-3 w-3" />
            ) : null}
            {course.price === 0 ? 'Học ngay' : 'Thêm'}
          </button>
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex items-end justify-end bg-black/0 p-3 opacity-0 transition-opacity duration-300 group-hover:bg-black/30 group-hover:opacity-100">
        <ChevronRight className="h-6 w-6 text-white" />
      </div>
    </Link>
  )
}