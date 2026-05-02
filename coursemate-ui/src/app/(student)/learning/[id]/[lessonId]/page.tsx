'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { courseService } from '@/lib/course-service'
import { LessonType, StudentLessonDetailDto, CourseDto, RunCodeResponse, CourseDetailDto } from '@/lib/types'
import { lessonService } from '@/lib/course-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Loader2, ChevronLeft, ChevronRight, PlayCircle, FileText, HelpCircle, Sparkles, Code2, Presentation, Download, CheckCircle, XCircle, Terminal, Send, Eye } from 'lucide-react'
import { exerciseService } from '@/lib/exercise-service'
import { runnerCodeService } from '@/lib/runner-code-service'
import { ExerciseEditorModal, type ExerciseData, type Difficulty } from '@/components/exercises/exercise-editor-modal'

function mapToExerciseData(dto: any): ExerciseData {
  return {
    id: dto.id,
    title: dto.title,
    difficulty: dto.difficulty as Difficulty,
    category: dto.category,
    description: dto.description,
    examples: dto.examples || [],
    constraints: dto.constraints || [],
    hints: dto.hints || [],
    defaultCode: dto.defaultCodes?.reduce((acc: any, curr: any) => {
      acc[curr.language] = curr.starterCode || curr.code
      return acc
    }, {}) || {},
    testCases: dto.testCases?.map((tc: any) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      description: tc.description,
      isHidden: tc.isHidden
    })) || []
  }
}

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

