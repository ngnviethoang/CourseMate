'use client'

import 'react-quill-new/dist/quill.snow.css'
import { useEffect, useState, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import { useParams, useRouter } from 'next/navigation'
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr'
import {
  ArrowLeft,
  Loader2,
  Save,
  Edit,
  Video,
  BookOpen,
  Code2,
  FileQuestion,
  Presentation,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  FileText,
  RefreshCw,
  UploadCloud
} from 'lucide-react'
import { toast } from 'sonner'
import { lessonService, chapterService, courseService } from '@/lib/course-service'
import { lessonMaterialService, type LessonMaterialPromptType } from '@/lib/lesson-material-service'
import { exerciseService } from '@/lib/exercise-service'
import { getAccessToken } from '@/lib/auth-token.util'
import {
  LessonDto,
  ChapterDto,
  CourseDto,
  LessonType,
  LessonDetailDto,
  LectureOutline,
  OutlineDto,
  ExerciseDto,
  ExerciseDetailDto,
  QuizQuestionDto,
  QuizAnswerDto
} from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'
import { VideoUploadSection } from './video-upload'
import { AiMaterialSection } from './ai-material-section'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

// ─── Lesson Type Icon & Color ─────────────────────────────────────────────────
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

type DocumentProcessedNotification = {
  lessonId?: string
  LessonId?: string
  message?: string
  Message?: string
}

const TYPE_META: Record<LessonType, { icon: React.ReactNode; label: string; color: string }> = {
  [LessonType.Video]: {
    icon: <Video className="h-4 w-4" />,
    label: 'Video',
    color: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
  },
  [LessonType.Reading]: {
    icon: <BookOpen className="h-4 w-4" />,
    label: 'Bài đọc',
    color:
      'bg-green-100 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20'
  },
  [LessonType.Coding]: {
    icon: <Code2 className="h-4 w-4" />,
    label: 'Lập trình',
    color:
      'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-400 dark:border-orange-500/20'
  },
  [LessonType.Quiz]: {
    icon: <FileQuestion className="h-4 w-4" />,
    label: 'Trắc nghiệm',
    color:
      'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20'
  },
  [LessonType.Slide]: {
    icon: <Presentation className="h-4 w-4" />,
    label: 'Trình chiếu',
    color: 'bg-pink-100 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/20'
  }
}

function normalizeLessonType(value: unknown): LessonType {
  if (typeof value === 'string') {
    if (Object.values(LessonType).includes(value as LessonType)) {
      return value as LessonType
    }

    const asNumber = Number(value)
    if (!Number.isNaN(asNumber)) {
      value = asNumber
    }
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

function normalizeText(input?: string | null): string {
  return (input ?? '').replace(/\s+/g, ' ').trim()
}

function uniqueNonEmpty(values: string[]): string[] {
  const seen = new Set<string>()
  const normalized: string[] = []
  for (const value of values) {
    const item = normalizeText(value)
    if (!item || seen.has(item.toLowerCase())) continue
    seen.add(item.toLowerCase())
    normalized.push(item)
  }
  return normalized
}

function buildReadingContentFromOutline(outline: LectureOutline): string {
  const parts: string[] = []
  const lessonTitle = normalizeText(outline.lessonTitle)
  if (lessonTitle) {
    parts.push(`<h1>${lessonTitle}</h1>`)
  }

  const slides = outline.slides ?? []
  slides.forEach((slide, index) => {
    const slideTitle = normalizeText(slide.title) || `Phần ${index + 1}`
    parts.push(`<h2>${slideTitle}</h2>`)

    const bullets = uniqueNonEmpty(slide.bullets ?? [])
    const bulletItems = bullets.length > 0 ? bullets : ['(Nội dung đang được cập nhật)']
    parts.push('<ul>' + bulletItems.map(b => `<li>${b}</li>`).join('') + '</ul>')

    const relatedLinks = uniqueNonEmpty(slide.relatedLinks ?? [])
    if (relatedLinks.length > 0) {
      parts.push('<p><strong>Tài liệu tham khảo:</strong></p>')
      parts.push('<ul>' + relatedLinks.map(link => `<li>${link}</li>`).join('') + '</ul>')
    }
  })

  const courseLinks = uniqueNonEmpty(outline.relatedLinks ?? [])
  if (courseLinks.length > 0) {
    parts.push('<h2>Tài liệu liên quan</h2>')
    parts.push('<ul>' + courseLinks.map(link => `<li>${link}</li>`).join('') + '</ul>')
  }

  return parts.join('')
}

function buildQuizDraftFromOutline(outline: LectureOutline): {
  description: string
  questions: QuizQuestionDto[]
} {
  const slides = outline.slides ?? []
  const allBullets = uniqueNonEmpty(slides.flatMap(slide => slide.bullets ?? []))
  const fallbackWrongAnswers = [
    'Nội dung này không xuất hiện trong tài liệu.',
    'Nhận định này không được đề cập trong phần tương ứng.',
    'Thông tin này trái với ý chính của tài liệu.',
    'Đây là chi tiết không có trong tài liệu nguồn.'
  ]

  const questions = slides
    .slice(0, 10)
    .map((slide, index): QuizQuestionDto | null => {
      const slideTitle = normalizeText(slide.title) || `Phần ${index + 1}`
      const slideBullets = uniqueNonEmpty(slide.bullets ?? [])
      const correctAnswer = slideBullets[0] || `Ý chính của phần "${slideTitle}".`

      const wrongAnswerPool = uniqueNonEmpty([
        ...slideBullets.slice(1),
        ...allBullets.filter(item => item !== correctAnswer && !slideBullets.includes(item)),
        ...fallbackWrongAnswers
      ])

      const wrongAnswers = wrongAnswerPool.filter(item => item !== correctAnswer).slice(0, 3)
      const answerTexts = [correctAnswer, ...wrongAnswers]

      if (answerTexts.length < 2) return null

      const answers: QuizAnswerDto[] = answerTexts.map((text, answerIndex) => ({
        text,
        isCorrect: answerIndex === 0,
        position: answerIndex
      }))

      return {
        text: `Ý nào sau đây thuộc nội dung phần "${slideTitle}"?`,
        position: index,
        answers
      }
    })
    .filter((question): question is QuizQuestionDto => question !== null)

  if (questions.length === 0 && allBullets.length > 0) {
    const [firstBullet, ...restBullets] = allBullets
    const wrongAnswers = uniqueNonEmpty([...restBullets, ...fallbackWrongAnswers])
      .filter(item => item !== firstBullet)
      .slice(0, 3)
    const fallbackAnswers = [firstBullet, ...wrongAnswers].slice(0, 4)
    if (fallbackAnswers.length >= 2) {
      questions.push({
        text: 'Ý nào sau đây xuất hiện trong tài liệu đã tải lên?',
        position: 0,
        answers: fallbackAnswers.map((answer, index) => ({
          text: answer,
          isCorrect: index === 0,
          position: index
        }))
      })
    }
  }

  const lessonTitle = normalizeText(outline.lessonTitle)
  const topTitles = uniqueNonEmpty(slides.map(slide => slide.title)).slice(0, 3)
  const description = [
    lessonTitle
      ? `Bài trắc nghiệm được tạo từ tài liệu "${lessonTitle}".`
      : 'Bài trắc nghiệm được tạo từ tài liệu đã tải lên.',
    topTitles.length > 0 ? `Nội dung trọng tâm: ${topTitles.join(', ')}.` : ''
  ]
    .filter(Boolean)
    .join('\n')

  return { description, questions }
}

type DocxAssistState = 'idle' | 'uploading' | 'processing' | 'ready' | 'error'

function DocxAssistPanel({
  lessonId,
  title,
  hint,
  applyLabel,
  onApplyOutline,
  promptType = 'BulletSlide'
}: {
  lessonId: string
  title: string
  hint: string
  applyLabel: string
  onApplyOutline: (outline: LectureOutline) => void
  promptType?: LessonMaterialPromptType
}) {
  const [state, setState] = useState<DocxAssistState>('idle')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [outline, setOutline] = useState<OutlineDto | null>(null)
  const notificationConnectionRef = useRef<HubConnection | null>(null)

  const hasReadyOutline = useCallback((result: OutlineDto | null | undefined) => {
    return (result?.lectureOutline?.slides?.length ?? 0) > 0
  }, [])

  const loadOutline = useCallback(async (): Promise<OutlineDto | null> => {
    const result = await lessonMaterialService.getOutline(lessonId)
    if (hasReadyOutline(result)) {
      setOutline(result)
      setState('ready')
      return result
    }
    return null
  }, [hasReadyOutline, lessonId])

  useEffect(() => {
    let canceled = false

    const loadExistingOutline = async () => {
      try {
        if (canceled) return
        await loadOutline()
      } catch {
        // Ignore.
      }
    }

    void loadExistingOutline()
    return () => {
      canceled = true
    }
  }, [loadOutline])

  useEffect(() => {
    if (!API_BASE_URL) return

    const connection = new HubConnectionBuilder()
      .withUrl(`${API_BASE_URL}/hubs/notification`, {
        accessTokenFactory: () => getAccessToken() ?? ''
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build()

    notificationConnectionRef.current = connection

    connection.on('DocumentProcessed', (notification: DocumentProcessedNotification) => {
      const notificationLessonId = notification?.lessonId ?? notification?.LessonId
      if (notificationLessonId && notificationLessonId.toLowerCase() !== lessonId.toLowerCase()) return

      const loweredMessage = (notification?.message ?? notification?.Message ?? '').toLowerCase()
      if (loweredMessage.includes('thất bại') || loweredMessage.includes('failed')) {
        setState('error')
        toast.error('Tạo outline thất bại. Vui lòng thử lại với tài liệu khác.')
        return
      }

      void loadOutline().then(result => {
        if (result?.lectureOutline) {
          toast.success('Outline đã sẵn sàng, đã tự động áp dụng nội dung.')
          onApplyOutline(result.lectureOutline)
        }
      })
    })

    const startConnection = async () => {
      try {
        await connection.start()
      } catch {
        // Keep manual refresh available if realtime is unavailable.
      }
    }
    void startConnection()

    return () => {
      connection.off('DocumentProcessed')
      if (notificationConnectionRef.current === connection) {
        notificationConnectionRef.current = null
      }
      void connection.stop().catch(() => {})
    }
  }, [lessonId, loadOutline])

  const handleFileChange = (file: File | null) => {
    if (!file) return
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (!['doc', 'docx'].includes(ext ?? '')) {
      toast.error('Chỉ hỗ trợ file .doc hoặc .docx.')
      return
    }
    setSelectedFile(file)
    setState('idle')
  }

  const handleStart = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file DOCX trước.')
      return
    }

    setState('uploading')

    try {
      await lessonMaterialService.uploadMaterial(lessonId, selectedFile, promptType)
      setState('processing')
      toast.info('Đã tải file. Hệ thống đang phân tích nội dung...')
    } catch {
      setState('error')
      toast.error('Không thể tải tài liệu lên hệ thống.')
    }
  }

  const handleRefresh = async () => {
    try {
      const result = await loadOutline()
      if (result) {
        toast.success('Dữ liệu AI đã sẵn sàng.')
      } else {
        toast.info('Hệ thống vẫn đang xử lý, vui lòng đợi thêm.')
      }
    } catch {
      toast.error('Không thể tải dữ liệu AI.')
    }
  }

  const handleApply = () => {
    if (!outline?.lectureOutline) {
      toast.error('Chưa có dữ liệu để áp dụng.')
      return
    }
    onApplyOutline(outline.lectureOutline)
  }

  const slideCount = outline?.lectureOutline?.slides?.length ?? 0

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center gap-2.5 px-4 py-3 border-b border-border/60">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>

      <div className="p-4 space-y-3">
        {state === 'processing' ? (
          <div className="flex items-center gap-4 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-4">
            <div className="relative shrink-0">
              <div className="p-2.5 rounded-full bg-amber-100 dark:bg-amber-900/30">
                <FileText className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-500" />
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">AI đang phân tích tài liệu</p>
              <p className="text-xs text-amber-700/70 dark:text-amber-400/70">
                Sẽ tự động áp dụng nội dung khi hoàn tất
              </p>
            </div>
          </div>
        ) : (
          <label
            className={[
              'flex flex-col items-center gap-2.5 rounded-lg border-2 border-dashed p-5 cursor-pointer transition-all duration-150',
              state === 'error'
                ? 'border-destructive/50 bg-destructive/5'
                : selectedFile
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border hover:border-primary/40 hover:bg-muted/30',
              state === 'uploading' ? 'pointer-events-none opacity-60' : ''
            ].join(' ')}
          >
            <input
              type="file"
              accept=".doc,.docx"
              className="sr-only"
              disabled={state === 'uploading'}
              onChange={e => {
                handleFileChange(e.target.files?.[0] ?? null)
                e.target.value = ''
              }}
            />
            {selectedFile ? (
              <>
                <div className="p-2 rounded-full bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(0)} KB · Nhấn để đổi file
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="p-2 rounded-full bg-muted">
                  <UploadCloud className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Chọn tài liệu</p>
                  <p className="text-xs text-muted-foreground">Hỗ trợ .doc và .docx</p>
                </div>
              </>
            )}
          </label>
        )}

        {state === 'error' && (
          <p className="flex items-center gap-1.5 text-xs text-destructive">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            Xử lý thất bại, vui lòng thử lại với file DOCX khác.
          </p>
        )}

        {state !== 'processing' && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              onClick={handleStart}
              disabled={!selectedFile || state === 'uploading'}
              className="gap-1.5"
            >
              {state === 'uploading' && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {state === 'uploading' ? 'Đang tải lên...' : 'Phân tích tài liệu'}
            </Button>
            {slideCount > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="gap-1.5 text-muted-foreground"
                onClick={handleRefresh}
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Làm mới
              </Button>
            )}
          </div>
        )}

        {slideCount > 0 && outline && (
          <div className="rounded-lg border border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800 p-3.5 space-y-2.5 animate-in fade-in slide-in-from-bottom-1 duration-200">
            <div className="flex items-start gap-2.5">
              <div className="p-1 rounded-md bg-green-100 dark:bg-green-900/30 shrink-0 mt-0.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-green-800 dark:text-green-300 truncate">
                  {outline.lectureOutline.lessonTitle || 'Tài liệu đã phân tích'}
                </p>
                <p className="text-[11px] text-green-700/70 dark:text-green-400/70">{slideCount} phần nội dung</p>
              </div>
              <Button type="button" size="sm" className="h-7 text-xs shrink-0" onClick={handleApply}>
                {applyLabel}
              </Button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {outline.lectureOutline.slides.slice(0, 5).map((slide, index) => (
                <span
                  key={`${slide.title}-${index}`}
                  className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-900/30 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:text-green-400"
                >
                  {slide.title || `Phần ${index + 1}`}
                </span>
              ))}
              {slideCount > 5 && (
                <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                  +{slideCount - 5} phần
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Reading Content Section ──────────────────────────────────────────────────

function ReadingContentSection({ lessonId, initialContent }: { lessonId: string; initialContent?: string }) {
  const [content, setContent] = useState(initialContent ?? '')
  const [isEditing, setIsEditing] = useState(!initialContent)
  const [saving, setSaving] = useState(false)

  const applyOutlineToReading = useCallback((outline: LectureOutline) => {
    const generatedContent = buildReadingContentFromOutline(outline)
    if (!generatedContent) {
      toast.error('Không thể tạo nội dung bài đọc từ tài liệu này.')
      return
    }
    setContent(generatedContent)
    setIsEditing(true)
    toast.success('Đã áp dụng nội dung AI vào khung bài đọc. Vui lòng rà soát trước khi lưu.')
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await lessonService.upsertReading(lessonId, { content })
      toast.success('Đã lưu nội dung bài đọc.')
      setIsEditing(false)
    } catch {
      toast.error('Không thể lưu nội dung bài đọc.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-md border-0 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-green-600" /> Nội dung bài đọc
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setContent(initialContent ?? '')
                  setIsEditing(false)
                }}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-3.5 w-3.5" /> Chỉnh sửa nội dung
            </Button>
          )}
        </div>
      </div>

      <DocxAssistPanel
        lessonId={lessonId}
        title="Gợi ý nội dung bài đọc từ DOCX"
        hint="Tải file .doc/.docx, hệ thống sẽ phân tích và tạo bản nháp nội dung cho bài đọc."
        applyLabel="Áp dụng vào bài đọc"
        onApplyOutline={applyOutlineToReading}
        promptType="Reading"
      />

      {isEditing ? (
        <div className="rounded-lg border border-border overflow-hidden [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border [&_.ql-toolbar]:bg-muted/30 [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[360px] [&_.ql-editor]:text-sm [&_.ql-editor]:font-sans [&_.ql-editor]:leading-relaxed">
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>
      ) : content ? (
        <div
          className="min-h-[200px] rounded-lg bg-muted/20 p-6 prose prose-sm dark:prose-invert max-w-none bg-muted/30 shadow-inner"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div className="min-h-[200px] rounded-lg bg-muted/30 shadow-inner flex items-center justify-center">
          <span className="text-sm italic text-muted-foreground">
            Chưa có nội dung. Bấm chỉnh sửa để thêm tài liệu bài đọc.
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Coding Content Section ───────────────────────────────────────────────────

function CodingContentSection({
  lessonId,
  initialExerciseId,
  initialExerciseTitle
}: {
  lessonId: string
  initialExerciseId?: string
  initialExerciseTitle?: string
}) {
  const [search, setSearch] = useState('')
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [selectedId, setSelectedId] = useState(initialExerciseId ?? '')
  const [selectedTitle, setSelectedTitle] = useState(initialExerciseTitle ?? '')
  const [exerciseDetail, setExerciseDetail] = useState<ExerciseDetailDto | null>(null)
  const [isEditing, setIsEditing] = useState(!initialExerciseId)
  const [searching, setSearching] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const doSearch = useCallback(async (q: string) => {
    setSearching(true)
    try {
      const res = await lessonService.searchExercises(q)
      setExercises(res?.items ?? [])
    } catch {
      setExercises([])
    } finally {
      setSearching(false)
    }
  }, [])

  const fetchDetail = useCallback(async (eid: string) => {
    setLoadingDetail(true)
    try {
      const res = await exerciseService.getById(eid)
      setExerciseDetail(res)
    } catch {
      setExerciseDetail(null)
    } finally {
      setLoadingDetail(false)
    }
  }, [])

  // Initial load
  useEffect(() => {
    doSearch('')
    if (initialExerciseId) {
      fetchDetail(initialExerciseId)
    }
  }, [doSearch, fetchDetail, initialExerciseId])

  // Search debounce - 3 seconds
  useEffect(() => {
    if (search === '') {
      doSearch('')
      return
    }
    const t = setTimeout(() => doSearch(search), 3000)
    return () => clearTimeout(t)
  }, [search, doSearch])

  async function handleSave() {
    if (!selectedId) {
      toast.error('Vui lòng chọn bài tập.')
      return
    }
    setSaving(true)
    try {
      await lessonService.upsertCoding(lessonId, { exerciseId: selectedId })
      toast.success('Đã liên kết bài tập thành công.')
      setIsEditing(false)
    } catch {
      toast.error('Không thể liên kết bài tập.')
    } finally {
      setSaving(false)
    }
  }

  const handleSelect = (ex: ExerciseDto) => {
    setSelectedId(ex.id)
    setSelectedTitle(ex.title)
    setSearch('')
    setShowResults(false)
    fetchDetail(ex.id)
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-md border-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Code2 className="h-5 w-5 text-orange-600" /> Bài tập lập trình
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedId(initialExerciseId ?? '')
                  setSelectedTitle(initialExerciseTitle ?? '')
                  if (initialExerciseId) fetchDetail(initialExerciseId)
                  setIsEditing(false)
                }}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving || !selectedId} size="sm" className="gap-2">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-3.5 w-3.5" /> Đổi bài tập
            </Button>
          )}
        </div>
      </div>

      <div className={`grid grid-cols-1 ${isEditing ? 'grid-cols-2' : ''} gap-6`}>
        {/* Left: Search and Selection (Only in Edit mode) */}
        {isEditing && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tìm và chọn bài tập</Label>
              <div className="relative">
                <Input
                  placeholder="Nhập để tìm bài tập..."
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value)
                    setShowResults(true)
                  }}
                  onFocus={() => setShowResults(true)}
                />
                {searching && (
                  <div className="absolute right-3 top-2.5 flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground animate-pulse">Đang tìm...</span>
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                )}
              </div>

              {showResults && (
                <div className="rounded-lg bg-popover shadow-md overflow-hidden max-h-72 flex flex-col z-10 relative">
                  <div className="p-2 shadow-md border-0 border-b-0 bg-muted/30 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    {search ? `Kết quả tìm kiếm cho "${search}"` : 'Danh sách bài tập'}
                  </div>
                  <div className="overflow-y-auto">
                    {exercises.length > 0 ? (
                      exercises.map(ex => (
                        <button
                          key={ex.id}
                          onClick={() => handleSelect(ex)}
                          className={`w-full px-4 py-3 text-left hover:bg-muted/60 transition-colors flex items-start gap-3 shadow-md border-0 border-b-0 last:-0 ${selectedId === ex.id ? 'bg-primary/5' : ''}`}
                        >
                          <div
                            className={`mt-0.5 p-1.5 rounded-md ${selectedId === ex.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}
                          >
                            <Code2 className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{ex.title}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 capitalize">
                                {ex.difficulty}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground">{ex.category}</span>
                            </div>
                          </div>
                          {selectedId === ex.id && <CheckCircle2 className="h-4 w-4 text-primary mt-1" />}
                        </button>
                      ))
                    ) : (
                      <div className="p-8 text-center text-sm text-muted-foreground">
                        {searching ? 'Đang tải bài tập...' : 'Không tìm thấy bài tập.'}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {selectedId && (
              <div className="flex items-center gap-3 rounded-lg -orange-200 bg-orange-50 dark:bg-orange-950/20 px-4 py-3">
                <CheckCircle2 className="h-4 w-4 text-orange-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted-foreground mb-0.5">Bài tập đã chọn</p>
                  <p className="text-sm font-medium truncate">{selectedTitle || selectedId}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right/Full: Preview Detail */}
        <div className="space-y-4">
          <Label>{isEditing ? 'Xem trước bài tập' : 'Chi tiết bài tập đã liên kết'}</Label>
          {loadingDetail ? (
            <div className="h-[300px] rounded-lg border-0 -dashed bg-muted/30 shadow-inner flex flex-col items-center justify-center text-muted-foreground gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-xs">Đang tải chi tiết...</span>
            </div>
          ) : exerciseDetail ? (
            <div
              className={`rounded-lg bg-muted shadow-md border-0 border-0/20 overflow-hidden flex flex-col ${isEditing ? 'h-[400px]' : 'min-h-[300px]'}`}
            >
              <div className="px-4 py-3 shadow-md border-0 border-b-0 bg-card">
                <h3 className="font-medium">{exerciseDetail.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {exerciseDetail.difficulty}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground">{exerciseDetail.category}</span>
                  <span className="text-[10px] text-muted-foreground ml-auto">
                    {exerciseDetail.testCases?.length || 0} bộ kiểm thử
                  </span>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mô tả</p>
                  <div className="text-xs prose prose-sm dark:prose-invert max-w-none">
                    {exerciseDetail.description}
                  </div>
                </div>

                {exerciseDetail.defaultCodes && exerciseDetail.defaultCodes.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      Mã khởi tạo ({exerciseDetail.defaultCodes[0].language})
                    </p>
                    <pre className="p-3 rounded-md bg-zinc-950 text-zinc-100 text-[10px] font-mono overflow-x-auto">
                      {exerciseDetail.defaultCodes[0].starterCode}
                    </pre>
                  </div>
                )}
              </div>
              <div className="p-3 shadow-md border-0 border-t-0 bg-card text-center">
                <Link
                  href={`/management/exercises/${exerciseDetail.id}`}
                  target="_blank"
                  className="text-[10px] text-primary hover:underline font-medium"
                >
                  Quản lý chi tiết đầy đủ của bài tập
                </Link>
              </div>
            </div>
          ) : (
            <div className="h-[300px] rounded-lg border-0 -dashed bg-muted/30 shadow-inner flex flex-col items-center justify-center text-muted-foreground text-center px-8">
              <Code2 className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs">
                {isEditing
                  ? 'Chọn một bài tập ở bên trái để xem trước.'
                  : 'Chưa liên kết bài tập. Bấm "Đổi bài tập" để liên kết.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Quiz Content Section ─────────────────────────────────────────────────────

function QuizContentSection({
  lessonId,
  initialDescription,
  initialPassingScore,
  initialQuestions
}: {
  lessonId: string
  initialDescription?: string
  initialPassingScore?: number
  initialQuestions?: QuizQuestionDto[]
}) {
  const [description, setDescription] = useState(initialDescription ?? '')
  const [passingScore, setPassingScore] = useState(initialPassingScore ?? 70)
  const [questions, setQuestions] = useState<QuizQuestionDto[]>(initialQuestions ?? [])
  const [isEditing, setIsEditing] = useState(!initialDescription)
  const [saving, setSaving] = useState(false)

  const applyOutlineToQuiz = useCallback((outline: LectureOutline) => {
    const draft = buildQuizDraftFromOutline(outline)
    if (draft.questions.length === 0) {
      toast.error('Tài liệu chưa đủ dữ liệu để tạo câu hỏi trắc nghiệm nháp.')
      return
    }

    setDescription(draft.description)
    setQuestions(draft.questions)
    setIsEditing(true)
    toast.success('Đã tạo bộ câu hỏi nháp từ tài liệu. Bạn có thể chỉnh sửa trước khi lưu.')
  }, [])

  async function handleSave() {
    if (questions.length === 0) {
      toast.error('Vui lòng thêm ít nhất một câu hỏi.')
      return
    }
    for (const q of questions) {
      if (!q.text.trim()) {
        toast.error('Nội dung câu hỏi không được để trống.')
        return
      }
      if (q.answers.length < 2) {
        toast.error(`Câu hỏi "${q.text}" cần ít nhất 2 đáp án.`)
        return
      }
      if (!q.answers.some(a => a.isCorrect)) {
        toast.error(`Câu hỏi "${q.text}" cần ít nhất một đáp án đúng.`)
        return
      }
    }

    setSaving(true)
    try {
      await lessonService.upsertQuiz(lessonId, { description, passingScore, questions })
      toast.success('Đã lưu bài trắc nghiệm thành công.')
      setIsEditing(false)
    } catch {
      toast.error('Không thể lưu bài trắc nghiệm.')
    } finally {
      setSaving(false)
    }
  }

  const addQuestion = () => {
    const newQ: QuizQuestionDto = {
      text: '',
      position: questions.length,
      answers: [
        { text: '', isCorrect: true, position: 0 },
        { text: '', isCorrect: false, position: 1 }
      ]
    }
    setQuestions([...questions, newQ])
  }

  const updateQuestion = (idx: number, updates: Partial<QuizQuestionDto>) => {
    const next = [...questions]
    next[idx] = { ...next[idx], ...updates }
    setQuestions(next)
  }

  const removeQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx).map((q, i) => ({ ...q, position: i })))
  }

  const addAnswer = (qIdx: number) => {
    const q = questions[qIdx]
    const nextAnswers = [...q.answers, { text: '', isCorrect: false, position: q.answers.length }]
    updateQuestion(qIdx, { answers: nextAnswers })
  }

  const updateAnswer = (qIdx: number, aIdx: number, updates: Partial<QuizAnswerDto>) => {
    const q = questions[qIdx]
    const nextAnswers = [...q.answers]
    // If setting IsCorrect to true, set others to false (assuming single choice for now, or remove this if multiple)
    if (updates.isCorrect) {
      nextAnswers.forEach((a, i) => {
        a.isCorrect = i === aIdx
      })
    } else {
      nextAnswers[aIdx] = { ...nextAnswers[aIdx], ...updates }
    }
    updateQuestion(qIdx, { answers: nextAnswers })
  }

  const removeAnswer = (qIdx: number, aIdx: number) => {
    const q = questions[qIdx]
    if (q.answers.length <= 2) {
      toast.error('Mỗi câu hỏi cần tối thiểu 2 đáp án.')
      return
    }
    const nextAnswers = q.answers.filter((_, i) => i !== aIdx).map((a, i) => ({ ...a, position: i }))
    updateQuestion(qIdx, { answers: nextAnswers })
  }

  return (
    <div className="rounded-xl bg-card p-6 shadow-md border-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <FileQuestion className="h-5 w-5 text-purple-600" /> Quản lý trắc nghiệm
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setDescription(initialDescription ?? '')
                  setPassingScore(initialPassingScore ?? 70)
                  setQuestions(initialQuestions ?? [])
                  setIsEditing(false)
                }}
                disabled={saving}
              >
                Hủy
              </Button>
              <Button onClick={handleSave} disabled={saving} size="sm" className="gap-2">
                {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                {saving ? 'Đang lưu...' : 'Lưu trắc nghiệm'}
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
              <Edit className="h-3.5 w-3.5" /> Chỉnh sửa trắc nghiệm
            </Button>
          )}
        </div>
      </div>

      <DocxAssistPanel
        lessonId={lessonId}
        title="Gợi ý trắc nghiệm từ DOCX"
        hint="Tải file .doc/.docx, hệ thống sẽ tạo mô tả và bộ câu hỏi trắc nghiệm nháp."
        applyLabel="Áp dụng vào trắc nghiệm"
        onApplyOutline={applyOutlineToQuiz}
        promptType="BulletSlide"
      />

      {isEditing ? (
        <div className="space-y-8">
          {/* Settings Area */}
          <div className="grid grid-cols-1 grid-cols-3 gap-6 p-4 rounded-lg bg-muted/20 border-0 -dashed bg-muted/30 shadow-inner">
            <div className="col-span-2 space-y-1.5">
              <Label>Mô tả bài trắc nghiệm</Label>
              <Textarea
                placeholder="Giới thiệu ngắn cho học viên..."
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Điểm đạt (%)</Label>
              <Input type="number" value={passingScore} onChange={e => setPassingScore(Number(e.target.value))} />
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-6">
            {questions.map((q, qIdx) => (
              <div key={qIdx} className="relative group rounded-xl bg-card shadow-md border-0 overflow-hidden">
                <div className="bg-muted/50 px-4 py-2 shadow-md border-0 border-b-0 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Câu hỏi {qIdx + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => removeQuestion(qIdx)}
                  >
                    Xóa
                  </Button>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nội dung câu hỏi</Label>
                    <Input
                      placeholder="Ví dụ: Thủ đô của Việt Nam là gì?"
                      value={q.text}
                      onChange={e => updateQuestion(qIdx, { text: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-xs">Đáp án (đánh dấu đáp án đúng)</Label>
                    <div className="grid grid-cols-1 gap-2">
                      {q.answers.map((a, aIdx) => (
                        <div key={aIdx} className="flex items-center gap-2">
                          <button
                            onClick={() => updateAnswer(qIdx, aIdx, { isCorrect: true })}
                            className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 transition-colors ${a.isCorrect ? 'bg-green-600 -green-600 text-white' : 'hover:-green-600'}`}
                          >
                            {a.isCorrect && <CheckCircle2 className="h-4 w-4" />}
                          </button>
                          <Input
                            className="h-9 text-sm"
                            placeholder={`Đáp án ${aIdx + 1}`}
                            value={a.text}
                            onChange={e => updateAnswer(qIdx, aIdx, { text: e.target.value })}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 w-9 p-0 text-muted-foreground hover:text-destructive"
                            onClick={() => removeAnswer(qIdx, aIdx)}
                          >
                            &times;
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs text-primary"
                      onClick={() => addAnswer(qIdx)}
                    >
                      + Thêm lựa chọn đáp án
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              className="w-full -dashed py-8 h-auto flex-col gap-2 hover:bg-primary/5 hover:-primary/50"
              onClick={addQuestion}
            >
              <div className="p-2 rounded-full bg-primary/10 text-primary">
                <FileQuestion className="h-5 w-5" />
              </div>
              <div className="text-center">
                <p className="text-sm font-medium">Thêm câu hỏi mới</p>
                <p className="text-xs text-muted-foreground">Bấm để thêm câu hỏi trắc nghiệm nhiều lựa chọn</p>
              </div>
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-6 p-5 rounded-xl bg-muted/20 border-0 -dashed bg-muted/30 shadow-inner">
            <div className="flex-1 min-w-[200px] space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Mô tả trắc nghiệm</p>
              <p className="text-sm">{description || 'Chưa có mô tả.'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Điểm đạt</p>
              <Badge variant="secondary" className="text-sm px-3">
                {passingScore}%
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Số câu hỏi</p>
              <p className="text-sm font-semibold">{questions.length} câu</p>
            </div>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => (
              <div key={i} className="p-4 rounded-lg bg-card shadow-md border-0/50">
                <p className="text-sm font-medium mb-3 flex items-start gap-2">
                  <span className="text-primary">Q{i + 1}.</span> {q.text}
                </p>
                <div className="grid grid-cols-1 grid-cols-2 gap-2 ml-7">
                  {q.answers.map((a, j) => (
                    <div
                      key={j}
                      className={`text-xs p-2 rounded flex items-center justify-between ${a.isCorrect ? 'bg-green-50 -green-200 text-green-700 dark:bg-green-950/20 dark:-green-900' : 'bg-muted/30 text-muted-foreground'}`}
                    >
                      <span>{a.text}</span>
                      {a.isCorrect && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {questions.length === 0 && (
              <div className="text-center py-12 text-muted-foreground border-0 -dashed bg-muted/30 shadow-inner rounded-lg">
                <p className="text-sm italic">Chưa có câu hỏi nào.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Slide Content Section ────────────────────────────────────────────────────

function SlideContentSection({ lessonId, initialFileUrl }: { lessonId: string; initialFileUrl?: string }) {
  const uploadUnavailableMessage =
    'Tải slide trực tiếp đang tạm thời chưa khả dụng vì backend chưa hỗ trợ API cập nhật slide cho bài học.'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Presentation className="h-6 w-6 text-pink-600" />
          Quản lý slide
        </h2>
        <div className="flex bg-muted/50 p-1 rounded-lg">
          <Button variant="secondary" size="sm">
            Hỗ trợ soạn thảo
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground"
            onClick={() => toast.info(uploadUnavailableMessage)}
          >
            <UploadCloud className="h-4 w-4 text-blue-600" />
            Tải lên trực tiếp
          </Button>
        </div>
      </div>

      <div className="rounded-xl border border-dashed bg-muted/20 p-4 text-sm text-muted-foreground">
        <p className="font-medium text-foreground">Tải lên trực tiếp đang tạm khóa</p>
        <p className="mt-1">{uploadUnavailableMessage}</p>
        {initialFileUrl ? (
          <a
            href={initialFileUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-block text-primary hover:underline"
          >
            Xem slide hiện tại
          </a>
        ) : null}
      </div>

      <AiMaterialSection lessonId={lessonId} />
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<LessonDto | null>(null)
  const [detail, setDetail] = useState<LessonDetailDto | null>(null)
  const [chapter, setChapter] = useState<ChapterDto | null>(null)
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [showVideoSlideAssist, setShowVideoSlideAssist] = useState(false)

  useEffect(() => {
    const fetchLesson = async () => {
      setShowVideoSlideAssist(false)
      setLoading(true)
      try {
        const [l, d] = await Promise.all([lessonService.getById(id), lessonService.getDetail(id)])
        setLesson(l)
        setDetail(d)
        const [ch, c] = await Promise.all([
          l?.chapterId ? chapterService.getById(l.chapterId).catch(() => null) : Promise.resolve(null),
          l?.courseId ? courseService.getById(l.courseId).catch(() => null) : Promise.resolve(null)
        ])
        setChapter(ch)
        setCourse(c)
      } catch {
        toast.error('Không tìm thấy bài học.')
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [id])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!lesson) {
    return <div className="text-center py-16 text-muted-foreground">Không tìm thấy bài học.</div>
  }

  const normalizedLessonType = normalizeLessonType(lesson.lessonType)
  const typeMeta = TYPE_META[normalizedLessonType]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push(`/management/courses/${lesson.courseId}`)}
          className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={`/management/courses/${lesson.courseId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {course ? course.title : lesson.courseName || 'Khóa học'}
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm font-medium text-muted-foreground">
              {chapter ? chapter.title : lesson.chapterName || 'Chương'}
            </span>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm text-muted-foreground">Bài học {lesson.sortOrder}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <h1 className="text-2xl font-semibold truncate">{lesson.title}</h1>
              <Badge className={`gap-1.5 shrink-0 ${typeMeta.color}`}>
                {typeMeta.icon} {typeMeta.label}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Type-specific Content Section */}
      {normalizedLessonType === LessonType.Video && (
        <div className="space-y-4">
          <VideoUploadSection lessonId={id} initialVideoUrl={detail?.videoUrl} />

          <button
            type="button"
            onClick={() => setShowVideoSlideAssist(prev => !prev)}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-muted/30 transition-all text-left group"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Tạo nội dung slide từ tài liệu</p>
              <p className="text-xs text-muted-foreground">Tải DOC/DOCX để AI trích xuất bullet ý chính cho slide</p>
            </div>
            <ChevronDown
              className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${showVideoSlideAssist ? 'rotate-180' : ''}`}
            />
          </button>

          {showVideoSlideAssist && <AiMaterialSection lessonId={id} />}
        </div>
      )}

      {normalizedLessonType === LessonType.Reading && (
        <ReadingContentSection lessonId={id} initialContent={detail?.readingContent} />
      )}

      {normalizedLessonType === LessonType.Coding && (
        <CodingContentSection
          lessonId={id}
          initialExerciseId={detail?.exerciseId}
          initialExerciseTitle={detail?.exerciseTitle}
        />
      )}

      {normalizedLessonType === LessonType.Quiz && (
        <QuizContentSection
          lessonId={id}
          initialDescription={detail?.quizDescription}
          initialPassingScore={detail?.quizPassingScore}
          initialQuestions={detail?.quizQuestions}
        />
      )}

      {normalizedLessonType === LessonType.Slide && (
        <SlideContentSection lessonId={id} initialFileUrl={detail?.slideFileUrl} />
      )}
    </div>
  )
}
