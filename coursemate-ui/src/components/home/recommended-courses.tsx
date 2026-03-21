'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { BookOpen, ChevronRight, Loader2, Star, Users } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { studentService } from '@/lib/student-service'
import { CourseDto } from '@/lib/types'
import { toast } from 'sonner'

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

function CourseCardSkeleton() {
  return (
    <div className="rounded-xl border bg-card overflow-hidden animate-pulse">
      <div className="h-36 bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  )
}

interface CourseCardProps {
  course: CourseDto
  index: number
}

function CourseCard({ course, index }: CourseCardProps) {
  const { rating, students, badge } = getReview(index)
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    try {
      setAdding(true)
      await studentService.addToCart(course.id)
      toast.success(`"${course.title}" added to cart!`)
    } catch {
      // error toast handled by apiClient
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card className="group cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 duration-200 overflow-hidden">
      <Link href={`/courses/${course.id}`} className="block relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={
            course.imageUrl ||
            `https://placehold.co/400x225/6366f1/ffffff?text=${encodeURIComponent(course.title.slice(0, 15))}`
          }
          alt={course.title}
          className="h-36 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={e => {
            ;(e.target as HTMLImageElement).src =
              `https://placehold.co/400x225/6366f1/ffffff?text=${encodeURIComponent(course.categoryName)}`
          }}
        />
        {badge && (
          <Badge
            className={`absolute left-2 top-2 text-[10px] shadow-sm ${
              badge === 'Bestseller'
                ? 'bg-amber-500 text-white'
                : badge === 'New'
                  ? 'bg-emerald-500 text-white'
                  : 'bg-blue-500 text-white'
            }`}
          >
            {badge}
          </Badge>
        )}
      </Link>

      <CardHeader className="pb-1">
        <Link href={`/courses/${course.id}`}>
          <CardTitle className="line-clamp-2 text-sm leading-snug hover:text-primary transition-colors">
            {course.title}
          </CardTitle>
        </Link>
        <CardDescription className="text-xs">{course.instructorName ?? 'Instructor'}</CardDescription>
      </CardHeader>

      <CardContent className="pb-1">
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({students.toLocaleString()})</span>
        </div>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          {students.toLocaleString()} students
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-2">
        <span className="text-sm font-bold text-primary">{course.price === 0 ? 'Free' : `$${course.price}`}</span>
        <Button
          size="sm"
          variant="outline"
          className="h-7 rounded-full px-3 text-xs"
          onClick={handleAddToCart}
          disabled={adding}
        >
          {adding ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Enroll'}
        </Button>
      </CardFooter>
    </Card>
  )
}

interface RecommendedCoursesProps {
  searchQuery?: string
}

export function RecommendedCourses({ searchQuery }: RecommendedCoursesProps) {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const PAGE_SIZE = 100

  const fetchCourses = useCallback(async (filter?: string) => {
    setLoading(true)
    try {
      const res = await studentService.getCourses(1, PAGE_SIZE, filter)
      setCourses(res.items)
    } catch {
      // error handled by apiClient
    } finally {
      setLoading(false)
    }
  }, [])

  // Reset and search when query changes
  useEffect(() => {
    fetchCourses(searchQuery)
  }, [searchQuery, fetchCourses])

  const title = searchQuery ? `Search results for "${searchQuery}"` : 'Recommended for You'
  const subtitle = searchQuery ? `${courses.length} courses found` : 'Based on latest courses'

  return (
    <section>
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
        {!searchQuery && (
          <Button variant="ghost" size="sm" className="gap-1 text-primary" render={<Link href="/courses" />}>
            View all <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>

      {loading && courses.length === 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-40" />
          <p className="text-sm">No courses found{searchQuery ? ` for "${searchQuery}"` : ''}.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {courses.map((course, idx) => (
            <CourseCard key={course.id} course={course} index={idx} />
          ))}
        </div>
      )}
    </section>
  )
}
