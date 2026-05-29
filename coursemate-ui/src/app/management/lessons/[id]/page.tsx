'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  UploadCloud,
  Sparkles
} from 'lucide-react'
import { toast } from 'sonner'
import { lessonService, chapterService, courseService } from '@/lib/course-service'
import { exerciseService } from '@/lib/exercise-service'
import {
  LessonDto,
  ChapterDto,
  CourseDto,
  UpdateLessonRequest,
  LessonType,
  LessonDetailDto,
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import Link from 'next/link'
import { VideoUploadSection } from './video-upload'
import { AiMaterialSection } from './ai-material-section'

// ─── Lesson Type Icon & Color ─────────────────────────────────────────────────

const TYPE_META: Record<LessonType, { icon: React.ReactNode; label: string; color: string }> = {
  [LessonType.Video]: {
    icon: <Video className="h-4 w-4" />,
    label: 'Video',
    color: 'bg-blue-100 text-blue-700 border-blue-200'
  },
  [LessonType.Reading]: {
    icon: <BookOpen className="h-4 w-4" />,
    label: 'Bài đọc',
    color: 'bg-green-100 text-green-700 border-green-200'
  },
  [LessonType.Coding]: {
    icon: <Code2 className="h-4 w-4" />,
    label: 'Lập trình',
    color: 'bg-orange-100 text-orange-700 border-orange-200'
  },
  [LessonType.Quiz]: {
    icon: <FileQuestion className="h-4 w-4" />,
    label: 'Trắc nghiệm',
    color: 'bg-purple-100 text-purple-700 border-purple-200'
  },
  [LessonType.Slide]: {
    icon: <Presentation className="h-4 w-4" />,
    label: 'Trình chiếu',
    color: 'bg-pink-100 text-pink-700 border-pink-200'
  }
}

// ─── Reading Content Section ──────────────────────────────────────────────────

function ReadingContentSection({ lessonId, initialContent }: { lessonId: string; initialContent?: string }) {
  const [content, setContent] = useState(initialContent ?? '')
  const [isEditing, setIsEditing] = useState(!initialContent)
  const [saving, setSaving] = useState(false)

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

      {isEditing ? (
        <>
          <Textarea
            className="min-h-[400px] font-mono text-sm"
            placeholder="Viết nội dung bài đọc bằng Markdown..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
          <p className="text-xs text-muted-foreground">Hỗ trợ định dạng Markdown.</p>
        </>
      ) : (
        <div className="min-h-[200px] rounded-lg bg-muted/20 p-6 prose prose-sm dark:prose-invert max-w-none border-0 -dashed bg-muted/30 shadow-inner">
          {content || (
            <span className="text-muted-foreground italic">
              Chưa có nội dung. Bấm chỉnh sửa để thêm tài liệu bài đọc.
            </span>
          )}
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

      <div className={`grid grid-cols-1 ${isEditing ? 'lg:grid-cols-2' : ''} gap-6`}>
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

      {isEditing ? (
        <div className="space-y-8">
          {/* Settings Area */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 rounded-lg bg-muted/20 border-0 -dashed bg-muted/30 shadow-inner">
            <div className="md:col-span-2 space-y-1.5">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-7">
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
          <Button variant="secondary" size="sm" className="gap-2">
            <Sparkles className="h-4 w-4 text-purple-600" />
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
  const [saving, setSaving] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  const [form, setForm] = useState<UpdateLessonRequest>({
    chapterId: '',
    courseId: '',
    title: '',
    lessonType: LessonType.Video,
    sortOrder: 1
  })

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true)
      try {
        const [l, d] = await Promise.all([lessonService.getById(id), lessonService.getDetail(id)])
        setLesson(l)
        setDetail(d)
        setForm({
          chapterId: l?.chapterId || '',
          courseId: l?.courseId || '',
          title: l?.title || '',
          lessonType: l?.lessonType || LessonType.Video,
          sortOrder: l?.sortOrder || 1
        })
        if (l?.chapterId) {
          try {
            const ch = await chapterService.getById(l.chapterId)
            setChapter(ch)
            if (ch?.courseId) {
              const c = await courseService.getById(ch.courseId)
              setCourse(c)
            }
          } catch (e) {
            console.error(e)
          }
        }
      } catch {
        toast.error('Không tìm thấy bài học.')
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [id])

  async function handleSave() {
    setSaving(true)
    try {
      await lessonService.update(id, form)
      toast.success('Đã cập nhật bài học thành công.')
      const [updated, updatedDetail] = await Promise.all([lessonService.getById(id), lessonService.getDetail(id)])
      setLesson(updated)
      setDetail(updatedDetail)
    } catch {
      toast.error('Không thể cập nhật bài học.')
    } finally {
      setSaving(false)
      setEditDialogOpen(false)
    }
  }

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

  const numericMap: Record<number, LessonType> = {
    1: LessonType.Video,
    2: LessonType.Reading,
    3: LessonType.Coding,
    4: LessonType.Quiz,
    5: LessonType.Slide
  }
  const typeMeta =
    TYPE_META[lesson.lessonType] ||
    TYPE_META[numericMap[lesson.lessonType as unknown as number]] ||
    TYPE_META[LessonType.Video]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push(`/management/chapters/${lesson.chapterId}`)}
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
            <Link
              href={`/management/chapters/${lesson.chapterId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {chapter ? chapter.title : lesson.chapterName || 'Chương'}
            </Link>
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
            <Button variant="outline" size="sm" onClick={() => setEditDialogOpen(true)} className="gap-2 shrink-0">
              <Edit className="h-4 w-4" /> Sửa thông tin
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin bài học</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label>Tiêu đề</Label>
              <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <Label>Loại bài học</Label>
              <Select
                value={form.lessonType}
                onValueChange={v => setForm(prev => ({ ...prev, lessonType: v as LessonType }))}
              >
                <SelectTrigger>
                  <SelectValue>{TYPE_META[form.lessonType]?.label ?? form.lessonType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LessonType).map(t => (
                    <SelectItem key={t} value={t}>
                      {TYPE_META[t]?.label ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Type-specific Content Section */}
      {lesson.lessonType === LessonType.Video && (
        <VideoUploadSection lessonId={id} initialVideoUrl={detail?.videoUrl} />
      )}

      {lesson.lessonType === LessonType.Reading && (
        <ReadingContentSection lessonId={id} initialContent={detail?.readingContent} />
      )}

      {lesson.lessonType === LessonType.Coding && (
        <CodingContentSection
          lessonId={id}
          initialExerciseId={detail?.exerciseId}
          initialExerciseTitle={detail?.exerciseTitle}
        />
      )}

      {lesson.lessonType === LessonType.Quiz && (
        <QuizContentSection
          lessonId={id}
          initialDescription={detail?.quizDescription}
          initialPassingScore={detail?.quizPassingScore}
          initialQuestions={detail?.quizQuestions}
        />
      )}

      {lesson.lessonType === LessonType.Slide && (
        <SlideContentSection lessonId={id} initialFileUrl={detail?.slideFileUrl} />
      )}
    </div>
  )
}
