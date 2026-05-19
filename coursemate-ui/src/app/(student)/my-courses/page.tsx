'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Play, CheckCircle2, BarChart2, Loader2, Search } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { courseService } from '@/lib/course-service'
import { StudentMyCourseDto } from '@/lib/types'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'

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
 {/* Header */}
 <div className="shadow-md border-0 border-b-0 bg-muted/30">
 <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
 <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
 <div className="space-y-1">
 <h1 className="text-3xl font-black tracking-tight flex items-center gap-3">
 <div className="h-10 w-10 bg-primary/10 rounded-2xl flex items-center justify-center">
 <BookOpen className="h-6 w-6 text-primary" />
 </div>
 Khoá học của tôi
 </h1>
 <p className="text-muted-foreground ml-13">Bạn đang sở hữu {courses.length} khoá học chất lượng</p>
 </div>

 <form onSubmit={handleSearch} className="relative w-full md:w-80 group">
 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <Input
 placeholder="Tìm khóa học của bạn..."
 className="pl-10 h-11 rounded-2xl bg-background shadow-md border-0 -muted-foreground/20 focus-visible:ring-primary/20"
 value={search}
 onChange={e => setSearch(e.target.value)}
 />
 </form>
 </div>

 {/* Stats */}
 <div className="mt-8 grid grid-cols-3 gap-4 max-w-md">
 <div className="group rounded-2xl bg-card p-4 shadow-md border-0 transition-all hover:-primary/30 hover:shadow-md border-0">
 <p className="text-3xl font-black text-primary group-hover:scale-110 transition-transform origin-left">
 {inProgress.length}
 </p>
 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Đang học</p>
 </div>
 <div className="group rounded-2xl bg-card p-4 shadow-md border-0 transition-all hover:-emerald-500/30 hover:shadow-md border-0">
 <p className="text-3xl font-black text-emerald-600 group-hover:scale-110 transition-transform origin-left">
 {completed.length}
 </p>
 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Hoàn thành</p>
 </div>
 <div className="group rounded-2xl bg-card p-4 shadow-md border-0 transition-all hover:-muted-foreground/30 hover:shadow-md border-0">
 <p className="text-3xl font-black text-muted-foreground group-hover:scale-110 transition-transform origin-left">
 {notStarted.length}
 </p>
 <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mt-1">Chưa học</p>
 </div>
 </div>
 </div>
 </div>

 <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
 {loading ? (
 <div className="flex flex-col items-center justify-center py-20 gap-4">
 <Loader2 className="h-10 w-10 animate-spin text-primary opacity-50" />
 <p className="text-sm font-medium text-muted-foreground">Đang chuẩn bị lộ trình học của bạn...</p>
 </div>
 ) : courses.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/20 border-0 -dashed bg-muted/30 shadow-inner rounded-3xl">
 <div className="h-20 w-20 bg-background rounded-3xl shadow-md border-0 flex items-center justify-center text-muted-foreground rotate-3">
 <BookOpen className="h-10 w-10" />
 </div>
 <div className="space-y-2">
 <h3 className="text-xl font-bold">Chưa có khóa học nào</h3>
 <p className="text-muted-foreground max-w-xs">
 {search
 ? `Không tìm thấy khóa học nào khớp với "${search}"`
 : 'Bắt đầu hành trình chinh phục kiến thức ngay hôm nay!'}
 </p>
 </div>
 <Link href="/courses" className={buttonVariants({ className: 'rounded-2xl h-12 px-8' })}>
 Khám phá khóa học
 </Link>
 </div>
 ) : (
 <div className="space-y-12">
 {/* In progress */}
 {inProgress.length > 0 && (
 <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
 <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
 <div className="h-8 w-1 bg-primary rounded-full transition-all group-hover:h-full" />
 Đang học tập
 </h2>
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {inProgress.map(course => (
 <CourseCard key={course.id} course={course} />
 ))}
 </div>
 </section>
 )}

 {/* Not Started */}
 {notStarted.length > 0 && (
 <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
 <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
 <div className="h-8 w-1 bg-slate-400 rounded-full" />
 Khóa học mới
 </h2>
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {notStarted.map(course => (
 <CourseCard key={course.id} course={course} />
 ))}
 </div>
 </section>
 )}

 {/* Completed */}
 {completed.length > 0 && (
 <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000">
 <h2 className="text-xl font-bold mb-6 flex items-center gap-3">
 <div className="h-8 w-1 bg-emerald-500 rounded-full" />
 Đã hoàn thành
 </h2>
 <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {completed.map(course => (
 <CourseCard key={course.id} course={course} />
 ))}
 </div>
 </section>
 )}
 </div>
 )}
 </div>
 </div>
 )
}

