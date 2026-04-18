'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Plus, Trash2, Loader2, BookOpen, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { chapterService, lessonService, courseService } from '@/lib/course-service'
import { aiService } from '@/lib/ai-service'
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

const LESSON_TYPE_COLOR: Record<LessonType, string> = {
  [LessonType.Video]: 'bg-blue-500/10 text-blue-600 border-blue-200',
  [LessonType.Reading]: 'bg-green-500/10 text-green-600 border-green-200',
  [LessonType.Quiz]: 'bg-orange-500/10 text-orange-600 border-orange-200',
  [LessonType.Coding]: 'bg-purple-500/10 text-purple-600 border-purple-200',
  [LessonType.Slide]: 'bg-teal-500/10 text-teal-600 border-teal-200'
}

const LESSON_TYPE_ICON: Record<LessonType, string> = {
  [LessonType.Video]: '🎬',
  [LessonType.Reading]: '📖',
  [LessonType.Quiz]: '📝',
  [LessonType.Coding]: '💻',
  [LessonType.Slide]: '📽️'
}

// ─── Mock AI Data Generators ───────────────────────────────────────────────────

const MOCK_AI_DATA: Record<LessonType, (name: string, raw: string) => object> = {
  [LessonType.Video]: (name, raw) => ({
    title: name || 'Giới thiệu về Lập trình Hướng đối tượng',
    segments: [
      {
        time: '00:00 - 03:00',
        script: `Giới thiệu tổng quan về ${raw || name}. Đây là một trong những khái niệm nền tảng quan trọng nhất trong lập trình hiện đại.`
      },
      {
        time: '03:00 - 08:00',
        script: `Phân tích 4 trụ cột: Encapsulation, Inheritance, Polymorphism, Abstraction. ${raw ? `Áp dụng vào ngữ cảnh ${raw}.` : ''}`
      },
      { time: '08:00 - 12:00', script: 'Demo thực tế với code mẫu và bài tập thực hành để củng cố kiến thức.' }
    ],
    timestamps: [
      { time: '00:00', label: 'Giới thiệu & Mục tiêu' },
      { time: '01:30', label: 'Khái niệm nền tảng' },
      { time: '04:00', label: 'Demo code thực tế' },
      { time: '09:00', label: 'Bài tập thực hành' },
      { time: '11:30', label: 'Tổng kết' }
    ]
  }),
  [LessonType.Reading]: (name, raw) => ({
    title: name || 'Bài đọc hiểu',
    markdown_content: `# ${name || 'Tiêu đề bài đọc'}

## Giới thiệu

${raw || 'Nội dung bài đọc chi tiết.'} Phần mở đầu giúp sinh viên nắm bắt tổng quan chủ đề.

## Nội dung chính

### 1. Khái niệm cơ bản

Các khái niệm nền tảng cần nắm vững:

\`\`\`python
# Ví dụ code minh họa
def example(param):
    """Hàm minh họa khái niệm"""
    return param * 2

result = example(5)
print(f"Kết quả: {result}")  # Output: 10
\`\`\`

### 2. Ứng dụng thực tế

- **Web Development**: Xây dựng ứng dụng web động
- **Data Science**: Phân tích và xử lý dữ liệu lớn
- **Machine Learning**: Xây dựng mô hình học máy

## Tổng kết

> 💡 **Ghi nhớ**: Thực hành đều đặn là chìa khóa để thành thạo lập trình.`
  }),
  [LessonType.Coding]: (name, raw) => ({
    title: name || 'Bài tập Lập trình',
    problem_statement: `## ${name || 'Bài tập thực hành'}\n\n${raw || 'Giải quyết bài toán lập trình sau đây.'}\n\n### Yêu cầu:\n- Thiết kế thuật toán hiệu quả\n- Code clean, có comment\n- Xử lý đầy đủ edge cases`,
    initial_code: `def solve(n: int) -> list:\n    """\n    TODO: Implement your solution here\n    """\n    result = []\n    # Viết code ở đây\n    return result\n\nif __name__ == "__main__":\n    print(solve(10))`,
    solution: `def solve(n: int) -> list:\n    """Time: O(n), Space: O(n)"""\n    return [i for i in range(2, n + 1, 2)]\n\nif __name__ == "__main__":\n    print(solve(10))  # [2, 4, 6, 8, 10]`,
    test_cases: [
      { input: 'n = 10', output: '[2, 4, 6, 8, 10]', hidden: false },
      { input: 'n = 2', output: '[2]', hidden: false },
      { input: 'n = 1', output: '[]', hidden: false },
      { input: 'n = 20', output: '[2,4,6,8,10,12,14,16,18,20]', hidden: true },
      { input: 'n = 0', output: '[]', hidden: true }
    ]
  }),
  [LessonType.Quiz]: name => ({
    title: name || 'Bài kiểm tra',
    questions: [
      {
        q: 'Encapsulation trong OOP có nghĩa là gì?',
        options: [
          'Ẩn chi tiết và chỉ lộ interface cần thiết',
          'Cho phép lớp con kế thừa lớp cha',
          'Một hàm có nhiều dạng khác nhau',
          'Tách biệt interface khỏi implementation'
        ],
        ans: 0,
        explanation:
          'Encapsulation (Đóng gói) ẩn chi tiết triển khai nội bộ, chỉ cung cấp interface công khai cần thiết.'
      },
      {
        q: 'Độ phức tạp thời gian của Binary Search là gì?',
        options: ['O(n)', 'O(n²)', 'O(log n)', 'O(n log n)'],
        ans: 2,
        explanation: 'Binary Search có O(log n) vì mỗi bước giảm không gian tìm kiếm đi một nửa.'
      },
      {
        q: 'HTTP method nào dùng để cập nhật MỘT PHẦN tài nguyên trong REST API?',
        options: ['PUT', 'POST', 'PATCH', 'UPDATE'],
        ans: 2,
        explanation: 'PATCH cập nhật một phần (partial update), PUT thay thế hoàn toàn tài nguyên.'
      },
      {
        q: 'Lệnh Git nào tạo nhánh mới và chuyển sang nhánh đó cùng lúc?',
        options: ['git branch new', 'git checkout new', 'git checkout -b new', 'git switch new'],
        ans: 2,
        explanation: '`git checkout -b new-branch` tạo nhánh mới và chuyển sang trong một lệnh.'
      },
      {
        q: 'Design pattern nào giúp giảm sự phụ thuộc giữa các module?',
        options: ['Singleton', 'Dependency Injection', 'Factory', 'Observer'],
        ans: 1,
        explanation:
          'Dependency Injection (DI) cho phép object nhận dependencies từ bên ngoài, giúp code dễ test và bảo trì.'
      }
    ]
  }),
  [LessonType.Slide]: name => ({
    lesson_info: {
      title: name || 'Bài giảng Slide',
      summary: 'Tóm tắt bài giảng',
      learning_outcomes: ['Hiểu tổng quan', 'Nắm được các vấn đề cốt lõi']
    },
    slides: [
      {
        slide_number: 1,
        title: name || 'Tiêu đề Slide',
        type: 'content_slide',
        bullet_points: ['Ý chính 1', 'Ý chính 2'],
        explanation_for_teacher: 'Giải thích...',
        visual_idea: 'Gợi ý hình ảnh'
      }
    ]
  })
}

