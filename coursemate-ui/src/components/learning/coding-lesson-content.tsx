'use client'

import { useEffect, useState } from 'react'
import { ExerciseEditorModal, ExerciseData } from '@/components/exercises/exercise-editor-modal'
import { exerciseService } from '@/lib/exercise-service'
import { lessonService } from '@/lib/course-service'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Play, Terminal } from 'lucide-react'
import { toast } from 'sonner'
import { CodingContent, mapExerciseDetailToExerciseData } from '@/components/learning/lesson-content.types'
import { ExerciseDetailDto } from '@/lib/types'

function CodingFallback({ content }: { content: CodingContent }) {
  return (
    <div className="grid grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] gap-5">
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-bold">
            <div className="h-5 w-1 rounded-full bg-purple-500" />
            Đề bài
          </h2>
          <div className="prose prose-sm max-w-none text-[13px] text-muted-foreground dark:prose-invert">
            {content.problem_statement}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-bold">Bộ kiểm thử mẫu</h3>
          <div className="space-y-2.5">
            {content.test_cases
              .filter(testCase => !testCase.hidden)
              .map((testCase, index) => (
                <div key={`${testCase.input}-${index}`} className="rounded-lg bg-muted/50 p-3 font-mono text-[11px]">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="mb-1 block font-bold text-blue-600">ĐẦU VÀO</span>
                      <code className="text-foreground/80">{testCase.input}</code>
                    </div>
                    <div>
                      <span className="mb-1 block font-bold text-emerald-600">KẾT QUẢ MONG ĐỢI</span>
                      <code className="text-foreground/80">{testCase.output}</code>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col overflow-hidden rounded-xl bg-slate-900 shadow-2xl ring-1 ring-white/10">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500/50" />
            <div className="h-3 w-3 rounded-full bg-amber-500/50" />
            <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-widest text-white/40">editor</span>
          </div>
          <Badge variant="outline" className="border-white/10 text-[10px] text-white/40">
            Coding
          </Badge>
        </div>
        <pre className="flex-1 overflow-auto p-5 font-mono text-[13px] text-white/90">{content.initial_code}</pre>
        <div className="flex gap-3 border-t border-white/10 bg-white/5 p-4">
          <Button
            size="sm"
            variant="ghost"
            className="border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
          >
            <Play className="mr-2 h-4 w-4" />
            Xem mã mẫu
          </Button>
          <Button size="sm" className="flex-1 bg-emerald-600 text-white hover:bg-emerald-500">
            <Terminal className="mr-2 h-4 w-4" />
            Bài tập sẽ khả dụng sau
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CodingLessonContent({
  exerciseId,
  lessonId,
  fallbackContent
}: {
  exerciseId?: string
  lessonId: string
  fallbackContent?: CodingContent | null
}) {
  const [exercise, setExercise] = useState<ExerciseData | null>(null)
  const [loading, setLoading] = useState(Boolean(exerciseId))

  useEffect(() => {
    if (!exerciseId) {
      setLoading(false)
      return
    }

    const loadExercise = async () => {
      setLoading(true)
      try {
        const response = await exerciseService.getStudentExerciseById(exerciseId)
        setExercise(mapExerciseDetailToExerciseData(response as ExerciseDetailDto))
      } catch {
        toast.error('Không thể tải bài tập.')
      } finally {
        setLoading(false)
      }
    }

    loadExercise()
  }, [exerciseId])

  const handleExerciseSuccess = async (result: { score: number; passed: boolean }) => {
    try {
      await lessonService.updateProgress(lessonId, result.passed, result.score)
      if (result.passed) {
        toast.success('Tuyệt vời! Bạn đã hoàn thành bài tập.')
      }
    } catch (error) {
      console.error('Failed to update progress', error)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (exercise) {
    return (
      <div className="h-[720px] overflow-hidden rounded-xl shadow-2xl">
        <ExerciseEditorModal
          exercise={exercise}
          isModal={false}
          showHeaderNav={false}
          onSubmitSuccess={handleExerciseSuccess}
        />
      </div>
    )
  }

  if (fallbackContent) {
    return <CodingFallback content={fallbackContent} />
  }

  return null
}
