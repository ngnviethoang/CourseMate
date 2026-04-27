'use client'

import { useState, useEffect } from 'react'
import { Code2, CheckCircle2, ChevronRight, Filter, Zap } from 'lucide-react'
import { ExerciseEditorModal, type ExerciseData, type Difficulty } from '@/components/exercises/exercise-editor-modal'
import { exerciseService } from '@/lib/exercise-service'
import type { ExerciseDto } from '@/lib/types'

const DIFF_LIST_COLOR: Record<string, string> = {
  'Easy': 'text-emerald-600',
  'Medium': 'text-amber-600',
  'Hard': 'text-red-600',
  'Dễ': 'text-emerald-600',
  'Trung bình': 'text-amber-600',
  'Khó': 'text-red-600'
}

const CATEGORIES = [
  'Tất cả',
  'Array',
  'String',
  'Tree',
  'DP',
  'Graph',
  'Sorting',
  'HashTable'
]

// Dữ liệu chi tiết đã được chuyển sang file JSON

// Mapper function to convert API Dto to internal ExerciseData
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
      description: tc.description
    })) || []
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExercisesPage() {
  const [diffFilter, setDiffFilter] = useState<string>('Tất cả')
  const [catFilter, setCatFilter] = useState<string>('Tất cả')
  const [showSolved, setShowSolved] = useState(true)

  // Modal state
  const [activeExercise, setActiveExercise] = useState<ExerciseData | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedId, setClickedId] = useState<string | null>(null)
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const res = await exerciseService.getList({ pageSize: 10 })
        setExercises(res.items)
      } catch (err) {
        console.error('Failed to fetch exercises', err)
      } finally {
        setLoading(false)
      }
    }
    fetchExercises()
  }, [])

  const filtered = exercises.filter(ex => {
    if (diffFilter !== 'Tất cả' && ex.difficulty !== diffFilter) return false
    if (catFilter !== 'Tất cả' && ex.category !== catFilter) return false
    // if (!showSolved && ex.isSolved) return false // TODO: backend solve status
    return true
  })
  const solvedCount = exercises.filter(e => (e as any).isSolved).length

  const openExercise = async (row: ExerciseDto) => {
    setClickedId(row.id)
    try {
      const detail = await exerciseService.getById(row.id)
      const data = mapToExerciseData(detail)
      setActiveExercise(data)

      // Update URL without reloading
      window.history.pushState(null, '', `/exercises/${row.id}`)

      requestAnimationFrame(() => {
        setModalVisible(true)
        setClickedId(null)
      })
    } catch (err) {
      console.error('Failed to load detail', err)
      setClickedId(null)
    }
  }

  const closeModal = () => {
    setModalVisible(false)
    // Wait for exit animation, then unmount + restore URL
    setTimeout(() => {
      setActiveExercise(null)
      window.history.pushState(null, '', '/exercises')
    }, 300)
  }

  // Navigation within modal
  const currentIndex = activeExercise ? filtered.findIndex(ex => ex.id === activeExercise.id) : -1
  const hasNext = currentIndex !== -1 && currentIndex < filtered.length - 1
  const hasPrev = currentIndex > 0

  const handleNext = async () => {
    if (hasNext) {
      const nextRow = filtered[currentIndex + 1]
      try {
        const detail = await exerciseService.getById(nextRow.id)
        setActiveExercise(mapToExerciseData(detail))
        window.history.pushState(null, '', `/exercises/${nextRow.id}`)
      } catch (err) {
        console.error(err)
      }
    }
  }

  const handlePrev = async () => {
    if (hasPrev) {
      const prevRow = filtered[currentIndex - 1]
      try {
        const detail = await exerciseService.getById(prevRow.id)
        setActiveExercise(mapToExerciseData(detail))
        window.history.pushState(null, '', `/exercises/${prevRow.id}`)
      } catch (err) {
        console.error(err)
      }
    }
  }

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeExercise ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [activeExercise])

  return (
    <>
      {/* Row click animation */}
      <style>{`
        @keyframes rowFlash {
          0%   { background: transparent; }
          30%  { background: oklch(from #3b82f6 l c h / 0.15); transform: scaleY(0.94); }
          60%  { background: oklch(from #3b82f6 l c h / 0.08); transform: scaleY(0.97); }
          100% { background: transparent; transform: scaleY(1); }
        }
        .row-clicked {
          animation: rowFlash 220ms ease forwards;
          outline: 1px solid oklch(from #3b82f6 l c h / 0.4);
          outline-offset: -1px;
        }
      `}</style>

      {/* ── List page ── */}
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b bg-muted/30">
          <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              <Code2 className="h-6 w-6 text-primary" />
              Bài tập lập trình
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Luyện tập các bài toán từ dễ đến khó. Hoàn toàn miễn phí.
            </p>

            {/* Progress */}
            <div className="mt-5 flex items-center gap-4 max-w-sm">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Tiến độ</span>
                  <span className="font-medium text-foreground">
                    {solvedCount}/{exercises.length} bài
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${exercises.length > 0 ? (solvedCount / exercises.length) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Zap className="h-4 w-4 fill-primary" />
                <span className="text-sm font-bold">{exercises.length > 0 ? Math.round((solvedCount / exercises.length) * 100) : 0}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs text-muted-foreground flex items-center gap-1 mr-1">
                <Filter className="h-3.5 w-3.5" /> Độ khó:
              </span>
              {(['Tất cả', 'Dễ', 'Trung bình', 'Khó'] as const).map(d => (
                <button
                  key={d}
                  onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${diffFilter === d
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-transparent bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowSolved(v => !v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${!showSolved
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-transparent bg-muted text-muted-foreground hover:text-foreground'
                }`}
            >
              {showSolved ? 'Ẩn bài đã làm' : 'Hiện bài đã làm'}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCatFilter(cat as typeof catFilter)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${catFilter === cat
                  ? 'bg-foreground text-background'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-4">{filtered.length} bài tập</p>

          {/* Exercise list */}
          <div className="rounded-2xl border overflow-hidden divide-y">
            {filtered.map((ex, idx) => (
              <button
                key={ex.id}
                onClick={() => openExercise(ex)}
                disabled={clickedId !== null}
                className={`relative w-full flex items-center gap-4 px-5 py-3.5 bg-card hover:bg-muted/40 transition-colors group text-left ${clickedId === ex.id ? 'row-clicked' : ''
                  }`}
              >
                <span className="w-6 flex-shrink-0 text-xs text-muted-foreground text-right">{idx + 1}</span>
                <div className="w-5 flex-shrink-0 flex justify-center">
                  {(ex as any).isSolved && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-1">
                    {ex.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 hidden sm:block truncate">{ex.description.replace(/<[^>]*>?/gm, '')}</p>
                </div>
                <span className="hidden md:block flex-shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  {ex.category}
                </span>
                <span className="hidden sm:block flex-shrink-0 text-xs text-muted-foreground w-14 text-right">
                  {(ex as any).acceptRate || 0}%
                </span>
                <span
                  className={`flex-shrink-0 text-xs font-semibold w-20 text-right ${DIFF_LIST_COLOR[ex.difficulty as Difficulty]}`}
                >
                  {ex.difficulty}
                </span>
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">
                Không có bài tập nào phù hợp với bộ lọc.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Full-screen modal overlay ── */}
      {activeExercise && (
        <div
          className="fixed inset-0 z-50 flex flex-col"
          style={{
            transition: 'opacity 260ms ease, transform 260ms cubic-bezier(0.32,0,0.15,1)',
            opacity: modalVisible ? 1 : 0,
            transform: modalVisible ? 'translateY(0)' : 'translateY(32px)',
            pointerEvents: modalVisible ? 'auto' : 'none'
          }}
        >
          <ExerciseEditorModal
            exercise={activeExercise}
            onClose={closeModal}
            isModal
            onNext={handleNext}
            onPrev={handlePrev}
            hasNext={hasNext}
            hasPrev={hasPrev}
          />
        </div>
      )}
    </>
  )
}