function CourseCard({ course }: { course: StudentMyCourseDto }) {
 const done = course.progressPercentage === 100

 return (
 <div className="group rounded-3xl bg-card shadow-md border-0 overflow-hidden transition-all hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1 flex flex-col h-full ring-1 ring-muted">
 <div className="relative overflow-hidden aspect-[16/9]">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={course.imageUrl || 'https://placehold.co/600x340/6366f1/ffffff?text=Course'}
 alt={course.title}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

 {done && (
 <div className="absolute inset-0 bg-emerald-900/40 backdrop-blur-[2px] flex items-center justify-center animate-in fade-in duration-300">
 <div className="bg-white rounded-full p-3 shadow-xl scale-125">
 <CheckCircle2 className="h-8 w-8 text-emerald-600" />
 </div>
 </div>
 )}

 <Badge className="absolute left-4 top-4 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-0 shadow-xl">
 {course.categoryName}
 </Badge>
 </div>

 <div className="p-6 flex flex-col flex-1">
 <div className="flex-1 space-y-2">
 <h3 className="font-bold text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
 {course.title}
 </h3>
 <p className="text-xs font-medium text-muted-foreground flex items-center gap-2">
 <span className="h-1.5 w-1.5 bg-primary/40 rounded-full" />
 {course.instructorName || 'Giảng viên CourseMate'}
 </p>
 </div>

 {/* Progress */}
 <div className="mt-6 space-y-3">
 <div className="flex justify-between items-end">
 <span className={`text-sm font-black ${done ? 'text-emerald-600' : 'text-foreground'}`}>
 {Math.round(course.progressPercentage)}%
 <span className="text-[10px] font-bold text-muted-foreground uppercase ml-1 tracking-tighter">
 hoàn thành
 </span>
 </span>
 <span className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
 <Clock className="h-3 w-3" />
 {course.completedLessons}/{course.totalLessons} bài học
 </span>
 </div>
 <div className="relative h-2 w-full bg-muted rounded-full overflow-hidden">
 <div
 className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out ${done ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]'}`}
 style={{ width: `${course.progressPercentage}%` }}
 />
 </div>
 </div>

 {/* Last lesson */}
 <p className="mt-4 text-xs font-medium text-muted-foreground line-clamp-1 italic">
 {done
 ? '🎉 Bạn đã hoàn thành khoá học!'
 : course.lastLessonTitle
 ? `Đang học: ${course.lastLessonTitle}`
 : 'Bắt đầu bài học đầu tiên'}
 </p>

 <Link
 href={`/learning/${course.id}`}
 className={buttonVariants({
 variant: done ? 'outline' : 'default',
 className: `mt-6 w-full rounded-2xl h-11 text-xs font-bold transition-all ${!done ? 'shadow-lg shadow-primary/25 hover:shadow-primary/40' : 'hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200'}`
 })}
 >
 {done ? (
 <>
 <BarChart2 className="h-4 w-4 mr-2" /> Xem lại bài học
 </>
 ) : course.progressPercentage === 0 ? (
 <>
 <Play className="h-4 w-4 mr-2 fill-current" /> Bắt đầu học ngay
 </>
 ) : (
 <>
 <Play className="h-4 w-4 mr-2 fill-current" /> Tiếp tục học tập
 </>
 )}
 </Link>
 </div>
 </div>
 )
}
