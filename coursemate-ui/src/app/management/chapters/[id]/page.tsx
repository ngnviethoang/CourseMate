'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2, BookOpen, Sparkles, FileText } from 'lucide-react'
import { toast } from 'sonner'
import { chapterService, lessonService, courseService } from '@/lib/course-service'
import { lessonMaterialService } from '@/lib/lesson-material-service'
import { Pagination } from '@/components/admin/pagination'
import { ChapterDto, LessonDto, CreateLessonRequest, LessonType, CourseDto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

// ─── Constants ─────────────────────────────────────────────────────────────────

const LESSON_TYPE_COLOR: Record<string | number, string> = {
  [LessonType.Video]: 'bg-blue-500/10 text-blue-600 border-blue-200',
  [LessonType.Reading]: 'bg-green-500/10 text-green-600 border-green-200',
  [LessonType.Quiz]: 'bg-orange-500/10 text-orange-600 border-orange-200',
  [LessonType.Coding]: 'bg-purple-500/10 text-purple-600 border-purple-200',
  [LessonType.Slide]: 'bg-teal-500/10 text-teal-600 border-teal-200',
  1: 'bg-blue-500/10 text-blue-600 border-blue-200',
  2: 'bg-green-500/10 text-green-600 border-green-200',
  3: 'bg-purple-500/10 text-purple-600 border-purple-200',
  4: 'bg-orange-500/10 text-orange-600 border-orange-200',
  5: 'bg-teal-500/10 text-teal-600 border-teal-200'
}

const LESSON_TYPE_ICON: Record<string | number, string> = {
  [LessonType.Video]: '🎬',
  [LessonType.Reading]: '📖',
  [LessonType.Quiz]: '📝',
  [LessonType.Coding]: '💻',
  [LessonType.Slide]: '📽️',
  1: '🎬', 2: '📖', 3: '💻', 4: '📝', 5: '📽️'
}

const getLessonTypeLabel = (type: any) => {
  if (type === LessonType.Video || type === 1) return 'Video'
  if (type === LessonType.Reading || type === 2) return 'Reading'
  if (type === LessonType.Coding || type === 3) return 'Coding'
  if (type === LessonType.Quiz || type === 4) return 'Quiz'
  if (type === LessonType.Slide || type === 5) return 'Slide'
  return type
}



// ─── AI Content Storage Key ─────────────────────────────────────────────────────

export const AI_CONTENT_KEY = (lessonId: string) => `ai_lesson_content_${lessonId}`

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyLessonForm = (courseId: string, chapterId: string): CreateLessonRequest => ({
  courseId,
  chapterId,
  title: '',
  lessonType: LessonType.Video,
  position: 0
})

// ─── Main Component ────────────────────────────────────────────────────────────

export default function ChapterDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [chapter, setChapter] = useState<ChapterDto | null>(null)
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [chapterLoading, setChapterLoading] = useState(true)

  const [lessons, setLessons] = useState<LessonDto[]>([])
  const [lessonsLoading, setLessonsLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  // Lesson modal
  const [lessonDialog, setLessonDialog] = useState(false)
  const [lessonForm, setLessonForm] = useState<CreateLessonRequest>(emptyLessonForm('', id))
  const [savingLesson, setSavingLesson] = useState(false)
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null)



  // Load chapter and course
  useEffect(() => {
    const loadChapter = async () => {
      setChapterLoading(true)
      try {
        const ch = await chapterService.getById(id)
        setChapter(ch)
        setLessonForm(emptyLessonForm(ch?.courseId || '', id))
        if (ch?.courseId) {
          try {
            const c = await courseService.getById(ch.courseId)
            setCourse(c)
          } catch { }
        }
      } catch {
        toast.error('Chapter not found.')
      } finally {
        setChapterLoading(false)
      }
    }
    loadChapter()
  }, [id])

  const loadLessons = useCallback(async () => {
    setLessonsLoading(true)
    try {
      const res = await lessonService.list({ chapterId: id, pageSize, pageIndex, sorting: 'position' })
      setLessons(res.items)
      setTotalCount(res.totalCount)
    } catch {
      toast.error('Failed to load lessons')
    } finally {
      setLessonsLoading(false)
    }
  }, [id, pageIndex])

  useEffect(() => {
    loadLessons()
  }, [loadLessons])

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function openAddLesson() {
    setLessonForm(emptyLessonForm(chapter?.courseId || '', id))
    setLessonDialog(true)
  }

  async function saveLesson() {
    if (!lessonForm.title.trim()) {
      toast.error('Please enter a lesson title.')
      return
    }
    setSavingLesson(true)
    try {
      const result = await lessonService.create(lessonForm)
      toast.success('Lesson created!')
      setLessonDialog(false)
      loadLessons()
      router.push(`/management/lessons/${result.id}`)
    } catch {
      toast.error('Failed to create lesson')
    } finally {
      setSavingLesson(false)
    }
  }



  async function deleteLesson() {
    if (!deleteLessonId) return
    try {
      await lessonService.delete(deleteLessonId)
      localStorage.removeItem(AI_CONTENT_KEY(deleteLessonId))
      toast.success('Lesson deleted.')
      loadLessons()
    } catch {
      toast.error('Failed to delete lesson')
    } finally {
      setDeleteLessonId(null)
    }
  }

  const lf = (field: keyof CreateLessonRequest, value: unknown) => setLessonForm(prev => ({ ...prev, [field]: value }))

  if (chapterLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!chapter) {
    return <div className="text-center py-16 text-muted-foreground">Chapter not found.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push(`/management/courses/${chapter.courseId}`)}
          className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Link
              href={`/management/courses/${chapter.courseId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {course ? course.title : chapter.courseName || 'Course'}
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm text-muted-foreground">Chapter {chapter.position}</span>
          </div>
          <h1 className="text-2xl font-semibold truncate">{chapter.title}</h1>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <h2 className="text-base font-semibold">Basic Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Title</span>
            <p className="font-medium">{chapter.title}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Position</span>
            <p className="font-medium">{chapter.position}</p>
          </div>
        </div>
      </div>

      {/* Lessons section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold">
            Lessons <span className="text-muted-foreground font-normal text-sm">({lessons.length})</span>
          </h2>
          <Button size="sm" onClick={openAddLesson} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Lesson
          </Button>
        </div>

        {lessonsLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : lessons.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">No lessons yet.</p>
            <Button size="sm" variant="outline" onClick={openAddLesson} className="mt-3 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add first lesson
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map(lesson => (
              <div
                key={lesson.id}
                onClick={() => router.push(`/management/lessons/${lesson.id}`)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border shadow-sm hover:border-primary/30 transition-colors group cursor-pointer select-none"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                  <span className="text-xs font-medium">{lesson.position}</span>
                </div>
                <span className="text-base">{LESSON_TYPE_ICON[lesson.lessonType]}</span>
                <span className="flex-1 font-medium">{lesson.title}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${LESSON_TYPE_COLOR[lesson.lessonType]}`}
                >
                  {getLessonTypeLabel(lesson.lessonType)}
                </span>
                <div className="flex gap-1.5 ml-2" onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setDeleteLessonId(lesson.id)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md border bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-2">
              <Pagination
                pageIndex={pageIndex}
                pageSize={pageSize}
                totalCount={totalCount}
                onPageChange={setPageIndex}
              />
            </div>
          </div>
        )}
      </div>

      {/* ── Lesson Modal ── */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              New Lesson
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Basic fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label>
                  Lesson Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  placeholder="Nhập tên bài học..."
                  value={lessonForm.title}
                  onChange={e => lf('title', e.target.value)}
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label>Type</Label>
                <Select value={lessonForm.lessonType} onValueChange={v => lf('lessonType', v as LessonType)}>
                  <SelectTrigger>
                    <SelectValue>
                      {LESSON_TYPE_ICON[lessonForm.lessonType]} {lessonForm.lessonType}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(LessonType).map(t => (
                      <SelectItem key={t} value={t}>
                        <span className="flex items-center gap-2">
                          {LESSON_TYPE_ICON[t as LessonType]} {t}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveLesson} disabled={savingLesson || !lessonForm.title.trim()}>
              {savingLesson ? 'Saving…' : 'Create Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <AlertDialog open={!!deleteLessonId} onOpenChange={open => !open && setDeleteLessonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. AI content for this lesson will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteLesson}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
