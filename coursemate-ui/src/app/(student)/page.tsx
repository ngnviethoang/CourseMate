'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { BookOpen, Search } from 'lucide-react'
import { categoryService } from '@/lib/category-service'
import { courseService } from '@/lib/course-service'
import { CourseDto, CategoryDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

export default function CatalogPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<CourseDto[]>([])
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.list({ pageSize: 50, hasCourse: true })
        setCategories(res.items || [])
      } catch {}
    }
    fetchCategories()
  }, [])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await courseService.list({ pageIndex: 0, pageSize: 50, filter: search })
        if (!cancelled) setCourses(res.items || [])
      } catch {
        if (!cancelled) toast.error('Không thể tải danh sách khóa học.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    setLoading(true)
    load()
    return () => {
      cancelled = true
    }
  }, [search])

  const filteredCourses = selectedCategory ? courses.filter(c => c.categoryId === selectedCategory) : courses

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Hero */}
      <div className="mx-4 mt-6 rounded-[2rem] border border-border/80 relative bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden shadow-sm animate-in fade-in duration-500">
        <div className="pointer-events-none absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-5 sm:px-6">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
            <div className="h-9 w-9 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner border border-primary/20">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            Khám phá khóa học
          </h1>
          <p className="text-muted-foreground text-sm ml-[48px] max-w-xl">Tìm những khóa học phù hợp nhất với bạn.</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Search + category filter pills */}
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="group relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
            <Input
              type="search"
              placeholder="Tìm kiếm khóa học..."
              className="h-10 rounded-full border-input bg-card pl-9 shadow-sm transition-all hover:border-primary/40 focus-visible:ring-primary/30"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
            <button
              type="button"
              className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                selectedCategory === ''
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              }`}
              onClick={() => setSelectedCategory('')}
            >
              Tất cả
            </button>
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                className={`cursor-pointer rounded-full px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                }`}
                onClick={() => setSelectedCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm"
              >
                <div className="h-44 bg-muted" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-16 rounded-full bg-muted" />
                  <div className="h-4 w-3/4 rounded-full bg-muted" />
                  <div className="h-3 w-1/2 rounded-full bg-muted" />
                  <div className="flex items-center justify-between pt-2">
                    <div className="h-5 w-20 rounded-full bg-muted" />
                    <div className="h-8 w-24 rounded-full bg-muted" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border/60 bg-card/50 py-20 text-muted-foreground animate-in fade-in zoom-in-95 duration-500">
            <BookOpen className="h-12 w-12 opacity-30" />
            <p className="text-sm">Không tìm thấy khóa học nào.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCourses.map((course, idx) => (
              <div
                key={course.id}
                style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500"
              >
                <div
                  className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
                  onClick={() => router.push(`/courses/${course.id}`)}
                >
                  {/* Thumbnail */}
                  <div className="relative overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={course.imageUrl || 'https://placehold.co/600x400?text=Khong+anh'}
                      alt={course.title}
                      className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/10" />
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-4">
                    {course.categoryName && (
                      <span className="mb-2 w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                        {course.categoryName}
                      </span>
                    )}

                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
                      {course.title}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {course.instructorName || 'Không rõ giảng viên'}
                    </p>

                    <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground/80">
                      {course.description}
                    </p>

                    <div className="flex-1" />

                    <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                      <span className="text-base font-bold text-primary">{formatCurrency(course.price)}</span>
                      <Button
                        size="sm"
                        variant="default"
                        className="rounded-full shadow-md shadow-primary/20 transition-all group-hover:shadow-lg group-hover:shadow-primary/30"
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
