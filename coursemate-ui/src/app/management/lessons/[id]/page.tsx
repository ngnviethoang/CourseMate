'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Save, Sparkles } from 'lucide-react'
import { toast } from 'sonner'
import { lessonService, chapterService, courseService } from '@/lib/course-service'
import { LessonDto, ChapterDto, CourseDto, UpdateLessonRequest, LessonType } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Link from 'next/link'
import { VideoUploadSection } from './video-upload'
import { AiMaterialSection } from './ai-material-section'

// ─── AI Content interfaces ────────────────────────────────────────────────────

interface VideoContent {
  title: string
  segments: { time: string; script: string }[]
  timestamps: { time: string; label: string }[]
}

interface ReadingContent {
  title: string
  markdown_content: string
}

interface TestCase {
  input: string
  output: string
  hidden: boolean
}

interface CodingContent {
  title: string
  problem_statement: string
  initial_code: string
  solution: string
  test_cases: TestCase[]
}

interface QuizQuestion {
  q: string
  options: string[]
  ans: number
  explanation: string
}

interface QuizContent {
  title: string
  questions: QuizQuestion[]
}

type AiContent = VideoContent | ReadingContent | CodingContent | QuizContent

// ─── Sub-renderers ────────────────────────────────────────────────────────────

function VideoContentDisplay({ content }: { content: VideoContent }) {
  if (!content || !content.segments) return null
  return (
    <div className="space-y-6">
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">🎬 Video Script</h2>
        <div className="space-y-3">
          {content.segments.map((seg, i) => (
            <div key={i} className="rounded-lg border bg-muted/20 p-4">
              <p className="text-xs font-mono text-muted-foreground mb-1.5">{seg.time}</p>
              <p className="text-sm leading-relaxed">{seg.script}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-base font-semibold mb-3">⏱ Timestamps</h2>
        <div className="space-y-2">
          {content.timestamps.map((ts, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b last:border-0">
              <span className="font-mono text-xs text-blue-600 w-14 shrink-0">{ts.time}</span>
              <span className="text-sm">{ts.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function ReadingContentDisplay({ content }: { content: ReadingContent }) {
  if (!content || !content.markdown_content) return null
  // Simple markdown-like renderer
  const renderMarkdown = (md: string) => {
    return md.split('\n').map((line, i) => {
      if (line.startsWith('# '))
        return (
          <h1 key={i} className="text-2xl font-bold mt-4 mb-2">
            {line.slice(2)}
          </h1>
        )
      if (line.startsWith('## '))
        return (
          <h2 key={i} className="text-xl font-semibold mt-4 mb-1.5 text-foreground/90">
            {line.slice(3)}
          </h2>
        )
      if (line.startsWith('### '))
        return (
          <h3 key={i} className="text-base font-semibold mt-3 mb-1">
            {line.slice(4)}
          </h3>
        )
      if (line.startsWith('```')) return null
      if (line.startsWith('- ')) {
        const parts = line.slice(2).split(/\*\*(.+?)\*\*/g)
        return (
          <li key={i} className="text-sm ml-4 list-disc mb-1">
            {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
          </li>
        )
      }
      if (line.startsWith('> '))
        return (
          <blockquote
            key={i}
            className="border-l-4 border-primary/40 pl-4 py-1 text-sm text-muted-foreground italic my-2"
          >
            {line.slice(2)}
          </blockquote>
        )
      if (line.trim() === '') return <div key={i} className="h-2" />
      const parts = line.split(/\*\*(.+?)\*\*/g)
      return (
        <p key={i} className="text-sm leading-relaxed">
          {parts.map((p, j) => (j % 2 === 1 ? <strong key={j}>{p}</strong> : p))}
        </p>
      )
    })
  }

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-4">
      <h2 className="text-lg font-semibold flex items-center gap-2">📖 Reading Content</h2>
      <div className="prose-wrapper space-y-1 text-foreground">{renderMarkdown(content.markdown_content)}</div>
      <div className="border-t pt-4">
        <p className="text-xs text-muted-foreground">Raw Markdown (copy to editor):</p>
        <pre className="mt-2 text-xs font-mono bg-muted/50 rounded-md p-3 overflow-x-auto max-h-48 whitespace-pre-wrap break-words">
          {content.markdown_content}
        </pre>
      </div>
    </div>
  )
}

function CodingContentDisplay({ content }: { content: CodingContent }) {
  const [showSolution, setShowSolution] = useState(false)
  if (!content || !content.test_cases) return null
  const visibleTests = content.test_cases.filter(t => !t.hidden)
  const hiddenCount = content.test_cases.filter(t => t.hidden).length

  return (
    <div className="space-y-4">
      <div className="rounded-xl border bg-card p-6 shadow-sm space-y-2">
        <h2 className="text-lg font-semibold">💻 Problem Statement</h2>
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
          {content.problem_statement}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
          <h3 className="text-sm font-semibold">📝 Boilerplate Code</h3>
          <pre className="text-xs font-mono bg-muted/50 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words">
            {content.initial_code}
          </pre>
        </div>
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">✅ Reference Solution</h3>
            <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setShowSolution(s => !s)}>
              {showSolution ? 'Hide' : 'Show'}
            </Button>
          </div>
          {showSolution ? (
            <pre className="text-xs font-mono bg-muted/50 rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words">
              {content.solution}
            </pre>
          ) : (
            <div className="flex items-center justify-center h-20 rounded-md bg-muted/20 border border-dashed text-sm text-muted-foreground">
              Click &quot;Show&quot; to reveal the solution
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">🧪 Test Cases</h3>
          <Badge variant="outline" className="text-xs">
            {hiddenCount} hidden
          </Badge>
        </div>
        <div className="space-y-2">
          {visibleTests.map((tc, i) => (
            <div key={i} className="flex items-start gap-4 rounded-lg bg-muted/30 border px-4 py-3 text-xs font-mono">
              <div className="text-muted-foreground">#{i + 1}</div>
              <div className="flex-1">
                <p>
                  <span className="text-blue-600">Input: </span>
                  {tc.input}
                </p>
                <p>
                  <span className="text-green-600">Output: </span>
                  {tc.output}
                </p>
              </div>
            </div>
          ))}
          {hiddenCount > 0 && (
            <div className="flex items-center justify-center rounded-lg border border-dashed py-3 text-xs text-muted-foreground">
              + {hiddenCount} hidden test case(s) — only visible during evaluation
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function QuizContentDisplay({ content }: { content: QuizContent }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  if (!content || !content.questions) return null

  const score = submitted ? content.questions.filter((q, i) => answers[i] === q.ans).length : null

  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">📝 Quiz — {content.questions.length} Questions</h2>
        {score !== null && (
          <Badge variant={score >= content.questions.length * 0.7 ? 'default' : 'destructive'}>
            Score: {score}/{content.questions.length}
          </Badge>
        )}
      </div>

      <div className="space-y-6">
        {content.questions.map((question, qi) => {
          const answered = answers[qi] !== undefined
          const correct = submitted && answers[qi] === question.ans
          const wrong = submitted && answered && !correct

          return (
            <div
              key={qi}
              className={`rounded-lg border p-4 space-y-3 transition-colors ${submitted ? (correct ? 'border-green-300 bg-green-50/30 dark:bg-green-950/10' : wrong ? 'border-red-300 bg-red-50/30 dark:bg-red-950/10' : 'opacity-70') : ''}`}
            >
              <p className="text-sm font-medium">{question.q}</p>
              <div className="space-y-2">
                {question.options.map((opt, oi) => {
                  const isSelected = answers[qi] === oi
                  const isCorrect = question.ans === oi
                  let optClass = 'border hover:border-primary/50 hover:bg-muted/30 cursor-pointer'
                  if (submitted && isCorrect)
                    optClass = 'border-green-400 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                  else if (submitted && isSelected && !isCorrect)
                    optClass = 'border-red-400 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400'
                  else if (isSelected) optClass = 'border-primary bg-primary/5'

                  return (
                    <div
                      key={oi}
                      onClick={() => !submitted && setAnswers(prev => ({ ...prev, [qi]: oi }))}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${optClass}`}
                    >
                      <div
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-muted-foreground/30'}`}
                      >
                        {String.fromCharCode(65 + oi)}
                      </div>
                      {opt}
                    </div>
                  )
                })}
              </div>
              {submitted && (
                <div className="rounded-md bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
                  💡 {question.explanation}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex gap-3 pt-2">
        {!submitted ? (
          <Button
            onClick={() => setSubmitted(true)}
            disabled={Object.keys(answers).length < content.questions.length}
            className="w-full"
          >
            Submit Quiz
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={() => {
              setAnswers({})
              setSubmitted(false)
            }}
            className="w-full"
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<LessonDto | null>(null)
  const [chapter, setChapter] = useState<ChapterDto | null>(null)
  const [course, setCourse] = useState<CourseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [aiContent, setAiContent] = useState<AiContent | null>(null)

  const [form, setForm] = useState<UpdateLessonRequest>({
    chapterId: '',
    courseId: '',
    title: '',
    lessonType: LessonType.Video,
    position: 1
  })

  useEffect(() => {
    const fetchLesson = async () => {
      setLoading(true)
      try {
        const l = await lessonService.getById(id)
        setLesson(l)
        setForm({
          chapterId: l?.chapterId || '',
          courseId: l?.courseId || '',
          title: l?.title || '',
          lessonType: l?.lessonType || LessonType.Video,
          position: l?.position || 1
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
        // Load AI content from localStorage
        const stored = localStorage.getItem(`ai_lesson_content_${id}`)
        if (stored) {
          try {
            setAiContent(JSON.parse(stored))
          } catch {
            /* ignore */
          }
        }
      } catch {
        toast.error('Lesson not found.')
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
      toast.success('Lesson updated successfully.')
      const updated = await lessonService.getById(id)
      setLesson(updated)
    } catch {
      toast.error('Failed to update lesson.')
    } finally {
      setSaving(false)
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
    return <div className="text-center py-16 text-muted-foreground">Lesson not found.</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => router.push(`/management/chapters/${lesson.chapterId}`)}
          className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-lg border hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <Link
              href={`/management/courses/${lesson.courseId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {course ? course.title : lesson.courseName || 'Course'}
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <Link
              href={`/management/chapters/${lesson.chapterId}`}
              className="text-sm font-medium text-primary hover:underline"
            >
              {chapter ? chapter.title : lesson.chapterName || 'Chapter'}
            </Link>
            <span className="text-muted-foreground text-sm">/</span>
            <span className="text-sm text-muted-foreground">Lesson {lesson.position}</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold truncate">{lesson.title}</h1>
            {aiContent && (
              <Badge variant="outline" className="text-purple-600 border-purple-300 gap-1 shrink-0">
                <Sparkles className="h-3 w-3" /> AI Generated
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Editor Card */}
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Lesson Information</h2>
        <div className="space-y-4 max-w-2xl">
          <div className="space-y-1.5">
            <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={form.lessonType}
                onValueChange={v => setForm(prev => ({ ...prev, lessonType: v as LessonType }))}
              >
                <SelectTrigger>
                  <SelectValue>{form.lessonType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.values(LessonType).map(t => (
                    <SelectItem key={t} value={t}>
                      {t}
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
                value={form.position}
                onChange={e => setForm(prev => ({ ...prev, position: Number(e.target.value) }))}
              />
            </div>
          </div>
          <div className="pt-2 flex justify-end">
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </div>

      {/* AI Outline Generator */}
      <AiMaterialSection lessonId={id} />

      {/* Video upload always available for Video-type lessons */}
      {form.lessonType === LessonType.Video && <VideoUploadSection lessonId={id} />}
    </div>
  )
}
