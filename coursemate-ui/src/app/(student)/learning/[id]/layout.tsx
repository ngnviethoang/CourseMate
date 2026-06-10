'use client'

import { courseService } from '@/lib/course-service'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LessonType, StudentCourseDetailDto } from '@/lib/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import {
  CheckCircle2,
  ChevronLeft,
  Code2,
  FileText,
  HelpCircle,
  Loader2,
  PanelLeftClose,
  PanelLeftOpen,
  PlayCircle,
  Presentation
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

function LessonTypeIcon({ lessonType, isActive }: { lessonType: LessonType; isActive: boolean }) {
  const activeColor = isActive ? 'text-primary' : ''

  switch (lessonType) {
    case LessonType.Video:
      return <PlayCircle className={`h-4 w-4 ${isActive ? activeColor : 'text-blue-500'}`} />
    case LessonType.Reading:
      return <FileText className={`h-4 w-4 ${isActive ? activeColor : 'text-amber-500'}`} />
    case LessonType.Coding:
      return <Code2 className={`h-4 w-4 ${isActive ? activeColor : 'text-purple-500'}`} />
    case LessonType.Quiz:
      return <HelpCircle className={`h-4 w-4 ${isActive ? activeColor : 'text-orange-500'}`} />
    case LessonType.Slide:
      return <Presentation className={`h-4 w-4 ${isActive ? activeColor : 'text-pink-500'}`} />
    default:
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  }
}

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const { id, lessonId } = useParams<{ id: string; lessonId?: string }>()
  const router = useRouter()

  const [course, setCourse] = useState<StudentCourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        return
      }

      try {
        const response = await courseService.getById(id)
        setCourse((response as unknown as StudentCourseDetailDto) || null)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-muted/20">
        <p className="text-lg text-muted-foreground">Không tìm thấy khóa học.</p>
        <Button onClick={() => router.push('/courses')}>Quay lại danh sách khóa học</Button>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-muted/20">
      <aside
        className={`shrink-0 overflow-hidden border-r border-border bg-background shadow-xl transition-[width] duration-300 ${
          sidebarOpen ? 'w-[320px]' : 'w-0'
        }`}
      >
        {sidebarOpen && (
          <div className="flex h-full w-[320px] flex-col">
            <div className="border-border px-3.5 py-3.5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/courses/${id}`)}
                className="mb-2.5 h-auto gap-1.5 p-0 text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Quay lại khóa học
              </Button>

              <div className="space-y-2.5 rounded-xl border border-border bg-muted/10 p-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-primary">Khóa học</p>
                    <h2 className="line-clamp-2 text-sm font-bold leading-snug">{course.title}</h2>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setSidebarOpen(false)}
                    className="h-7 w-7 shrink-0 rounded-lg"
                  >
                    <PanelLeftClose className="h-3.5 w-3.5" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-muted-foreground">Tiến độ học tập</span>
                    <span className="text-[10px] font-semibold text-emerald-600">
                      {Math.round(course.progressPercentage)}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-500"
                      style={{ width: `${course.progressPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-2.5 py-2.5">
              <Accordion
                className="space-y-2.5"
                type="multiple"
                defaultValue={course.chapters.map(chapter => chapter.id)}
              >
                {course.chapters.map(chapter => (
                  <AccordionItem
                    key={chapter.id}
                    value={chapter.id}
                    className="overflow-hidden rounded-xl border border-border bg-background shadow-sm"
                  >
                    <AccordionTrigger className="px-3.5 py-3 text-[13px] font-semibold transition-colors hover:bg-accent/50 hover:no-underline">
                      <div className="flex items-center gap-3 text-left">
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                          Ch.{chapter.sortOrder}
                        </span>
                        <span className="line-clamp-2">{chapter.title}</span>
                      </div>
                    </AccordionTrigger>

                    <AccordionContent className="border-t border-border bg-muted/10 px-2 py-2">
                      <div className="space-y-1">
                        {chapter.lessons.map(lesson => {
                          const isActive = lessonId === lesson.id

                          return (
                            <Link
                              key={lesson.id}
                              href={`/learning/${id}/${lesson.id}`}
                              className={`flex items-center gap-2.5 rounded-lg border px-2.5 py-2.5 text-[13px] transition-all ${
                                isActive
                                  ? 'border-primary/25 bg-primary/10 text-foreground shadow-sm'
                                  : 'border-transparent bg-background text-muted-foreground hover:border-border hover:bg-accent/40 hover:text-foreground'
                              }`}
                            >
                              <div className="relative shrink-0">
                                <LessonTypeIcon lessonType={lesson.lessonType} isActive={isActive} />

                                {lesson.isCompleted && (
                                  <div className="absolute -right-1 -top-1 rounded-full bg-background">
                                    <CheckCircle2 className="h-3 w-3 fill-emerald-50 text-emerald-500" />
                                  </div>
                                )}
                              </div>

                              <span className="flex-1 line-clamp-2">{lesson.title}</span>
                            </Link>
                          )
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        )}
      </aside>

      <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="absolute left-3 top-3 z-20 h-8 w-8 rounded-lg border-border bg-background shadow-lg"
          >
            <PanelLeftOpen className="h-3.5 w-3.5" />
          </Button>
        )}

        <div className="flex-1 overflow-hidden">{children}</div>
      </main>
    </div>
  )
}