function VideoPlayer({ content }: { content: VideoContent }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="aspect-video rounded-2xl bg-slate-900 flex items-center justify-center border shadow-2xl overflow-hidden group relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <PlayCircle className="h-16 w-16 text-white/50 group-hover:text-white group-hover:scale-110 transition-all cursor-pointer" />
        <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
          <p className="font-medium">{content.title}</p>
          <p className="text-xs text-white/70">Video placeholder — actual player integrated here</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <div className="h-8 w-1 bg-primary rounded-full" />
            Video Transcript
          </h3>
          <div className="space-y-3">
            {content.segments.map((seg, i) => (
              <div
                key={i}
                className="group p-4 rounded-xl border bg-card hover:border-primary/30 transition-all cursor-default relative overflow-hidden"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2 inline-block font-bold">
                  {seg.time}
                </span>
                <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                  {seg.script}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <div className="h-6 w-1 bg-blue-500 rounded-full" />
            Key Moments
          </h3>
          <div className="rounded-xl border bg-card/50 overflow-hidden">
            {content.timestamps.map((ts, i) => (
              <button
                key={i}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/80 text-left border-b last:border-0 transition-colors group"
              >
                <span className="text-xs font-mono font-bold text-blue-600 group-hover:scale-110 transition-transform">
                  {ts.time}
                </span>
                <span className="text-xs font-medium truncate">{ts.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function EmptyContent({ lesson, id, router }: { lesson: any; id: string; router: any }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-6 bg-muted/20 border border-dashed rounded-3xl animate-in fade-in zoom-in duration-500">
      <div className="h-20 w-20 bg-background rounded-3xl shadow-sm border flex items-center justify-center text-muted-foreground rotate-3">
        {lesson.lessonType === LessonType.Video ? (
          <PlayCircle className="h-10 w-10" />
        ) : (
          <FileText className="h-10 w-10" />
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-bold">Content Coming Soon</h3>
        <p className="text-muted-foreground max-w-sm">
          We&apos;re currently preparing the {lesson.lessonType?.toString().toLowerCase()} material for this
          lesson. Please check back later!
        </p>
      </div>
      <Button variant="secondary" onClick={() => router.push(`/courses/${id}`)}>
        Explore Syllabus
      </Button>
    </div>
  )
}

function ReadingView({ content }: { content: ReadingContent }) {
  const renderMarkdown = (md: string) => {
    return md.split('\n').map((line, i) => {
      if (line.startsWith('# '))
        return (
          <h1 key={i} className="text-3xl font-bold mt-8 mb-4 text-primary">
            {line.slice(2)}
          </h1>
        )
      if (line.startsWith('## '))
        return (
          <h2 key={i} className="text-2xl font-bold mt-6 mb-3 border-b-2 border-primary/10 pb-1 inline-block">
            {line.slice(3)}
          </h2>
        )
      if (line.startsWith('### '))
        return (
          <h3 key={i} className="text-xl font-semibold mt-4 mb-2 text-foreground/80">
            {line.slice(4)}
          </h3>
        )
      if (line.startsWith('```')) return null
      if (line.startsWith('- '))
        return (
          <li key={i} className="text-base ml-6 list-disc mb-2 text-muted-foreground leading-relaxed">
            {line.slice(2)}
          </li>
        )
      if (line.startsWith('> '))
        return (
          <blockquote
            key={i}
            className="border-l-4 border-primary pl-6 py-4 text-lg text-foreground/80 italic my-6 bg-primary/5 rounded-r-xl"
          >
            {line.slice(2)}
          </blockquote>
        )
      if (line.trim() === '') return <div key={i} className="h-4" />
      return (
        <p key={i} className="text-base leading-relaxed text-muted-foreground mb-4">
          {line}
        </p>
      )
    })
  }

  return (
    <div className="max-w-3xl mx-auto py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="prose prose-slate dark:prose-invert max-w-none">{renderMarkdown(content.markdown_content)}</div>
    </div>
  )
}

function SlideView({ fileUrl, title }: { fileUrl: string; title: string }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="aspect-video rounded-2xl bg-muted/30 border shadow-sm overflow-hidden relative flex flex-col items-center justify-center">
        <iframe
          src={`${fileUrl}#toolbar=0`}
          className="w-full h-full border-0"
          title={title}
        />
        <div className="absolute top-4 right-4">
          <Button variant="secondary" size="sm" asChild className="gap-2 shadow-lg">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              <Download className="h-4 w-4" /> Download Slide
            </a>
          </Button>
        </div>
      </div>
      <div className="p-6 rounded-2xl border bg-card/50 flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shrink-0">
          <Presentation className="h-6 w-6" />
        </div>
        <div>
          <h3 className="font-bold">{title}</h3>
          <p className="text-sm text-muted-foreground">Bạn có thể xem trực tiếp hoặc tải tài liệu về máy để ôn tập.</p>
        </div>
      </div>
    </div>
  )
}

function CodingExercise({ exerciseId, lessonId }: { exerciseId: string, lessonId: string }) {
  const [exercise, setExercise] = useState<ExerciseData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadExercise = async () => {
      setLoading(true)
      try {
        const res = await exerciseService.getStudentExerciseById(exerciseId)
        setExercise(mapToExerciseData(res))
      } catch (e) {
        toast.error('Failed to load exercise')
      } finally {
        setLoading(false)
      }
    }
    loadExercise()
  }, [exerciseId])

  const handleExerciseSuccess = async (result: { score: number, passed: boolean }) => {
    try {
      await lessonService.updateProgress(lessonId, result.passed, result.score)
      if (result.passed) {
        toast.success('Tuyệt vời! Bạn đã hoàn thành bài tập.')
      }
    } catch (e) {
      console.error('Failed to update progress', e)
    }
  }

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin" /></div>
  if (!exercise) return <div className="text-center p-12 text-muted-foreground">Exercise not found</div>

  return (
    <div className="h-[750px] rounded-2xl overflow-hidden border shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
      <ExerciseEditorModal 
        exercise={exercise} 
        isModal={false} 
        showHeaderNav={false} 
        onSubmitSuccess={handleExerciseSuccess}
      />
    </div>
  )
}

function QuizInteraction({ questions, passingScore, lessonId }: { questions: any[]; passingScore: number; lessonId: string }) {
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const correctCount = questions.filter((q, i) => {
    const selectedAnswerId = answers[i]
    const correctAnswer = q.answers.find((a: any) => a.isCorrect)
    return selectedAnswerId === correctAnswer?.id
  }).length

  const score = Math.round((correctCount / questions.length) * 100)
  const pass = score >= passingScore

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error('Vui lòng trả lời đầy đủ câu hỏi!')
      return
    }
    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      await lessonService.updateProgress(lessonId, pass, score)
    } catch (e) {
      console.error('Failed to update progress', e)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-2">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold">Kiểm tra kiến thức</h2>
        <p className="text-muted-foreground">Hãy hoàn thành bài trắc nghiệm dưới đây để củng cố kiến thức đã học.</p>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className="px-3">
            {questions.length} Câu hỏi
          </Badge>
          <Badge variant="outline" className="px-3">
            Cần đạt {passingScore}% để vượt qua
          </Badge>
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, qi) => (
          <div
            key={q.id || qi}
            className={`p-6 rounded-2xl border bg-card shadow-sm space-y-5 transition-all ${submitted
                ? (q.answers.find((a: any) => a.id === answers[qi])?.isCorrect ? 'ring-2 ring-emerald-500/20 border-emerald-500/30' : 'ring-2 ring-red-500/20 border-red-500/30')
                : ''
              }`}
          >
            <div className="flex gap-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                {qi + 1}
              </span>
              <p className="font-bold text-lg leading-tight pt-0.5">{q.text}</p>
            </div>

            <div className="grid grid-cols-1 gap-3 ml-11">
              {q.answers.map((opt: any, oi: number) => {
                const isSelected = answers[qi] === opt.id
                const isCorrect = opt.isCorrect

                let btnClass = 'border-2 border-transparent bg-muted/30 hover:bg-muted/50'
                if (submitted) {
                  if (isCorrect) btnClass = 'border-emerald-500 bg-emerald-50 text-emerald-700 font-bold'
                  else if (isSelected) btnClass = 'border-red-500 bg-red-50 text-red-700'
                  else btnClass = 'opacity-50 grayscale cursor-not-allowed'
                } else if (isSelected) {
                  btnClass = 'border-primary bg-primary/5 ring-2 ring-primary/20'
                }

                return (
                  <button
                    key={opt.id || oi}
                    disabled={submitted}
                    onClick={() => setAnswers(p => ({ ...p, [qi]: opt.id! }))}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all group ${btnClass}`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold shrink-0 transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'
                        }`}
                    >
                      {isSelected && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <span className="text-sm font-medium">{opt.text}</span>
                    {submitted && isCorrect && <CheckCircle className="ml-auto h-4 w-4 text-emerald-500" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="ml-auto h-4 w-4 text-red-500" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-10 border-t">
        {!submitted ? (
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20 rounded-2xl"
            disabled={Object.keys(answers).length < questions.length}
            onClick={handleSubmit}
          >
            Nộp bài làm
          </Button>
        ) : (
          <div className="text-center space-y-6">
            <div
              className={`p-10 rounded-3xl border-4 animate-in zoom-in duration-500 ${pass
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/10'
                  : 'border-red-500 bg-red-50 dark:bg-red-950/10'
                }`}
            >
              <div className={`h-20 w-20 mx-auto rounded-full flex items-center justify-center mb-4 ${pass ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                {pass ? <CheckCircle className="h-10 w-10" /> : <HelpCircle className="h-10 w-10" />}
              </div>
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Kết quả của bạn</p>
              <h3 className={`text-6xl font-black mb-2 ${pass ? 'text-emerald-600' : 'text-red-600'}`}>
                {score}%
              </h3>
              <p className="text-lg font-semibold">
                {pass ? '🎉 Tuyệt vời! Bạn đã vượt qua bài kiểm tra.' : '💪 Đừng nản chí! Hãy ôn tập lại và thử lại nhé.'}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Bạn trả lời đúng {correctCount}/{questions.length} câu hỏi.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="flex-1 h-14 rounded-2xl"
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                }}
              >
                Làm lại
              </Button>
              <Button
                size="lg"
                className="flex-1 h-14 rounded-2xl"
                asChild
              >
                <a href="#top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                  Xem lại đáp án <Eye className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function CodingExerciseOld({ content }: { content: CodingContent }) {
  const [userCode, setUserCode] = useState(content.initial_code)

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-6">
        <div className="rounded-2xl border bg-card p-6 shadow-sm flex-1 overflow-y-auto">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <div className="h-6 w-1 bg-purple-500 rounded-full" />
            Problem Statement
          </h2>
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            {content.problem_statement}
          </div>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm overflow-hidden">
          <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
            <div className="h-4 w-1 bg-amber-500 rounded-full" />
            Example Test Cases
          </h3>
          <div className="space-y-3">
            {content.test_cases
              .filter(t => !t.hidden)
              .map((tc, i) => (
                <div
                  key={i}
                  className="group rounded-xl bg-muted/50 border p-3 font-mono text-xs relative overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-blue-600 block mb-1 font-bold">INPUT</span>
                      <code className="text-foreground/80">{tc.input}</code>
                    </div>
                    <div>
                      <span className="text-emerald-600 block mb-1 font-bold">EXPECTED</span>
                      <code className="text-foreground/80">{tc.output}</code>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex-1 rounded-2xl border bg-slate-900 shadow-2xl flex flex-col overflow-hidden ring-1 ring-white/10">
          <div className="px-4 py-2 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-amber-500/50" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
              <span className="text-[10px] font-mono text-white/40 ml-2 uppercase tracking-widest">editor.py</span>
            </div>
            <Badge variant="outline" className="text-[10px] text-white/40 border-white/10">
              Python 3.10
            </Badge>
          </div>
          <textarea
            value={userCode}
            onChange={e => setUserCode(e.target.value)}
            className="flex-1 w-full p-6 bg-transparent text-white font-mono text-sm resize-none outline-none caret-emerald-500"
            spellCheck={false}
          />
          <div className="p-4 border-t border-white/10 bg-white/5 flex gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="text-white/60 hover:text-white hover:bg-white/10 border border-white/10"
            >
              Run Code
            </Button>
            <Button
              size="sm"
              className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
            >
              Submit Solution
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuizInteractionOld({ content }: { content: QuizContent }) {
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const correctCount = content.questions.filter((q, i) => answers[i] === q.ans).length
  const pass = correctCount >= content.questions.length * 0.7

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col items-center text-center space-y-2 mb-8">
        <div className="h-16 w-16 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-2">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-3xl font-bold">Knowledge Check</h2>
        <p className="text-muted-foreground">Test your understanding of the current topic with this brief quiz.</p>
        <Badge variant="outline" className="mt-2">
          {content.questions.length} Questions • 70% to Pass
        </Badge>
      </div>

      <div className="space-y-6">
        {content.questions.map((q, qi) => (
          <div
            key={qi}
            className={`p-6 rounded-2xl border bg-card shadow-sm space-y-4 transition-all ${submitted && answers[qi] === q.ans ? 'ring-2 ring-emerald-500/20 border-emerald-500/30' : ''}`}
          >
            <p className="font-bold text-lg leading-snug">
              <span className="text-primary mr-2">Q{qi + 1}.</span> {q.q}
            </p>
            <div className="grid grid-cols-1 gap-3">
              {q.options.map((opt, oi) => {
                const isSelected = answers[qi] === oi
                const isCorrect = q.ans === oi
                let btnClass = 'border-2 hover:border-primary/50 hover:bg-primary/5'
                if (submitted) {
                  if (isCorrect) btnClass = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 font-bold'
                  else if (isSelected) btnClass = 'border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700'
                  else btnClass = 'opacity-50 grayscale cursor-not-allowed'
                } else if (isSelected) {
                  btnClass = 'border-primary bg-primary/5 ring-4 ring-primary/10'
                }

                return (
                  <button
                    key={oi}
                    disabled={submitted}
                    onClick={() => setAnswers(p => ({ ...p, [qi]: oi }))}
                    className={`flex items-center gap-4 px-5 py-4 rounded-xl text-left transition-all ${btnClass}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? 'border-primary bg-primary text-white' : 'border-muted-foreground/30'}`}
                    >
                      {String.fromCharCode(65 + oi)}
                    </div>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8 border-t">
        {!submitted ? (
          <Button
            size="lg"
            className="w-full h-14 text-lg font-bold shadow-xl shadow-primary/20"
            disabled={Object.keys(answers).length < content.questions.length}
            onClick={() => setSubmitted(true)}
          >
            Complete Quiz
          </Button>
        ) : (
          <div className="text-center space-y-6">
            <div
              className={`p-8 rounded-3xl border-4 ${pass ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' : 'border-red-500 bg-red-50 dark:bg-red-950/20'}`}
            >
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground mb-1">Your Result</p>
              <h3 className={`text-5xl font-black mb-2 ${pass ? 'text-emerald-600' : 'text-red-600'}`}>
                {Math.round((correctCount / content.questions.length) * 100)}%
              </h3>
              <p className="font-semibold">
                {pass ? '🎉 Excellent! You PASSED.' : '💪 Keep practicing. You can do it!'}
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                setAnswers({})
                setSubmitted(false)
              }}
            >
              Retry Quiz
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function StudentLearningPage() {
  const { id, lessonId } = useParams<{ id: string; lessonId: string }>()
  const router = useRouter()

  const [lesson, setLesson] = useState<StudentLessonDetailDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [aiContent, setAiContent] = useState<AiContent | null>(null)

  // For navigation
  const [prevLessonId, setPrevLessonId] = useState<string | null>(null)
  const [nextLessonId, setNextLessonId] = useState<string | null>(null)

  useEffect(() => {
    const loadContent = async () => {
      if (!lessonId) return
      setLoading(true)
      try {
        const [l, course] = await Promise.all([courseService.getLessonDetail(lessonId), courseService.getById(id)])
        setLesson(l as unknown as StudentLessonDetailDto)

        // Load AI content from storage
        const stored = localStorage.getItem(`ai_lesson_content_${lessonId}`)
        if (stored) {
          try {
            setAiContent(JSON.parse(stored))
          } catch (e) {
            console.error('Parse AI error:', e)
          }
        }

        // Calculate navigation
        if (course) {
          const courseDto = course as unknown as CourseDetailDto
          const allLessons = courseDto.chapters?.flatMap(c => c.lessons) || []
          const idx = allLessons.findIndex(x => x.id === lessonId)
          setPrevLessonId(idx > 0 ? allLessons[idx - 1].id : null)
          setNextLessonId(idx < allLessons.length - 1 ? allLessons[idx + 1].id : null)
        }
      } catch (err) {
        console.error(err)
        toast.error('Failed to load lesson content.')
      } finally {
        setLoading(false)
      }
    }
    loadContent()
  }, [id, lessonId])

  useEffect(() => {
    if (!lesson || !lessonId) return

    // Auto-complete for non-interactive types
    if ([LessonType.Video, LessonType.Reading, LessonType.Slide].includes(lesson.lessonType)) {
      const markAsComplete = async () => {
        try {
          await lessonService.updateProgress(lessonId as string, true, 100)
        } catch (e) {
          console.error('Failed to auto-complete lesson', e)
        }
      }
      // Delay slightly to ensure user actually "viewed" it
      const timer = setTimeout(markAsComplete, 5000)
      return () => clearTimeout(timer)
    }
  }, [lesson, lessonId])

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-sm font-medium text-muted-foreground animate-pulse">
            Preparing your learning environment...
          </p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground mb-2">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-2xl font-bold">Lesson Not Found</h2>
        <p className="text-muted-foreground max-w-xs">
          This lesson might have been moved or removed from the syllabus.
        </p>
        <Button onClick={() => router.push(`/courses/${id}`)}>Return to Course</Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full overflow-hidden max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge className="bg-emerald-500 text-white hover:bg-emerald-600 border-0 flex items-center gap-1">
              <Sparkles className="h-3 w-3" /> Học thử
            </Badge>
            <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-widest px-2 opacity-70">
              {lesson.lessonType || 'LESSON'}
            </Badge>
          </div>
          <h1 className="text-3xl font-black tracking-tight">{lesson.title}</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            disabled={!prevLessonId}
            onClick={() => prevLessonId && router.push(`/learning/${id}/${prevLessonId}`)}
            className="rounded-full px-5 h-11"
          >
            <ChevronLeft className="h-4 w-4 mr-2" /> Previous
          </Button>
          <Button
            disabled={!nextLessonId}
            onClick={() => nextLessonId && router.push(`/learning/${id}/${nextLessonId}`)}
            className="rounded-full px-8 h-11 shadow-lg shadow-primary/20"
          >
            Next Lesson <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="animate-in fade-in duration-700">
          {/* VIDEO */}
          {lesson.lessonType === LessonType.Video && (
            aiContent && 'segments' in aiContent
              ? <VideoPlayer content={aiContent as VideoContent} />
              : lesson.videoUrl ? (
                <div className="aspect-video rounded-3xl bg-slate-950 border shadow-2xl overflow-hidden ring-8 ring-muted/20">
                  {lesson.videoUrl.includes('youtube.com') || lesson.videoUrl.includes('youtu.be') ? (
                    <iframe
                      className="w-full h-full"
                      src={lesson.videoUrl.replace('watch?v=', 'embed/')}
                      title={lesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video 
                      src={lesson.videoUrl} 
                      controls 
                      className="w-full h-full"
                      controlsList="nodownload"
                    />
                  )}
                </div>
              ) : <EmptyContent lesson={lesson} id={id} router={router} />
          )}

          {/* READING */}
          {lesson.lessonType === LessonType.Reading && (
            lesson.readingContent
              ? <ReadingView content={{ title: lesson.title, markdown_content: lesson.readingContent }} />
              : aiContent && 'markdown_content' in aiContent
                ? <ReadingView content={aiContent as ReadingContent} />
                : <EmptyContent lesson={lesson} id={id} router={router} />
          )}

          {/* QUIZ */}
          {lesson.lessonType === LessonType.Quiz && (
            lesson.quizQuestions && lesson.quizQuestions.length > 0
              ? <QuizInteraction questions={lesson.quizQuestions} passingScore={lesson.quizPassingScore || 70} lessonId={lessonId as string} />
              : aiContent && 'questions' in aiContent
                ? <QuizInteractionOld content={aiContent as QuizContent} />
                : <EmptyContent lesson={lesson} id={id} router={router} />
          )}

          {/* CODING */}
          {lesson.lessonType === LessonType.Coding && (
            lesson.exerciseId
              ? <CodingExercise exerciseId={lesson.exerciseId} lessonId={lessonId as string} />
              : aiContent && 'test_cases' in aiContent
                ? <CodingExerciseOld content={aiContent as CodingContent} />
                : <EmptyContent lesson={lesson} id={id} router={router} />
          )}

          {/* QUIZ */}
          {lesson.lessonType === LessonType.Quiz && (
            lesson.quizQuestions && lesson.quizQuestions.length > 0
              ? <QuizInteraction questions={lesson.quizQuestions} passingScore={lesson.quizPassingScore || 70} lessonId={lessonId} />
              : aiContent && 'questions' in aiContent
                ? <QuizInteractionOld content={aiContent as QuizContent} />
                : <EmptyContent lesson={lesson} id={id} router={router} />
          )}

          {/* SLIDE */}
          {lesson.lessonType === LessonType.Slide && (
            lesson.slideFileUrl
              ? <SlideView fileUrl={lesson.slideFileUrl} title={lesson.title} />
              : <EmptyContent lesson={lesson} id={id} router={router} />
          )}
        </div>
      </div>

      {/* Footer / Progress Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t h-1 px-0 z-50">
        <div className="h-full bg-primary w-[35%] shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
      </div>
    </div>
  )
}
