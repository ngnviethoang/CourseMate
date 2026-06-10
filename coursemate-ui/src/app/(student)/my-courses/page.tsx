'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Play, CheckCircle2, BarChart2, Loader2, Search, Trophy, Book, PlayCircle } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { courseService } from '@/lib/course-service'
import { StudentMyCourseDto } from '@/lib/types'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CourseCard } from '@/components/(student)/my-courses/course-card'

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<StudentMyCourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async (filter?: string) => {
    try {
      setLoading(true)
      const res = await courseService.getMyCourses(1, 25, filter)
      // Check if res is PagedDto and use .items
      setCourses(res.items || [])
    } catch (error) {
      console.error(error)
      toast.error('Không thể tải danh sách khóa học')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCourses(search)
  }

  const inProgress = courses.filter(c => c.progressPercentage > 0 && c.progressPercentage < 100)
  const completed = courses.filter(c => c.progressPercentage === 100)
  const notStarted = courses.filter(c => c.progressPercentage === 0)

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-7xl px-6 mt-5">
        <div className="rounded-xl border border-border bg-card px-6 py-8 space-y-4">
          <div>
            <div className="flex items-center gap-2.5">
              <BookOpen className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Khoá học của tôi</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Bạn đang sở hữu <span className="font-semibold text-foreground">{courses.length}</span> khoá học.
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <form onSubmit={handleSearch} className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                className="pl-9 h-9 text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <PlayCircle className="h-3.5 w-3.5 text-primary" />
                <span className="text-xs font-semibold text-primary">{inProgress.length}</span>
                <span className="text-xs text-muted-foreground">đang học</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-xs font-semibold text-emerald-600">{completed.length}</span>
                <span className="text-xs text-muted-foreground">hoàn thành</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <Book className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold">{notStarted.length}</span>
                <span className="text-xs text-muted-foreground">chưa học</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
              <Loader2 className="h-12 w-12 animate-spin text-primary relative z-10" />
            </div>
            <p className="text-lg font-medium text-muted-foreground animate-pulse">Đang tải lộ trình học của bạn...</p>
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 bg-card border border-dashed rounded-[2rem] shadow-sm">
            <div className="h-24 w-24 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
              <BookOpen className="h-12 w-12" />
            </div>
            <div className="space-y-3 max-w-md">
              <h3 className="text-2xl font-bold text-foreground">Không tìm thấy khóa học</h3>
              <p className="text-muted-foreground text-lg">
                {search
                  ? `Không có khóa học nào khớp với từ khóa "${search}". Vui lòng thử lại.`
                  : 'Bạn chưa tham gia khóa học nào. Khám phá các khóa học hấp dẫn và bắt đầu hành trình của mình!'}
              </p>
            </div>
            <Link
              href="/courses"
              className={buttonVariants({
                size: 'lg',
                className: 'rounded-full h-14 px-8 text-base shadow-lg shadow-primary/25'
              })}
            >
              Khám phá khóa học ngay
            </Link>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between mb-5">
              <TabsList className="bg-muted/50 p-1 rounded-xl h-11">
                <TabsTrigger
                  value="all"
                  className="rounded-lg px-4 py-1.5 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
                >
                  Tất cả ({courses.length})
                </TabsTrigger>
                <TabsTrigger
                  value="in-progress"
                  className="rounded-lg px-4 py-1.5 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
                >
                  Đang học ({inProgress.length})
                </TabsTrigger>
                <TabsTrigger
                  value="completed"
                  className="rounded-lg px-4 py-1.5 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
                >
                  Hoàn thành ({completed.length})
                </TabsTrigger>
                <TabsTrigger
                  value="not-started"
                  className="rounded-lg px-4 py-1.5 text-xs font-bold data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
                >
                  Chưa học ({notStarted.length})
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {courses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="in-progress" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {inProgress.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {inProgress.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Bạn không có khóa học nào đang học dở dang." />
              )}
            </TabsContent>

            <TabsContent value="completed" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {completed.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {completed.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Bạn chưa hoàn thành khóa học nào. Hãy tiếp tục cố gắng nhé!" />
              )}
            </TabsContent>

            <TabsContent value="not-started" className="mt-0 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {notStarted.length > 0 ? (
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {notStarted.map(course => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <EmptyState message="Bạn không có khóa học nào chưa bắt đầu." />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-20 text-center bg-muted/20 rounded-3xl border border-dashed flex flex-col items-center">
      <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mb-4">
        <Search className="h-8 w-8 text-muted-foreground/50" />
      </div>
      <p className="text-muted-foreground font-medium">{message}</p>
    </div>
  )
}
