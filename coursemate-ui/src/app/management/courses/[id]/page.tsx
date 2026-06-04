'use client'

import { useEffect, useState, useCallback, type DragEvent } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  GripVertical,
  ChevronRight,
  ChevronDown,
  Video,
  BookOpen,
  Code2,
  FileQuestion
} from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { courseService, chapterService, lessonService } from '@/lib/course-service'
import { Pagination } from '@/components/admin/pagination'
import { LessonType } from '@/lib/types'
import type {
  CourseDto,
  ChapterDto,
  LessonDto,
  CreateChapterRequest,
  UpdateChapterRequest,
  CreateLessonRequest,
  UpdateLessonRequest
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const LESSON_TYPES: LessonType[] = [LessonType.Video, LessonType.Reading, LessonType.Coding, LessonType.Quiz]

const LESSON_TYPE_META: Record<LessonType, { label: string; icon: React.ReactNode }> = {
  [LessonType.Video]: { label: 'Video', icon: <Video className="h-3.5 w-3.5" /> },
  [LessonType.Reading]: { label: 'Bài đọc', icon: <BookOpen className="h-3.5 w-3.5" /> },
  [LessonType.Coding]: { label: 'Lập trình', icon: <Code2 className="h-3.5 w-3.5" /> },
  [LessonType.Quiz]: { label: 'Trắc nghiệm', icon: <FileQuestion className="h-3.5 w-3.5" /> },
  [LessonType.Slide]: { label: 'Trình chiếu', icon: <Video className="h-3.5 w-3.5" /> }
}

const emptyChapterForm = (courseId: string): CreateChapterRequest => ({
  courseId,
  title: '',
  sortOrder: 1
})

const emptyLessonForm = (courseId: string, chapterId: string): CreateLessonRequest => ({
  courseId,
  chapterId,
  title: '',
  lessonType: LESSON_TYPES[0],
  sortOrder: 1
})

function normalizeLessonType(value: unknown): LessonType {
  if (typeof value === 'string' && LESSON_TYPES.includes(value as LessonType)) {
    return value as LessonType
  }
  if (typeof value === 'number') {
    const zeroBasedMap: Record<number, LessonType> = {
      0: LessonType.Video,
      1: LessonType.Reading,
      2: LessonType.Coding,
      3: LessonType.Quiz
    }
    return zeroBasedMap[value] ?? LessonType.Video
  }
  return LessonType.Video
}

type ChapterFormErrors = {
  title?: string
  sortOrder?: string
}

type LessonFormErrors = {
  title?: string
  chapterId?: string
  sortOrder?: string
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [course, setCourse] = useState<CourseDto | null>(null)
  const [courseLoading, setCourseLoading] = useState(true)

  const [chapters, setChapters] = useState<ChapterDto[]>([])
  const [chaptersLoading, setChaptersLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const [lessonsByChapter, setLessonsByChapter] = useState<Record<string, LessonDto[]>>({})
  const [lessonsLoading, setLessonsLoading] = useState(false)

  const [chapterDialog, setChapterDialog] = useState(false)
  const [editingChapter, setEditingChapter] = useState<ChapterDto | null>(null)
  const [chapterForm, setChapterForm] = useState<CreateChapterRequest>(emptyChapterForm(id))
  const [chapterErrors, setChapterErrors] = useState<ChapterFormErrors>({})
  const [savingChapter, setSavingChapter] = useState(false)
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null)

  const [lessonDialog, setLessonDialog] = useState(false)
  const [editingLesson, setEditingLesson] = useState<LessonDto | null>(null)
  const [lessonChapterDisplayName, setLessonChapterDisplayName] = useState('')
  const [lessonForm, setLessonForm] = useState<CreateLessonRequest>(emptyLessonForm(id, ''))
  const [lessonErrors, setLessonErrors] = useState<LessonFormErrors>({})
  const [savingLesson, setSavingLesson] = useState(false)
  const [deleteLessonId, setDeleteLessonId] = useState<string | null>(null)

  const [draggingChapterId, setDraggingChapterId] = useState<string | null>(null)
  const [dropTargetChapterId, setDropTargetChapterId] = useState<string | null>(null)
  const [reorderingChapter, setReorderingChapter] = useState(false)
  const [expandedChapterMap, setExpandedChapterMap] = useState<Record<string, boolean>>({})
  const [draggingLessonId, setDraggingLessonId] = useState<string | null>(null)
  const [draggingLessonChapterId, setDraggingLessonChapterId] = useState<string | null>(null)
  const [dropTargetLessonId, setDropTargetLessonId] = useState<string | null>(null)
  const [reorderingLesson, setReorderingLesson] = useState(false)

  const [showFullDesc, setShowFullDesc] = useState(false)

  const loadCourse = useCallback(async () => {
    setCourseLoading(true)
    try {
      const result = await courseService.getById(id)
      setCourse(result)
    } catch {
      toast.error('Không tìm thấy khóa học.')
    } finally {
      setCourseLoading(false)
    }
  }, [id])

  const loadChapters = useCallback(async () => {
    setChaptersLoading(true)
    try {
      const result = await chapterService.list({ courseId: id, pageSize, pageIndex, sorting: 'position' })
      setChapters(result.items)
      setTotalCount(result.totalCount)
    } finally {
      setChaptersLoading(false)
    }
  }, [id, pageIndex])

  const loadLessonsForChapters = useCallback(async (chapterItems: ChapterDto[]) => {
    if (chapterItems.length === 0) {
      setLessonsByChapter({})
      return
    }
    setLessonsLoading(true)
    try {
      const results = await Promise.all(
        chapterItems.map(chapter =>
          lessonService.list({
            chapterId: chapter.id,
            pageIndex: 0,
            pageSize: 100,
            sorting: 'position'
          })
        )
      )
      const next: Record<string, LessonDto[]> = {}
      chapterItems.forEach((chapter, index) => {
        next[chapter.id] = results[index].items
      })
      setLessonsByChapter(next)
    } finally {
      setLessonsLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadCourse()
  }, [loadCourse])

  useEffect(() => {
    void loadChapters()
  }, [loadChapters])

  useEffect(() => {
    void loadLessonsForChapters(chapters)
  }, [chapters, loadLessonsForChapters])

  useEffect(() => {
    setExpandedChapterMap(prev => {
      const next = { ...prev }
      for (const chapter of chapters) {
        if (!(chapter.id in next)) {
          next[chapter.id] = true
        }
      }
      return next
    })
  }, [chapters])

  function openCreateChapter() {
    setEditingChapter(null)
    setChapterErrors({})
    setChapterForm({ courseId: id, title: '', sortOrder: totalCount + 1 })
    setChapterDialog(true)
  }

  function openEditChapter(chapter: ChapterDto) {
    setEditingChapter(chapter)
    setChapterErrors({})
    setChapterForm({ courseId: chapter.courseId, title: chapter.title, sortOrder: chapter.sortOrder })
    setChapterDialog(true)
  }

  function validateChapterForm(form: CreateChapterRequest): ChapterFormErrors {
    const errors: ChapterFormErrors = {}
    if (!form.title.trim()) {
      errors.title = 'Tiêu đề chương là bắt buộc.'
    } else if (form.title.trim().length < 3) {
      errors.title = 'Tiêu đề chương cần ít nhất 3 ký tự.'
    } else if (form.title.trim().length > 200) {
      errors.title = 'Tiêu đề chương tối đa 200 ký tự.'
    }

    const maxSortOrder = Math.max(totalCount + (editingChapter ? 0 : 1), 1)
    if (!Number.isInteger(form.sortOrder)) {
      errors.sortOrder = 'Thứ tự phải là số nguyên.'
    } else if (form.sortOrder < 1 || form.sortOrder > maxSortOrder) {
      errors.sortOrder = `Thứ tự hợp lệ từ 1 đến ${maxSortOrder}.`
    }
    return errors
  }

  async function saveChapter() {
    const errors = validateChapterForm(chapterForm)
    setChapterErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error('Vui lòng kiểm tra lại thông tin chương.')
      return
    }
    setSavingChapter(true)
    try {
      if (editingChapter) {
        await chapterService.update(editingChapter.id, chapterForm as UpdateChapterRequest)
        toast.success('Đã cập nhật chương.')
      } else {
        await chapterService.create(chapterForm)
        toast.success('Đã tạo chương.')
      }
      setChapterDialog(false)
      await loadChapters()
    } finally {
      setSavingChapter(false)
    }
  }

  async function deleteChapter() {
    if (!deleteChapterId) return
    await chapterService.delete(deleteChapterId)
    toast.success('Đã xóa chương.')
    setDeleteChapterId(null)
    await loadChapters()
  }

  const updateChapterForm = (field: keyof CreateChapterRequest, value: unknown) =>
    setChapterForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' || field === 'sortOrder') {
        const key = field as keyof ChapterFormErrors
        setChapterErrors(current => ({ ...current, [key]: undefined }))
      }
      return next
    })

  async function moveChapter(draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    const fromIndex = chapters.findIndex(ch => ch.id === draggedId)
    const toIndex = chapters.findIndex(ch => ch.id === targetId)
    if (fromIndex < 0 || toIndex < 0) return

    const beforeReorder = [...chapters]
    const reordered = [...chapters]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    setChapters(reordered)

    const newSortOrder = pageIndex * pageSize + toIndex + 1
    setReorderingChapter(true)
    try {
      await chapterService.update(draggedId, {
        courseId: moved.courseId,
        title: moved.title,
        sortOrder: newSortOrder
      })
      toast.success('Đã cập nhật thứ tự chương.')
      await loadChapters()
    } catch {
      setChapters(beforeReorder)
      toast.error('Không thể cập nhật thứ tự chương.')
    } finally {
      setReorderingChapter(false)
      setDraggingChapterId(null)
      setDropTargetChapterId(null)
    }
  }

  async function moveLessonInChapter(chapterId: string, draggedId: string, targetId: string) {
    if (draggedId === targetId) return
    const current = lessonsByChapter[chapterId] ?? []
    const fromIndex = current.findIndex(lesson => lesson.id === draggedId)
    const toIndex = current.findIndex(lesson => lesson.id === targetId)
    if (fromIndex < 0 || toIndex < 0) return

    const beforeReorder = [...current]
    const reordered = [...current]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    setLessonsByChapter(prev => ({ ...prev, [chapterId]: reordered }))
    setReorderingLesson(true)
    try {
      await lessonService.update(draggedId, {
        chapterId: moved.chapterId,
        courseId: moved.courseId,
        title: moved.title,
        lessonType: moved.lessonType,
        sortOrder: toIndex + 1
      })
      toast.success('Đã cập nhật thứ tự bài học.')
      await loadLessonsForChapters(chapters)
    } catch {
      setLessonsByChapter(prev => ({ ...prev, [chapterId]: beforeReorder }))
      toast.error('Không thể cập nhật thứ tự bài học.')
    } finally {
      setReorderingLesson(false)
      setDraggingLessonId(null)
      setDraggingLessonChapterId(null)
      setDropTargetLessonId(null)
    }
  }

  function openCreateLesson(chapter: ChapterDto) {
    setEditingLesson(null)
    setLessonChapterDisplayName(chapter.title)
    setLessonErrors({})
    setLessonForm({
      ...emptyLessonForm(chapter.courseId, chapter.id),
      sortOrder: (lessonsByChapter[chapter.id]?.length ?? 0) + 1
    })
    setLessonDialog(true)
  }

  function openEditLesson(lesson: LessonDto) {
    setEditingLesson(lesson)
    setLessonChapterDisplayName(
      chapters.find(ch => ch.id === lesson.chapterId)?.title || lesson.chapterName || 'Chương không xác định'
    )
    setLessonErrors({})
    setLessonForm({
      chapterId: lesson.chapterId,
      courseId: lesson.courseId,
      title: lesson.title,
      lessonType: normalizeLessonType(lesson.lessonType),
      sortOrder: lesson.sortOrder
    })
    setLessonDialog(true)
  }

  async function saveLesson() {
    const errors = validateLessonForm(lessonForm)
    setLessonErrors(errors)
    if (Object.keys(errors).length > 0) {
      toast.error('Vui lòng kiểm tra lại thông tin bài học.')
      return
    }
    setSavingLesson(true)
    try {
      if (editingLesson) {
        await lessonService.update(editingLesson.id, lessonForm as UpdateLessonRequest)
        toast.success('Đã cập nhật bài học.')
      } else {
        await lessonService.create(lessonForm)
        toast.success('Đã tạo bài học.')
      }
      setLessonDialog(false)
      await loadLessonsForChapters(chapters)
    } finally {
      setSavingLesson(false)
    }
  }

  async function deleteLesson() {
    if (!deleteLessonId) return
    await lessonService.delete(deleteLessonId)
    toast.success('Đã xóa bài học.')
    setDeleteLessonId(null)
    await loadLessonsForChapters(chapters)
  }

  const updateLessonForm = (field: keyof CreateLessonRequest, value: unknown) =>
    setLessonForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'title' || field === 'chapterId' || field === 'sortOrder') {
        const key = field as keyof LessonFormErrors
        setLessonErrors(current => ({ ...current, [key]: undefined }))
      }
      return next
    })

  function validateLessonForm(form: CreateLessonRequest): LessonFormErrors {
    const errors: LessonFormErrors = {}
    if (!form.title.trim()) {
      errors.title = 'Tiêu đề bài học là bắt buộc.'
    } else if (form.title.trim().length < 3) {
      errors.title = 'Tiêu đề bài học cần ít nhất 3 ký tự.'
    } else if (form.title.trim().length > 200) {
      errors.title = 'Tiêu đề bài học tối đa 200 ký tự.'
    }

    if (!form.chapterId) {
      errors.chapterId = 'Vui lòng chọn chương.'
    }

    const siblingCount = lessonsByChapter[form.chapterId]?.length ?? 0
    const maxSortOrder = siblingCount + (editingLesson && editingLesson.chapterId === form.chapterId ? 0 : 1)
    if (!Number.isInteger(form.sortOrder)) {
      errors.sortOrder = 'Thứ tự phải là số nguyên.'
    } else if (form.sortOrder < 1 || form.sortOrder > Math.max(maxSortOrder, 1)) {
      errors.sortOrder = `Thứ tự hợp lệ từ 1 đến ${Math.max(maxSortOrder, 1)}.`
    }
    return errors
  }

  if (courseLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!course) {
    return <div className="text-center py-16 text-muted-foreground">Không tìm thấy khóa học.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.back()}
          className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-semibold truncate">{course.title}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            <span>📂 {course.categoryName}</span>
            <span>👤 {course.instructorName ?? 'Chưa có giảng viên'}</span>
            <span>💵 {formatCurrency(course.price)}</span>
            <Badge variant={course.isPublished ? 'default' : 'secondary'}>
              {course.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
            </Badge>
          </div>
        </div>
      </div>

      {course.description && (
        <div className="rounded-xl bg-card p-6 shadow-md border-0 overflow-hidden flex flex-col">
          <h2 className="text-base font-semibold mb-4">Mô tả khóa học</h2>
          <div className="relative">
            <div
              className={`prose prose-sm max-w-none dark:prose-invert prose-img:rounded-md prose-img:mx-auto transition-all duration-300 ${
                !showFullDesc ? 'max-h-64 overflow-hidden' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: course.description }}
            />
            {!showFullDesc && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-card to-transparent pointer-events-none" />
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFullDesc(!showFullDesc)}
            className="mt-2 self-center text-muted-foreground hover:text-foreground"
          >
            {showFullDesc ? 'Thu gọn' : 'Xem thêm'}
          </Button>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">
            Chương <span className="text-muted-foreground font-normal text-sm">({chapters.length})</span>
          </h2>
          <Button size="sm" onClick={openCreateChapter} className="gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Thêm chương
          </Button>
        </div>

        {chaptersLoading ? (
          <div className="flex h-32 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          </div>
        ) : chapters.length === 0 ? (
          <div className="rounded-xl border-0 -dashed bg-muted/30 shadow-inner py-12 text-center">
            <p className="text-sm text-muted-foreground">Chưa có chương nào.</p>
            <Button size="sm" variant="outline" onClick={openCreateChapter} className="mt-3 gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Thêm chương đầu tiên
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {chapters.map(chapter => {
              const lessons = lessonsByChapter[chapter.id] ?? []
              return (
                <div
                  key={chapter.id}
                  draggable={!reorderingChapter && !savingChapter && !reorderingLesson && !draggingLessonId}
                  onDragStart={(e: DragEvent<HTMLDivElement>) => {
                    e.dataTransfer.effectAllowed = 'move'
                    e.dataTransfer.setData('text/plain', chapter.id)
                    setDraggingChapterId(chapter.id)
                  }}
                  onDragOver={(e: DragEvent<HTMLDivElement>) => {
                    e.preventDefault()
                    if (!draggingChapterId || draggingChapterId === chapter.id) return
                    setDropTargetChapterId(chapter.id)
                  }}
                  onDrop={() => {
                    if (!draggingChapterId) return
                    void moveChapter(draggingChapterId, chapter.id)
                  }}
                  onDragEnd={() => {
                    setDraggingChapterId(null)
                    setDropTargetChapterId(null)
                  }}
                  className={`rounded-xl bg-card shadow-md border-0 p-4 ${
                    draggingChapterId === chapter.id ? 'opacity-40' : ''
                  } ${dropTargetChapterId === chapter.id ? 'ring-2 ring-primary/40' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted/40 text-muted-foreground cursor-grab">
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <button
                      className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md hover:bg-muted/60 text-muted-foreground"
                      onClick={() =>
                        setExpandedChapterMap(prev => ({
                          ...prev,
                          [chapter.id]: !prev[chapter.id]
                        }))
                      }
                    >
                      {expandedChapterMap[chapter.id] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground">
                      <span className="text-sm font-medium">{chapter.sortOrder}</span>
                    </div>
                    <span className="flex-1 font-medium text-sm">{chapter.title}</span>
                    <Button size="sm" variant="outline" onClick={() => openCreateLesson(chapter)} className="gap-1.5">
                      <Plus className="h-3.5 w-3.5" /> Bài học
                    </Button>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => openEditChapter(chapter)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteChapterId(chapter.id)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:-destructive/20 transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>

                  {expandedChapterMap[chapter.id] && (
                    <div className="mt-3 ml-11 space-y-2">
                      {lessonsLoading ? (
                        <div className="text-sm text-muted-foreground">Đang tải bài học...</div>
                      ) : lessons.length === 0 ? (
                        <div className="text-sm text-muted-foreground">Chưa có bài học.</div>
                      ) : (
                        lessons.map(lesson => {
                          const normalizedType = normalizeLessonType(lesson.lessonType)
                          const typeMeta = LESSON_TYPE_META[normalizedType]

                          return (
                            <div
                              key={lesson.id}
                              draggable={!reorderingLesson && !savingLesson}
                              onDragStart={(e: DragEvent<HTMLDivElement>) => {
                                e.stopPropagation()
                                e.dataTransfer.effectAllowed = 'move'
                                e.dataTransfer.setData('text/plain', lesson.id)
                                setDraggingLessonId(lesson.id)
                                setDraggingLessonChapterId(chapter.id)
                              }}
                              onDragOver={(e: DragEvent<HTMLDivElement>) => {
                                e.stopPropagation()
                                if (draggingLessonChapterId !== chapter.id) return
                                e.preventDefault()
                                if (!draggingLessonId || draggingLessonId === lesson.id) return
                                setDropTargetLessonId(lesson.id)
                              }}
                              onDrop={(e: DragEvent<HTMLDivElement>) => {
                                e.stopPropagation()
                                if (!draggingLessonId || draggingLessonChapterId !== chapter.id) return
                                void moveLessonInChapter(chapter.id, draggingLessonId, lesson.id)
                              }}
                              onDragEnd={(e: DragEvent<HTMLDivElement>) => {
                                e.stopPropagation()
                                setDraggingLessonId(null)
                                setDraggingLessonChapterId(null)
                                setDropTargetLessonId(null)
                              }}
                              onClick={() => {
                                if (!draggingLessonId) {
                                  router.push(`/management/lessons/${lesson.id}`)
                                }
                              }}
                              className={`flex items-center gap-3 rounded-lg bg-muted/20 px-3 py-2 hover:bg-muted/40 transition-colors cursor-pointer ${
                                draggingLessonId === lesson.id ? 'opacity-40' : ''
                              } ${dropTargetLessonId === lesson.id ? 'ring-2 ring-primary/40' : ''}`}
                            >
                              <div className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-muted/60 text-muted-foreground cursor-grab">
                                <GripVertical className="h-3 w-3" />
                              </div>
                              <span className="text-xs text-muted-foreground min-w-10">
                                {chapter.sortOrder}.{lesson.sortOrder}
                              </span>
                              <span className="flex-1 text-sm font-medium">{lesson.title}</span>
                              <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="h-7 px-2 text-[11px] font-medium pointer-events-none gap-1.5"
                                >
                                  {typeMeta.icon}
                                  {typeMeta.label}
                                </Button>
                              </div>
                              <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                                <button
                                  onClick={() => openEditLesson(lesson)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                                >
                                  <Pencil className="h-3 w-3" />
                                </button>
                                <button
                                  onClick={() => setDeleteLessonId(lesson.id)}
                                  className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-background text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:-destructive/20 transition-colors"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            </div>
                          )
                        })
                      )}
                    </div>
                  )}
                </div>
              )
            })}

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

      <Dialog open={chapterDialog} onOpenChange={setChapterDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingChapter ? 'Chỉnh sửa chương' : 'Tạo chương mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
              Sắp xếp chương bằng `sortOrder` hoặc kéo-thả trực tiếp trong danh sách.
            </div>
            <div className="space-y-1.5">
              <Label>Tiêu đề chương</Label>
              <Input
                placeholder="Tiêu đề chương"
                value={chapterForm.title}
                onChange={e => updateChapterForm('title', e.target.value)}
                className={chapterErrors.title ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {chapterErrors.title && <p className="text-xs text-destructive">{chapterErrors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Thứ tự</Label>
              <Input
                type="number"
                min={1}
                max={Math.max(totalCount + (editingChapter ? 0 : 1), 1)}
                value={chapterForm.sortOrder}
                onChange={e => updateChapterForm('sortOrder', Number(e.target.value))}
                className={chapterErrors.sortOrder ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {chapterErrors.sortOrder && <p className="text-xs text-destructive">{chapterErrors.sortOrder}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setChapterDialog(false)}>
              Hủy
            </Button>
            <Button onClick={saveChapter} disabled={savingChapter}>
              {savingChapter ? 'Đang lưu...' : editingChapter ? 'Lưu thay đổi' : 'Tạo chương'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={lessonDialog} onOpenChange={setLessonDialog}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingLesson ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 py-2">
            <div className="rounded-lg bg-muted/30 p-4 text-xs text-muted-foreground">
              Click vào bài học trong danh sách để mở giao diện cập nhật chi tiết.
            </div>
            <div className="space-y-1.5">
              <Label>Tiêu đề bài học</Label>
              <Input
                placeholder="Tiêu đề bài học"
                value={lessonForm.title}
                onChange={e => updateLessonForm('title', e.target.value)}
                className={lessonErrors.title ? 'border-destructive focus-visible:ring-destructive/20' : ''}
              />
              {lessonErrors.title && <p className="text-xs text-destructive">{lessonErrors.title}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Chương</Label>
              <Input value={lessonChapterDisplayName} readOnly className="bg-muted/40" />
              <p className="text-xs text-muted-foreground">
                Chương được cố định theo ngữ cảnh, không thể thay đổi tại đây.
              </p>
              {lessonErrors.chapterId && <p className="text-xs text-destructive">{lessonErrors.chapterId}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Loại bài học</Label>
                <Select
                  value={lessonForm.lessonType}
                  onValueChange={lessonType => updateLessonForm('lessonType', lessonType as LessonType)}
                >
                  <SelectTrigger>
                    <SelectValue>
                      <span className="inline-flex items-center gap-2">
                        {LESSON_TYPE_META[lessonForm.lessonType].icon}
                        {LESSON_TYPE_META[lessonForm.lessonType].label}
                      </span>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {LESSON_TYPES.map(type => (
                      <SelectItem key={type} value={type}>
                        <span className="inline-flex items-center gap-2">
                          {LESSON_TYPE_META[type].icon}
                          {LESSON_TYPE_META[type].label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Thứ tự</Label>
                <Input
                  type="number"
                  min={1}
                  value={lessonForm.sortOrder}
                  onChange={e => updateLessonForm('sortOrder', Number(e.target.value))}
                  className={lessonErrors.sortOrder ? 'border-destructive focus-visible:ring-destructive/20' : ''}
                />
                {lessonErrors.sortOrder && <p className="text-xs text-destructive">{lessonErrors.sortOrder}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Hủy
            </Button>
            <Button onClick={saveLesson} disabled={savingLesson}>
              {savingLesson ? 'Đang lưu...' : editingLesson ? 'Lưu thay đổi' : 'Tạo bài học'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteChapterId} onOpenChange={open => !open && setDeleteChapterId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa chương?</AlertDialogTitle>
            <AlertDialogDescription>Toàn bộ bài học trong chương này cũng sẽ bị xóa.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteChapter}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteLessonId} onOpenChange={open => !open && setDeleteLessonId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài học?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={deleteLesson}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
