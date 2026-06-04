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
      {/* Premium Header */}
      <div className="mx-4 mt-6 rounded-[2rem] border border-border/80 relative bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden shadow-sm">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-black tracking-tight flex items-center gap-3 text-foreground">
                <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center shadow-inner border border-primary/20">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                Khoá học của tôi
              </h1>
              <p className="text-muted-foreground text-sm ml-[52px] max-w-xl">
                Bạn đang sở hữu <span className="font-bold text-foreground">{courses.length}</span> khoá học.
              </p>
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              </div>
              <Input
                placeholder="Tìm kiếm khóa học..."
                className="pl-10 h-10 rounded-2xl bg-background/80 backdrop-blur-md shadow-sm border-muted/50 hover:border-primary/50 focus-visible:ring-primary/30 transition-all text-sm"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </form>
          </div>

          {/* Stats Cards */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl">
            <div className="group rounded-xl bg-background/60 backdrop-blur-md p-3 border border-primary/20 shadow-sm transition-all hover:bg-primary/5 hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Đang học</p>
                <PlayCircle className="h-4 w-4 text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-2xl font-black text-foreground">{inProgress.length}</p>
            </div>

            <div className="group rounded-xl bg-background/60 backdrop-blur-md p-3 border border-emerald-500/20 shadow-sm transition-all hover:bg-emerald-500/5 hover:border-emerald-500/40 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Hoàn thành</p>
                <CheckCircle2 className="h-4 w-4 text-emerald-600/50 group-hover:text-emerald-600 transition-colors" />
              </div>
              <p className="text-2xl font-black text-foreground">{completed.length}</p>
            </div>

            <div className="group rounded-xl bg-background/60 backdrop-blur-md p-3 border border-red-500/20 shadow-sm transition-all hover:bg-red-500/5 hover:border-red-500/40 hover:shadow-md hover:-translate-y-0.5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Chưa học</p>
                <Book className="h-4 w-4 text-red-600/50 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-2xl font-black text-foreground">{notStarted.length}</p>
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
