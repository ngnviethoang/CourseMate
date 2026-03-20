'use client'

import Link from 'next/link'
import { BookOpen, Clock, Play, CheckCircle2, Lock, BarChart2 } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// ─── Mock data ────────────────────────────────────────────────────────────────

const MY_COURSES = [
  {
    id: 'c1',
    title: 'Next.js 15 – Full Stack Development',
    instructor: 'Lee Robinson',
    imageUrl: 'https://placehold.co/600x340/6366f1/ffffff?text=Next.js+15',
    progress: 68,
    totalLessons: 84,
    completedLessons: 57,
    category: 'Phát triển web',
    lastLesson: 'Server Components & Data Fetching'
  },
  {
    id: 'c2',
    title: 'React – The Complete Guide (Hooks, Redux, TypeScript)',
    instructor: 'Maximilian Schwarzmüller',
    imageUrl: 'https://placehold.co/600x340/0ea5e9/ffffff?text=React',
    progress: 35,
    totalLessons: 60,
    completedLessons: 21,
    category: 'Phát triển web',
    lastLesson: 'useEffect & Side Effects'
  },
  {
    id: 'c3',
    title: 'Advanced CSS & Sass: Flexbox, Grid, Animations',
    instructor: 'Jonas Schmedtmann',
    imageUrl: 'https://placehold.co/600x340/a855f7/ffffff?text=CSS+Sass',
    progress: 100,
    totalLessons: 48,
    completedLessons: 48,
    category: 'Thiết kế',
    lastLesson: 'Đã hoàn thành'
  },
  {
    id: 'c4',
    title: 'Machine Learning A-Z: Python & R in Data Science',
    instructor: 'Kirill Eremenko',
    imageUrl: 'https://placehold.co/600x340/f59e0b/ffffff?text=ML',
    progress: 12,
    totalLessons: 110,
    completedLessons: 13,
    category: 'Data Science',
    lastLesson: 'Regression Models'
  }
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function MyCoursesPage() {
  const inProgress = MY_COURSES.filter(c => c.progress > 0 && c.progress < 100)
  const completed = MY_COURSES.filter(c => c.progress === 100)
  const notStarted = MY_COURSES.filter(c => c.progress === 0)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Khoá học của tôi
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Bạn đang học {MY_COURSES.length} khoá học
          </p>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-4 max-w-sm">
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-primary">{inProgress.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Đang học</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-emerald-600">{completed.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Hoàn thành</p>
            </div>
            <div className="rounded-xl border bg-card p-3 text-center">
              <p className="text-2xl font-bold text-muted-foreground">{notStarted.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Chưa học</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">
        {/* In progress */}
        {inProgress.length > 0 && (
          <section>
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <Play className="h-4 w-4 text-primary" /> Đang học
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {inProgress.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}

        {/* Completed */}
        {completed.length > 0 && (
          <section>
            <h2 className="text-base font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Đã hoàn thành
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completed.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function CourseCard({ course }: { course: typeof MY_COURSES[0] }) {
  const done = course.progress === 100

  return (
    <div className="group rounded-2xl border bg-card overflow-hidden transition-shadow hover:shadow-md">
      <div className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.imageUrl}
          alt={course.title}
          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {done && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <CheckCircle2 className="h-10 w-10 text-white" />
          </div>
        )}
        <Badge className="absolute left-3 top-3 bg-background/90 text-foreground text-xs shadow-sm">
          {course.category}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 leading-snug">{course.title}</h3>
        <p className="text-xs text-muted-foreground mt-1">{course.instructor}</p>

        {/* Progress */}
        <div className="mt-3 space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span className={done ? 'text-emerald-600 font-medium' : 'text-foreground font-medium'}>
              {course.progress}% hoàn thành
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {course.completedLessons}/{course.totalLessons} bài
            </span>
          </div>
          <Progress value={course.progress} className={done ? '[&>div]:bg-emerald-500' : ''} />
        </div>

        {/* Last lesson */}
        <p className="mt-2 text-xs text-muted-foreground line-clamp-1">
          {done ? '🎉 Bạn đã hoàn thành khoá học!' : `Đang học: ${course.lastLesson}`}
        </p>

        <Button
          size="sm"
          variant={done ? 'outline' : 'default'}
          className="mt-3 w-full rounded-xl h-8 text-xs"
          render={<Link href={`/courses/${course.id}`} />}
        >
          {done ? (
            <><BarChart2 className="h-3.5 w-3.5 mr-1" /> Xem lại</>
          ) : course.progress === 0 ? (
            <><Play className="h-3.5 w-3.5 mr-1" /> Bắt đầu học</>
          ) : (
            <><Play className="h-3.5 w-3.5 mr-1" /> Tiếp tục học</>
          )}
        </Button>
      </div>
    </div>
  )
}
