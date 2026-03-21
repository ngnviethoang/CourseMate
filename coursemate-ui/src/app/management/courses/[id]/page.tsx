'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Pencil, Trash2, ChevronDown, ChevronRight, Loader2, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { courseService, chapterService, lessonService } from '@/lib/admin-service'
import type {
  CourseDto,
  ChapterDto,
  LessonDto,
  CreateChapterRequest,
  UpdateChapterRequest,
  CreateLessonRequest,
  UpdateLessonRequest,
  LessonType
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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

const LESSON_TYPES: LessonType[] = ['Video', 'Reading', 'Quiz', 'Coding']

const LESSON_TYPE_COLOR: Record<LessonType, string> = {
  Video: 'bg-blue-500/10 text-blue-600 border-blue-200',
  Reading: 'bg-green-500/10 text-green-600 border-green-200',
  Quiz: 'bg-orange-500/10 text-orange-600 border-orange-200',
  Coding: 'bg-purple-500/10 text-purple-600 border-purple-200'
}

// ─── Chapter modal state ──────────────────────────────────────────────────────
const emptyChapterForm = (courseId: string): CreateChapterRequest => ({
  courseId,
  title: '',
  position: 1
})

// ─── Lesson modal state ───────────────────────────────────────────────────────
const emptyLessonForm = (courseId: string, chapterId: string): CreateLessonRequest => ({
  courseId,
  chapterId,
  title: '',
  lessonType: 'Video',
  position: 1
})

// ─── ChapterRow component ─────────────────────────────────────────────────────
function ChapterRow({
  chapter,
  courseId,
  onEditChapter,
  onDeleteChapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson
}: {
  chapter: ChapterDto
  courseId: string
  onEditChapter: (c: ChapterDto) => void
  onDeleteChapter: (id: string) => void
  onAddLesson: (chapterId: string) => void
  onEditLesson: (l: LessonDto) => void
  onDeleteLesson: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [lessons, setLessons] = useState<LessonDto[]>([])
  const [loadingLessons, setLoadingLessons] = useState(false)
  const [loaded, setLoaded] = useState(false)

  async function toggle() {
    if (!expanded && !loaded) {
      setLoadingLessons(true)
      try {
        const res = await lessonService.list({ chapterId: chapter.id, pageSize: 25, sorting: 'position' })
        setLessons(res.items)
        setLoaded(true)
      } finally {
        setLoadingLessons(false)
      }
    }
    setExpanded(prev => !prev)
  }

  function refreshLessons() {
    lessonService
      .list({ chapterId: chapter.id, pageSize: 25, sorting: 'position' })
      .then(res => setLessons(res.items))
      .catch(() => {})
  }

  // expose refresh upward when a lesson is added/edited/deleted
  useEffect(() => {
    if (loaded && expanded) refreshLessons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded])

  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      {/* Chapter header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-muted/40 transition-colors select-none"
        onClick={toggle}
      >
        <span className="text-muted-foreground">
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </span>
        <span className="flex-1 font-medium text-sm">
          <span className="text-muted-foreground mr-2 text-xs">#{chapter.position}</span>
          {chapter.title}
        </span>
        <div className="flex gap-1" onClick={e => e.stopPropagation()}>
          <button
            onClick={() => onAddLesson(chapter.id)}
            className="inline-flex items-center gap-1 h-7 px-2 rounded-md text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Plus className="h-3 w-3" /> Lesson
          </button>
          <button
            onClick={() => onEditChapter(chapter)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onDeleteChapter(chapter.id)}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Lessons list */}
      {expanded && (
        <div className="border-t bg-muted/20 px-4 py-3 space-y-2">
          {loadingLessons ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          ) : lessons.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-3">No lessons yet. Add your first lesson.</p>
          ) : (
            lessons.map(lesson => (
              <div
                key={lesson.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-background border hover:border-primary/30 transition-colors group"
              >
                <span className="text-xs text-muted-foreground w-4">{lesson.position}</span>
                <BookOpen className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                <span className="flex-1 text-sm">{lesson.title}</span>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full border font-medium ${LESSON_TYPE_COLOR[lesson.lessonType as LessonType]}`}
                >
                  {lesson.lessonType}
                </span>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEditLesson(lesson)}
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-primary transition-colors"
                  >
                    <Pencil className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => {
                      onDeleteLesson(lesson.id)
                      refreshLessons()
                    }}
                    className="inline-flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-destructive transition-colors"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [course, setCourse] = useState<CourseDto | null>(null)
  const [courseLoading, setCourseLoading] = useState(true)

  const [chapters, setChapters] = useState<ChapterDto[]>([])
  const [chaptersLoading, setChaptersLoading] = useState(true)

  // Chapter modal
  const [chapterDialog, setChapterDialog] = useState(false)
  const [editingChapter, setEditingChapter] = useState<ChapterDto | null>(null)
  const [chapterForm, setChapterForm] = useState<CreateChapterRequest>(emptyChapterForm(id))
  const [savingChapter, setSavingChapter] = useState(false)
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null)

  // Lesson modal
  const [lessonDialog, setLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null)
  const [lessonForm, setLessonForm] = useState<CreateLessonRequest>(emptyLessonForm(id, ''))
  const [savingLesson, setSavingLesson] = useState(false)
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null)

  // Load course
  useEffect(() => {
    setCourseLoading(true)
    courseService
      .getById(id)
      .then(c => setCourse(c))
      .catch(() => toast.error('Course not found.'))
      .finally(() => setCourseLoading(false))
  }, [id])

  // Load chapters
  const loadChapters = useCallback(async () => {
    setChaptersLoading(true)
    try {
      const res = await chapterService.list({ courseId: id, pageSize: 25, sorting: 'position' })
      setChapters(res.items)
    } finally {
      setChaptersLoading(false)
    }
  }, [id])

  useEffect(() => {
    loadChapters()
  }, [loadChapters])

  // ─── Chapter handlers ───────────────────────────────────────────────────────
  function openCreateChapter() {
    setEditingChapter(null)
    setChapterForm(emptyChapterForm(id))
    setChapterDialog(true)
  }

  function openEditChapter(c: ChapterDto) {
    setEditingChapter(c)
    setChapterForm({ courseId: c.courseId, title: c.title, position: c.position })
    setChapterDialog(true)
  }

  async function saveChapter() {
    setSavingChapter(true)
    try {
      if (editingChapter) {
        await chapterService.update(editingChapter.id, chapterForm as UpdateChapterRequest)
        toast.success('Chapter updated.')
      } else {
        await chapterService.create(chapterForm)
        toast.success('Chapter created.')
      }
      setChapterDialog(false)
      loadChapters()
    } finally {
      setSavingChapter(false)
    }
  }

  async function deleteChapter() {
    if (!deleteChapterId) return
    await chapterService.delete(deleteChapterId)
    toast.success('Chapter deleted.')
    setDeleteChapterId(null)
    loadChapters()
  }

  // ─── Lesson handlers ────────────────────────────────────────────────────────
  function openAddLesson(chapterId: string) {
    setEditingLesson(null)
    setLessonForm(emptyLessonForm(id, chapterId))
    setLessonDialog(true)
  }

  function openEditLesson(l: LessonDto) {
    setEditingLesson(l)
    setLessonForm({
      courseId: l.courseId,
      chapterId: l.chapterId,
      title: l.title,
      lessonType: l.lessonType,
      position: l.position
    })
    setLessonDialog(true)
  }

  async function saveLesson() {
    setSavingLesson(true)
    try {
      if (editingLesson) {
        await lessonService.update(editingLesson.id, lessonForm as UpdateLessonRequest)
        toast.success('Lesson updated.')
      } else {
        await lessonService.create(lessonForm)
        toast.success('Lesson created.')
      }
      setLessonDialog(false)
    } finally {
      setSavingLesson(false)
    }
  }

  async function deleteLesson() {
    if (!deleteLessonId) return
    await lessonService.delete(deleteLessonId)
    toast.success('Lesson deleted.')
    setDeleteLessonId(null)
  }

  const cf = (field: keyof CreateChapterRequest, value: unknown) =>
    setChapterForm(prev => ({ ...prev, [field]: value }))
  const lf = (field: keyof CreateLessonRequest, value: unknown) => setLessonForm(prev => ({ ...prev, [field]: value }))

  // ─── Render ─────────────────────────────────────────────────────────────────
  if (courseLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return <div className="text-center py-16 text-muted-foreground">Course not found.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.back()}
          className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>📂 {course.categoryName}</span>
            <span>👤 {course.instructorName ?? 'No instructor'}</span>
            <span>💵 ${course.price.toFixed(2)}</span>
            <Badge variant={course.isPublished ? 'default' : 'secondary'}>
              {course.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
          {course.description && (
            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{course.description}</p>
          )}
        </div>
      </div>

      {/* Chapters section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">
            Chapters <span className="text-muted-foreground font-normal text-sm">({chapters.length})</span>
          </h2>
          <Button size="sm" onClick={openCreateChapter} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Chapter
          </Button>
        </div>

        {chaptersLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : chapters.length === 0 ? (
          <div className="rounded-xl border border-dashed py-12 text-center">
            <p className="text-sm text-muted-foreground">No chapters yet.</p>
            <Button size="sm" variant="outline" onClick={openCreateChapter} className="mt-3 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Add first chapter
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            {chapters.map(ch => (
              <ChapterRow
                key={ch.id}
                chapter={ch}
                courseId={id}
                onEditChapter={openEditChapter}
                onDeleteChapter={setDeleteChapterId}
                onAddLesson={openAddLesson}
                onEditLesson={openEditLesson}
                onDeleteLesson={setDeleteLessonId}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Chapter Modal ── */}
      <Dialog open={chapterDialog} onOpenChange={setChapterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingChapter ? 'Edit Chapter' : 'New Chapter'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input
                placeholder="Chapter title"
                value={chapterForm.title}
                onChange={e => cf('title', e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label>Position</Label>
              <Input
                type="number"
                min={1}
                value={chapterForm.position}
                onChange={e => cf('position', Number(e.target.value))}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChapterDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveChapter} disabled={savingChapter}>
              {savingChapter ? 'Saving…' : editingChapter ? 'Save Changes' : 'Create Chapter'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Lesson Modal ── */}
      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Edit Lesson' : 'New Lesson'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Title</Label>
              <Input placeholder="Lesson title" value={lessonForm.title} onChange={e => lf('title', e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label>Type</Label>
                <Select value={lessonForm.lessonType} onValueChange={v => lf('lessonType', v as LessonType)}>
                  <SelectTrigger>
                    <SelectValue>{lessonForm.lessonType}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map(t => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Position</Label>
                <Input
                  type="number"
                  min={1}
                  value={lessonForm.position}
                  onChange={e => lf('position', Number(e.target.value))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Cancel
            </Button>
            <Button onClick={saveLesson} disabled={savingLesson}>
              {savingLesson ? 'Saving…' : editingLesson ? 'Save Changes' : 'Create Lesson'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Chapter Confirm ── */}
      <AlertDialog open={!!deleteChapterId} onOpenChange={open => !open && setDeleteChapterId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chapter?</AlertDialogTitle>
            <AlertDialogDescription>All lessons inside this chapter will also be deleted.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteChapter}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Delete Lesson Confirm ── */}
      <AlertDialog open={!!deleteLessonId} onOpenChange={open => !open && setDeleteLessonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete lesson?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