// ─── AI Content Storage Key ─────────────────────────────────────────────────────

export const AI_CONTENT_KEY = (lessonId: string) => `ai_lesson_content_${lessonId}`

// ─── Helpers ──────────────────────────────────────────────────────────────────

const emptyLessonForm = (courseId: string, chapterId: string): CreateLessonRequest => ({
  courseId,
  chapterId,
  title: '',
  lessonType: LessonType.Video,
  position: 1
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

  // AI Generation state
  const [aiRawContent, setAiRawContent] = useState('')
  const [aiFile, setAiFile] = useState<File | null>(null)
  const [aiGenerating, setAiGenerating] = useState(false)
  const [, setShowPrompt] = useState(false)
  const [aiMode, setAiMode] = useState(false)

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
          } catch {}
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
    setAiRawContent('')
    setAiFile(null)
    setAiMode(false)
    setShowPrompt(false)
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

  async function generateAndCreateLesson() {
    if (!lessonForm.title.trim()) {
      toast.error('Please enter a lesson title first.')
      return
    }
    setAiGenerating(true)
    try {
      let aiContent

      if (lessonForm.lessonType === LessonType.Slide) {
        const response = await aiService.getSlide(aiRawContent)
        aiContent = response
      } else {
        // Simulate AI processing for Mock Data
        await new Promise(r => setTimeout(r, 2200))
        const generator = MOCK_AI_DATA[lessonForm.lessonType]
        aiContent = generator(lessonForm.title, aiRawContent)
      }

      // Use the generated title if available
      const generatedTitle =
        aiContent?.lesson_info?.title || (aiContent as Record<string, string>)?.title || lessonForm.title

      // Create the real lesson via API
      const createdLesson = await lessonService.create({ ...lessonForm, title: generatedTitle })
      const newLessonId = createdLesson.id

      // Save AI content to localStorage keyed by lesson ID
      localStorage.setItem(AI_CONTENT_KEY(newLessonId), JSON.stringify(aiContent))

      toast.success('Bài học đã được tạo với nội dung AI! 🎉', { duration: 4000 })
      setLessonDialog(false)
      loadLessons()
      router.push(`/management/lessons/${newLessonId}`)
    } catch {
      toast.error('Failed during AI lesson creation.')
    } finally {
      setAiGenerating(false)
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
                <span className="text-base">{LESSON_TYPE_ICON[lesson.lessonType as LessonType]}</span>
                <span className="flex-1 font-medium">{lesson.title}</span>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full border font-medium ${LESSON_TYPE_COLOR[lesson.lessonType as LessonType]}`}
                >
                  {lesson.lessonType}
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
            {/* Mode toggle */}
            <div className="flex gap-2 rounded-lg border p-1 bg-muted/30">
              <button
                type="button"
                onClick={() => setAiMode(false)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!aiMode ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                📋 Tạo thủ công
              </button>
              <button
                type="button"
                onClick={() => setAiMode(true)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all flex items-center justify-center gap-1.5 ${aiMode ? 'bg-purple-600 text-white shadow' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Sparkles className="h-3.5 w-3.5" /> Hỗ trợ soạn bài
              </button>
            </div>

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
              <div className="space-y-1.5">
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
              <div className="space-y-1.5">
                <Label>Position</Label>
                <Input
                  type="number"
                  min={1}
                  value={lessonForm.position}
                  onChange={e => lf('position', Number(e.target.value))}
                />
              </div>
            </div>

            {/* AI Panel */}
            {aiMode && (
              <div className="rounded-xl border border-purple-200 bg-purple-50/50 dark:bg-purple-950/10 dark:border-purple-800 p-4 space-y-4 animate-in fade-in duration-200">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/15">
                    <Sparkles className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-700 dark:text-purple-400">
                      Trợ lý Phân tích và Phân rã tài liệu
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Hệ thống sẽ tự động bóc tách tài liệu thành phân đoạn bài học{' '}
                      <Badge
                        variant="outline"
                        className="text-xs inline-flex h-4 px-1 text-purple-600 border-purple-300"
                      >
                        {lessonForm.lessonType}
                      </Badge>{' '}
                      đầy đủ và chuẩn xác.
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">
                      Nội dung tài liệu thô <span className="text-destructive">*</span>
                    </Label>
                    <span className="text-xs text-muted-foreground">PDF / Word / TXT</span>
                  </div>
                  <Input
                    type="file"
                    accept=".pdf,.docx,.txt,.md"
                    onChange={e => setAiFile(e.target.files?.[0] || null)}
                    className="text-xs file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {/* <Textarea
                    placeholder="Hoặc dán toàn bộ nội dung tài liệu, outline báo cáo, bài viết thô vào đây để trợ lý tự động chuyển đổi..."
                    value={aiRawContent}
                    onChange={e => setAiRawContent(e.target.value)}
                    rows={6}
                    className="resize-none text-sm font-mono bg-background mt-2"
                  /> */}
                </div>

                {/* <div className="rounded-lg bg-card border p-3 text-xs space-y-1 text-muted-foreground">
                  <p className="font-medium text-foreground mb-1.5">📦 Nội dung sẽ được tạo và lưu:</p>
                  {lessonForm.lessonType === LessonType.Video && (<><p>• Script 3 phân đoạn + 5 Timestamps</p></>)}
                  {lessonForm.lessonType === LessonType.Reading && (<><p>• Bài đọc Markdown đầy đủ (H1, H2, Code Block)</p></>)}
                  {lessonForm.lessonType === LessonType.Coding && (<><p>• Đề bài + Boilerplate + Solution + 5 Test Cases</p></>)}
                  {lessonForm.lessonType === LessonType.Quiz && (<><p>• 5 câu hỏi trắc nghiệm + Đáp án + Giải thích</p></>)}
                  {lessonForm.lessonType === LessonType.Slide && (<><p>• Outline bài học + Danh sách Slides chi tiết</p></>)}
                </div> */}

                {/* <div className="rounded-lg border bg-muted/30">
                  <button
                    type="button"
                    onClick={() => setShowPrompt(p => !p)}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <span>🤖 System Prompt (cho báo cáo tiểu luận)</span>
                    {showPrompt ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                  {showPrompt && (
                    <div className="border-t px-3 pb-3 pt-2">
                      <pre className="text-xs font-mono text-muted-foreground whitespace-pre-wrap break-words bg-card rounded-md p-2.5 border">
                        {SYSTEM_PROMPT}
                      </pre>
                    </div>
                  )}
                </div> */}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setLessonDialog(false)}>
              Cancel
            </Button>
            {aiMode ? (
              <Button
                onClick={generateAndCreateLesson}
                disabled={aiGenerating || !lessonForm.title.trim() || (!aiRawContent.trim() && !aiFile)}
                className="gap-2 bg-purple-600 hover:bg-purple-700 text-white min-w-[200px]"
              >
                {aiGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Đang bóc tách & xử lý...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Bắt đầu tạo tự động
                  </>
                )}
              </Button>
            ) : (
              <Button onClick={saveLesson} disabled={savingLesson || !lessonForm.title.trim()}>
                {savingLesson ? 'Saving…' : 'Create Lesson'}
              </Button>
            )}
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
