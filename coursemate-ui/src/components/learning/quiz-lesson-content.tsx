'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { lessonService } from '@/lib/course-service'
import { QuizQuestionDto } from '@/lib/types'
import { toast } from 'sonner'
import { CheckCircle, HelpCircle, XCircle, Eye } from 'lucide-react'
import { QuizContent, QuizQuestionAnswer } from '@/components/learning/lesson-content.types'

type QuizQuestionViewModel =
  | {
      id: string
      text: string
      answers: QuizQuestionAnswer[]
    }
  | {
      id: string
      text: string
      answers: Array<{ id: string; text: string; isCorrect: boolean }>
    }

function fromDto(questions: QuizQuestionDto[]): QuizQuestionViewModel[] {
  return questions.map((question, index) => ({
    id: question.id ?? `quiz-${index}`,
    text: question.text,
    answers:
      question.answers?.map((answer, answerIndex) => ({
        id: answer.id ?? `${question.id ?? index}-${answerIndex}`,
        text: answer.text,
        isCorrect: answer.isCorrect
      })) ?? []
  }))
}

function fromAiContent(content: QuizContent): QuizQuestionViewModel[] {
  return content.questions.map((question, index) => ({
    id: `ai-${index}`,
    text: question.q,
    answers: question.options.map((option, optionIndex) => ({
      id: `ai-${index}-${optionIndex}`,
      text: option,
      isCorrect: optionIndex === question.ans
    }))
  }))
}

export function QuizLessonContent({
  lessonId,
  passingScore,
  questions,
  aiContent
}: {
  lessonId: string
  passingScore: number
  questions?: QuizQuestionDto[]
  aiContent?: QuizContent | null
}) {
  const items = useMemo(() => {
    if (questions && questions.length > 0) {
      return fromDto(questions)
    }

    if (aiContent) {
      return fromAiContent(aiContent)
    }

    return []
  }, [aiContent, questions])

  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const correctCount = items.filter((question, index) => {
    const selectedAnswerId = answers[index]
    const correctAnswer = question.answers.find(answer => answer.isCorrect)
    return selectedAnswerId === correctAnswer?.id
  }).length

  const score = items.length > 0 ? Math.round((correctCount / items.length) * 100) : 0
  const passed = score >= passingScore

  const handleSubmit = async () => {
    if (Object.keys(answers).length < items.length) {
      toast.error('Vui lòng trả lời đầy đủ câu hỏi!')
      return
    }

    setSubmitted(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })

    try {
      await lessonService.updateProgress(lessonId, passed, score)
    } catch (error) {
      console.error('Failed to update progress', error)
    }
  }

  return (
    <div className="w-full space-y-6 py-3">
      <div className="mb-6 flex flex-col items-center space-y-2 text-center">
        <div className="mb-1.5 flex h-14 w-14 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
          <HelpCircle className="h-7 w-7" />
        </div>
        <h2 className="text-2xl font-bold">Kiểm tra kiến thức</h2>
        <p className="text-[13px] text-muted-foreground">
          Hãy hoàn thành bài trắc nghiệm dưới đây để củng cố kiến thức đã học.
        </p>
        <div className="mt-2 flex gap-2">
          <Badge variant="secondary" className="px-3">
            {items.length} Câu hỏi
          </Badge>
          <Badge variant="outline" className="px-3">
            Cần đạt {passingScore}% để vượt qua
          </Badge>
        </div>
      </div>

      <div className="space-y-6">
        {items.map((question, questionIndex) => (
          <div
            key={question.id}
            className={`space-y-4 rounded-xl border bg-card p-5 shadow-sm transition-all ${
              submitted
                ? question.answers.find(answer => answer.id === answers[questionIndex])?.isCorrect
                  ? 'border-emerald-500/30 ring-2 ring-emerald-500/20'
                  : 'border-red-500/30 ring-2 ring-red-500/20'
                : 'border-border'
            }`}
          >
            <div className="flex gap-4">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-bold text-primary">
                {questionIndex + 1}
              </span>
              <p className="pt-0.5 text-base font-bold leading-tight">{question.text}</p>
            </div>

            <div className="ml-10 grid grid-cols-1 gap-2.5">
              {question.answers.map(answer => {
                const isSelected = answers[questionIndex] === answer.id
                const isCorrect = answer.isCorrect

                let buttonClass = 'border-2 border-transparent bg-muted/30 hover:bg-muted/50'
                if (submitted) {
                  if (isCorrect) {
                    buttonClass = 'border-emerald-500 bg-emerald-50 font-bold text-emerald-700'
                  } else if (isSelected) {
                    buttonClass = 'border-red-500 bg-red-50 text-red-700'
                  } else {
                    buttonClass = 'cursor-not-allowed opacity-50 grayscale'
                  }
                } else if (isSelected) {
                  buttonClass = 'border-primary bg-primary/5 ring-2 ring-primary/20'
                }

                return (
                  <button
                    key={answer.id}
                    type="button"
                    disabled={submitted}
                    onClick={() => setAnswers(previous => ({ ...previous, [questionIndex]: answer.id ?? '' }))}
                    className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-all ${buttonClass}`}
                  >
                    <div
                      className={`flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors ${
                        isSelected ? 'bg-primary text-white' : 'text-muted-foreground/30'
                      }`}
                    >
                      {isSelected && <CheckCircle className="h-3 w-3" />}
                    </div>
                    <span className="text-[13px] font-medium">{answer.text}</span>
                    {submitted && isCorrect && <CheckCircle className="ml-auto h-4 w-4 text-emerald-500" />}
                    {submitted && isSelected && !isCorrect && <XCircle className="ml-auto h-4 w-4 text-red-500" />}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="pt-8">
        {!submitted ? (
          <Button
            size="lg"
            className="h-12 w-full rounded-xl text-base font-bold shadow-lg shadow-primary/20"
            disabled={Object.keys(answers).length < items.length}
            onClick={handleSubmit}
          >
            Nộp bài làm
          </Button>
        ) : (
          <div className="space-y-5 text-center">
            <div
              className={`rounded-2xl p-8 ${
                passed ? 'bg-emerald-50 dark:bg-emerald-950/10' : 'bg-red-50 dark:bg-red-950/10'
              }`}
            >
              <div
                className={`mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full ${
                  passed ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'
                }`}
              >
                {passed ? <CheckCircle className="h-8 w-8" /> : <HelpCircle className="h-8 w-8" />}
              </div>
              <p className="mb-1 text-sm font-bold uppercase tracking-widest text-muted-foreground">Kết quả của bạn</p>
              <h3 className={`mb-2 text-5xl font-black ${passed ? 'text-emerald-600' : 'text-red-600'}`}>{score}%</h3>
              <p className="text-base font-semibold">
                {passed ? '🎉 Tuyệt vời! Bạn đã vượt qua bài kiểm tra.' : '💪 Hãy ôn tập lại và thử lại nhé.'}
              </p>
              <p className="mt-2 text-[13px] text-muted-foreground">
                Bạn trả lời đúng {correctCount}/{items.length} câu hỏi.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="lg"
                className="h-12 flex-1 rounded-xl"
                onClick={() => {
                  setAnswers({})
                  setSubmitted(false)
                }}
              >
                Làm lại
              </Button>
              <Button size="lg" className="h-12 flex-1 rounded-xl" asChild>
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
