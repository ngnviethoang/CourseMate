'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courseService, lessonService } from '@/lib/course-service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CourseDetailDto, LessonType, StudentLessonDetailDto } from '@/lib/types'
import { ChevronLeft, ChevronRight, HelpCircle, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { CodingLessonContent } from '@/components/learning/coding-lesson-content'
import { EmptyLessonContent } from '@/components/learning/empty-lesson-content'
import {
  parseAiContent,
  type AiContent,
  type CodingContent,
  type QuizContent,
  type ReadingContent,
  type VideoContent
} from '@/components/learning/lesson-content.types'
import { QuizLessonContent } from '@/components/learning/quiz-lesson-content'
import { ReadingLessonContent } from '@/components/learning/reading-lesson-content'
import { SlideLessonContent } from '@/components/learning/slide-lesson-content'
import { VideoLessonContent } from '@/components/learning/video-lesson-content'

const lessonTypeLabel: Record<LessonType, string> = {
  [LessonType.Video]: 'Video',
  [LessonType.Reading]: 'Bài đọc',
  [LessonType.Coding]: 'Lập trình',
  [LessonType.Quiz]: 'Trắc nghiệm',
  [LessonType.Slide]: 'Slide'
}

function LessonHeader({
  lessonTitle,
  lessonType,
  prevLessonId,
  nextLessonId,
  courseId,
  onNavigate
}: {
  lessonTitle: string
  lessonType: LessonType
  prevLessonId: string | null
  nextLessonId: string | null
  courseId: string
  onNavigate: (lessonId: string) => void
}) {
  return (
    <div className="border-b border-border bg-background/95 px-6 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Badge variant="secondary" className="shrink-0 text-[10px] font-semibold">
            {lessonTypeLabel[lessonType] ?? lessonType}
          </Badge>
          <h1 className="truncate text-base font-bold">{lessonTitle}</h1>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!prevLessonId}
            onClick={() => prevLessonId && onNavigate(prevLessonId)}
            className="h-8 gap-1 px-3 text-xs"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Bài trước
          </Button>
          <Button
            size="sm"
            disabled={!nextLessonId}
            onClick={() => nextLessonId && onNavigate(nextLessonId)}
            className="h-8 gap-1 px-3 text-xs"
          >
            Bài tiếp theo <ChevronRight className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.assign(`/courses/${courseId}`)}
            className="h-8 px-3 text-xs text-muted-foreground"
          >
            Về khóa học
          </Button>
        </div>
      </div>
    </div>
  )
}

function LessonEmptyState({ courseId }: { courseId: string }) {
  return (
    <div className="flex h-[60vh] flex-col items-center justify-center space-y-4 text-center">
      <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h2 className="text-2xl font-bold">Không tìm thấy bài học</h2>
      <p className="max-w-xs text-muted-foreground">Bài học này có thể đã được di chuyển hoặc xóa khỏi giáo trình.</p>
      <Button onClick={() => window.location.assign(`/courses/${courseId}`)}>Quay lại khóa học</Button>
    </div>
  )
}

