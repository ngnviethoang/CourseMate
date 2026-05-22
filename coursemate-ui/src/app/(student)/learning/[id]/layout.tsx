'use client'

import { courseService } from '@/lib/course-service'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LessonType, StudentCourseDetailDto } from '@/lib/types'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { PlayCircle, FileText, CheckCircle2, ChevronLeft, Loader2, Code2, HelpCircle, Presentation } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function LearningLayout({ children }: { children: React.ReactNode }) {
  const { id, lessonId } = useParams<{ id: string; lessonId?: string }>()
  const router = useRouter()

  const [course, setCourse] = useState<StudentCourseDetailDto | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) return
      try {
        const res = await courseService.getById(id)
        setCourse((res as unknown as StudentCourseDetailDto) || null)
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <p className="text-muted-foreground text-lg">Không tìm thấy khóa học.</p>
        <Button onClick={() => router.push('/courses')}>Quay lại danh sách khóa học</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-140px)] bg-background">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 -r bg-card/50 flex flex-col shrink-0">
        <div className="p-4 shadow-md border-0 border-b-0 bg-card">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push(`/courses/${id}`)}
            className="mb-2 gap-2 text-muted-foreground hover:text-foreground p-0 h-auto"
          >
            <ChevronLeft className="h-4 w-4" /> Quay lại khóa học
          </Button>
          <h2 className="font-bold text-lg line-clamp-2">{course.title}</h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-500"
                style={{ width: `${course.progressPercentage}%` }}
              />
            </div>
            <span className="text-[10px] font-medium text-muted-foreground">
              {Math.round(course.progressPercentage)}%
            </span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          <Accordion className="space-y-1" type="multiple" defaultValue={course.chapters.map(c => c.id)}>
            {course.chapters.map(chapter => (
              <AccordionItem key={chapter.id} value={chapter.id} className="-none">
                <AccordionTrigger className="hover:no-underline hover:bg-muted/50 px-3 py-2 rounded-lg py-3 text-sm font-semibold transition-all">
                  <div className="flex items-center gap-2 text-left">
                    <span className="text-xs text-muted-foreground font-mono">Ch {chapter.position}</span>
                    <span className="line-clamp-1">{chapter.title}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-1 pb-2 space-y-0.5">
                  {chapter.lessons.map(lesson => {
                    const isActive = lessonId === lesson.id
                    const isCompleted = lesson.isCompleted
                    return (
                      <Link
                        key={lesson.id}
                        href={`/learning/${id}/${lesson.id}`}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors group ${
                          isActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                        }`}
                      >
                        <div className="relative shrink-0">
                          {lesson.lessonType === LessonType.Video ? (
                            <PlayCircle className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-blue-500'}`} />
                          ) : lesson.lessonType === LessonType.Reading ? (
                            <FileText className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-amber-500'}`} />
                          ) : lesson.lessonType === LessonType.Coding ? (
                            <Code2 className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-purple-500'}`} />
                          ) : lesson.lessonType === LessonType.Quiz ? (
                            <HelpCircle className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-orange-500'}`} />
                          ) : lesson.lessonType === LessonType.Slide ? (
                            <Presentation className={`h-4 w-4 ${isActive ? 'text-primary' : 'text-pink-500'}`} />
                          ) : (
                            <CheckCircle2 className={`h-4 w-4 text-emerald-500`} />
                          )}

                          {isCompleted && (
                            <div className="absolute -top-1.5 -right-1.5 bg-white dark:bg-slate-900 rounded-full">
                              <CheckCircle2 className="h-3 w-3 text-emerald-500 fill-emerald-50" />
                            </div>
                          )}
                        </div>
                        <span className="flex-1 line-clamp-1">{lesson.title}</span>
                      </Link>
                    )
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  )
}
