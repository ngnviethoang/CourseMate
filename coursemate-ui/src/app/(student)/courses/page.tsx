'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Search, BookOpen, Loader2, Filter, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { courseService } from '@/lib/course-service'
import { categoryService } from '@/lib/category-service'
import { RecommendedCoursesTop5 } from '@/components/home/recommended-courses-top5'
import type { CourseDto, CategoryDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const PAGE_SIZE = 12

export default function CoursesPage() {
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [pageIndex, setPageIndex] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('accessToken='))
  }, [])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.list({ pageSize: 50 })
        setCategories(res.items || [])
      } catch {
        setCategories([])
      }
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        setLoading(true)
        const res = await courseService.list({
          pageIndex: pageIndex - 1,
          pageSize: PAGE_SIZE,
          filter: search || undefined,
          categoryId: selectedCategory || undefined
        })
        if (!cancelled) {
          setCourses(res.items || [])
          setTotalCount(res.totalCount || 0)
        }
      } catch {
        if (!cancelled) toast.error('Không thể tải danh sách khóa học')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [pageIndex, search, selectedCategory])

  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val)
    setPageIndex(1)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))

  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────── */}
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-7 w-7 text-primary" />
            Khám phá khóa học
          </h1>
          <p className="text-muted-foreground mt-2">
            Hơn {totalCount || courses.length} khóa học chất lượng đang chờ bạn
          </p>
        </div>
        <Link
          href="/contests"
          className="text-sm font-semibold text-primary flex items-center gap-1 hover:underline"
        >
          Xem cuộc thi <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      {/* ── Featured Top-5 Recommendation ── */}
      {isLoggedIn && <RecommendedCoursesTop5 source="courses" />}

      {/* ── Search + Category filter ── */}
      <div className="flex flex-col gap-4 rounded-2xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm khóa học, chủ đề, giảng viên…"
            className="h-11 rounded-xl border-border bg-card pl-10 shadow-sm focus-visible:ring-2 focus-visible:ring-primary/30"
            value={search}
            onChange={e => {
              setSearch(e.target.value)
              setPageIndex(1)
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Badge
            variant={selectedCategory === '' ? 'default' : 'outline'}
            className="cursor-pointer"
            onClick={() => handleCategoryChange('')}
          >
            Tất cả
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => handleCategoryChange(cat.id)}
            >
              {cat.name}
            </Badge>
          ))}
        </div>
      </div>

      {/* ── List ─────────────────────────────────────── */}
      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="animate-pulse h-72 bg-muted" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="font-semibold text-foreground">Không tìm thấy khóa học nào</p>
          <p className="text-sm text-muted-foreground mt-1">
            Thử thay đổi từ khóa hoặc chọn danh mục khác
          </p>
        </div>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map(course => (
              <Card
                key={course.id}
                className="group cursor-pointer overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col"
                onClick={() => (window.location.href = `/courses/${course.id}`)}
              >
                <div className="relative h-44 w-full overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={course.imageUrl || 'https://placehold.co/600x400?text=No+Image'}
                    alt={course.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {course.categoryName && (
                    <Badge className="absolute right-2 top-2 bg-black/60 hover:bg-black/60 text-white border-0 backdrop-blur-sm">
                      {course.categoryName}
                    </Badge>
                  )}
                </div>

                <CardHeader className="p-4 pb-2 flex-none">
                  <CardTitle className="line-clamp-2 text-base leading-tight group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="text-xs mt-1">
                    {course.instructorName || 'Đang cập nhật'}
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 pt-0 flex-1">
                  <p className="line-clamp-2 text-sm text-muted-foreground">{course.description}</p>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between border-t mt-auto">
                  <span className="text-lg font-bold text-primary">{formatCurrency(course.price)}</span>
                  <span className="text-xs font-semibold text-primary underline-offset-2 group-hover:underline">
                    Xem chi tiết
                  </span>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1.5">
              <button
                onClick={() => setPageIndex(p => Math.max(1, p - 1))}
                disabled={pageIndex === 1}
                className="flex h-9 items-center gap-1 rounded-lg border bg-card px-3 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                Trước
              </button>
              <span className="text-sm text-muted-foreground px-3">
                Trang {pageIndex} / {totalPages}
              </span>
              <button
                onClick={() => setPageIndex(p => Math.min(totalPages, p + 1))}
                disabled={pageIndex === totalPages}
                className="flex h-9 items-center gap-1 rounded-lg border bg-card px-3 text-sm font-medium hover:bg-accent disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}