export default function StudentLearningPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<StudentLessonDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiContent, setAiContent] = useState<AiContent | null>(null)
  const [prevLessonId, setPrevLessonId] = useState<string | null>(null)
  const [nextLessonId, setNextLessonId] = useState<string | null>(null)
  useEffect(() => {
    const loadContent = async () => {
      if (!lessonId) {
        return
      }

      setLoading(true)

      try {
        const [lessonResponse, courseResponse] = await Promise.all([
          courseService.getLessonDetail(lessonId),
          courseService.getById(id)
        ])

        const lessonDto = lessonResponse as StudentLessonDetailDto
        const courseDto = courseResponse as CourseDetailDto

        setLesson(lessonDto)

        const storedAiContent = localStorage.getItem(`ai_lesson_content_${lessonId}`)
        setAiContent(storedAiContent ? parseAiContent(storedAiContent, lessonDto.lessonType) : null)

        const allLessons = courseDto.chapters.flatMap(chapter => chapter.lessons)
        const currentIndex = allLessons.findIndex(courseLesson => courseLesson.id === lessonId)
        setPrevLessonId(currentIndex > 0 ? allLessons[currentIndex - 1].id : null)
        setNextLessonId(
          currentIndex >= 0 && currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1].id : null
        )
      } catch (error) {
        console.error(error)
        toast.error('Không thể tải nội dung bài học.')
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [id, lessonId])

  useEffect(() => {
    if (!lesson || !lessonId) {
      return
    }

    if ([LessonType.Video, LessonType.Reading, LessonType.Slide].includes(lesson.lessonType)) {
      const timer = setTimeout(async () => {
        try {
          await lessonService.updateProgress(lessonId, true, 100)
        } catch (error) {
          console.error('Failed to auto-complete lesson', error)
        }
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [lesson, lessonId])

  const content = useMemo(() => {
    if (!lesson) {
      return null
    }

    switch (lesson.lessonType) {
      case LessonType.Video:
        if (lesson.videoUrl || aiContent) {
          return (
            <VideoLessonContent
              title={lesson.title}
              videoUrl={lesson.videoUrl}
              content={aiContent && 'segments' in aiContent ? (aiContent as VideoContent) : null}
            />
          )
        }
        return <EmptyLessonContent lessonType={lesson.lessonType} onBack={() => router.push(`/courses/${id}`)} />

      case LessonType.Reading:
        if (lesson.readingContent) {
          return <ReadingLessonContent content={{ title: lesson.title, markdown_content: lesson.readingContent }} />
        }
        if (aiContent && 'markdown_content' in aiContent) {
          return <ReadingLessonContent content={aiContent as ReadingContent} />
        }
        return <EmptyLessonContent lessonType={lesson.lessonType} onBack={() => router.push(`/courses/${id}`)} />

      case LessonType.Quiz:
        if ((lesson.quizQuestions && lesson.quizQuestions.length > 0) || (aiContent && 'questions' in aiContent)) {
          return (
            <QuizLessonContent
              lessonId={lessonId}
              passingScore={lesson.quizPassingScore || 70}
              questions={lesson.quizQuestions}
              aiContent={aiContent && 'questions' in aiContent ? (aiContent as QuizContent) : null}
            />
          )
        }
        return <EmptyLessonContent lessonType={lesson.lessonType} onBack={() => router.push(`/courses/${id}`)} />

      case LessonType.Coding:
        if (lesson.exerciseId || (aiContent && 'test_cases' in aiContent)) {
          return (
            <CodingLessonContent
              lessonId={lessonId}
              exerciseId={lesson.exerciseId}
              fallbackContent={aiContent && 'test_cases' in aiContent ? (aiContent as CodingContent) : null}
            />
          )
        }
        return <EmptyLessonContent lessonType={lesson.lessonType} onBack={() => router.push(`/courses/${id}`)} />

      case LessonType.Slide:
        if (lesson.slideFileUrl) {
          return <SlideLessonContent fileUrl={lesson.slideFileUrl} title={lesson.title} />
        }
        return <EmptyLessonContent lessonType={lesson.lessonType} onBack={() => router.push(`/courses/${id}`)} />

      default:
        return <EmptyLessonContent lessonType={lesson.lessonType} onBack={() => router.push(`/courses/${id}`)} />
    }
  }, [aiContent, id, lesson, lessonId, router])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="animate-pulse text-sm font-medium text-muted-foreground">Đang chuẩn bị không gian học tập...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return <LessonEmptyState courseId={id} />
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-background">
      <LessonHeader
        lessonTitle={lesson.title}
        lessonType={lesson.lessonType}
        prevLessonId={prevLessonId}
        nextLessonId={nextLessonId}
        courseId={id}
        onNavigate={targetLessonId => router.push(`/learning/${id}/${targetLessonId}`)}
      />

      <div className="flex-1 overflow-y-auto bg-muted/20">
        <div className="flex min-h-full w-full flex-col px-3 py-3">
          <div className="w-full h-[calc(100vh-120px)]">{content}</div>
        </div>
      </div>
    </div>
  )
}
