'use client'

import { use, useState, useEffect } from 'react'
import Link from 'next/link'
import { Code2, Loader2 } from 'lucide-react'
import { ExerciseEditorModal, type ExerciseData, type Difficulty } from '@/components/exercises/exercise-editor-modal'
import { exerciseService } from '@/lib/exercise-service'
import type { ExerciseDto } from '@/lib/types'
import { useRouter } from 'next/navigation'

function mapToExerciseData(dto: any): ExerciseData {
  return {
    id: dto.id,
    title: dto.title,
    difficulty: dto.difficulty as Difficulty,
    category: dto.category,
    description: dto.description,
    // Parse examples from description or keep empty if not defined
    examples: dto.examples || [], 
    constraints: dto.constraints || [],
    hints: dto.hints || [],
    defaultCode: dto.defaultCodes?.reduce((acc: any, curr: any) => {
      // Dùng ID ngôn ngữ làm key (ví dụ: python-3.14)
      acc[curr.language] = curr.starterCode || curr.code
      return acc
    }, {}) || {},
    testCases: dto.testCases?.map((tc: any) => ({
      input: tc.input,
      expectedOutput: tc.expectedOutput,
      description: tc.description
    })) || []
  }
}

export default function ExerciseDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const router = useRouter()
  const [exercise, setExercise] = useState<ExerciseData | null>(null)
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [detail, listRes] = await Promise.all([
          exerciseService.getById(params.id),
          exerciseService.getList({ pageSize: 100 })
        ])
        setExercise(mapToExerciseData(detail))
        setExercises(listRes.items)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [params.id])

  const currentIndex = exercises.findIndex(ex => ex.id === params.id)
  const hasNext = currentIndex !== -1 && currentIndex < exercises.length - 1
  const hasPrev = currentIndex > 0

  const handleNext = () => {
    if (hasNext) router.push(`/exercises/${exercises[currentIndex + 1].id}`)
  }
  const handlePrev = () => {
    if (hasPrev) router.push(`/exercises/${exercises[currentIndex - 1].id}`)
  }

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen gap-4 bg-[#0f0f14]">
        <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
        <p className="text-neutral-400">Đang tải dữ liệu bài tập...</p>
      </div>
    )
  }

  if (!exercise) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen gap-4 bg-[#0f0f14]">
        <Code2 className="h-12 w-12 text-neutral-500" />
        <p className="text-neutral-400">Không tìm thấy bài tập.</p>
        <Link href="/exercises" className="text-sm text-blue-400 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50">
      <ExerciseEditorModal 
        exercise={exercise} 
        isModal={false} 
        onNext={handleNext}
        onPrev={handlePrev}
        hasNext={hasNext}
        hasPrev={hasPrev}
      />
    </div>
  )
}
