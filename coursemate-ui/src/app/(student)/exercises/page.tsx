'use client'

import { useState, useEffect, useCallback } from 'react'
import { Code2, CheckCircle2, ChevronRight, ChevronLeft, Filter, Zap } from 'lucide-react'
import { ExerciseEditorModal, type ExerciseData, type Difficulty } from '@/components/exercises/exercise-editor-modal'
import { exerciseService } from '@/lib/exercise-service'
import { RecommendedExercisesTop5 } from '@/components/home/recommended-exercises-top5'
import type { ExerciseDto } from '@/lib/types'

const DIFF_LIST_COLOR: Record<string, string> = {
  Easy: 'text-emerald-600',
  Medium: 'text-amber-600',
  Hard: 'text-red-600',
  'Dễ': 'text-emerald-600',
  'Trung bình': 'text-amber-600',
  'Khó': 'text-red-600'
}

const CATEGORIES = ['Tất cả', 'Array', 'String', 'Tree', 'DP', 'Graph', 'Sorting', 'HashTable']

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
    defaultCode:
      dto.defaultCodes?.reduce((acc: any, curr: any) => {
        acc[curr.language] = curr.starterCode || curr.code
        return acc
      }, {}) || {},
    testCases:
      dto.testCases?.map((tc: any) => ({
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        description: tc.description
      })) || []
  }
}

const PAGE_SIZE = 10

function buildPageNumbers(current: number, total: number): (number | '...')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages: (number | '...')[] = [1]
  if (current > 3) pages.push('...')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
}

export default function ExercisesPage() {
  const [diffFilter, setDiffFilter] = useState<string>('Tất cả')
  const [catFilter, setCatFilter] = useState<string>('Tất cả')
  const [showSolved, setShowSolved] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const [activeExercise, setActiveExercise] = useState<ExerciseData | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedId, setClickedId] = useState<string | null>(null)

  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [pageIndex, setPageIndex] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const fetchExercises = useCallback(async (page: number) => {
    setLoading(true)
    try {
      const difficultyMap: Record<string, string> = {
        'Tất cả': '',
        'Dễ': 'Easy',
        'Trung bình': 'Medium',
        'Khó': 'Hard'
      }
      const diff = difficultyMap[diffFilter] ?? diffFilter
      const res = await exerciseService.getList({
        pageIndex: page,
        pageSize: PAGE_SIZE,
        difficulty: diff || undefined,
        category: catFilter !== 'Tất cả' ? catFilter : undefined
      })
      setExercises(res.items)
      setTotalCount(res.totalCount)
      setTotalPages(Math.max(1, Math.ceil(res.totalCount / PAGE_SIZE)))
      setPageIndex(page)
    } catch (err) {
      console.error('Failed to fetch exercises', err)
    } finally {
      setLoading(false)
    }
  }, [diffFilter, catFilter])

  useEffect(() => {
    fetchExercises(1)
  }, [diffFilter, catFilter, fetchExercises])

  useEffect(() => {
    setIsLoggedIn(document.cookie.includes('accessToken='))
  }, [])

  const filtered = exercises.filter(ex => {
    if (!showSolved && (ex as any).isSolved) return false
    return true
  })
  const solvedCount = exercises.filter(e => (e as any).isSolved).length

  const openExercise = async (row: ExerciseDto) => {
    setClickedId(row.id)
    try {
      const detail = await exerciseService.getById(row.id)
      const data = mapToExerciseData(detail)
      setActiveExercise(data)
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
    setTimeout(() => {
      setActiveExercise(null)
      window.history.pushState(null, '', '/exercises')
    }, 300)
  }

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

  useEffect(() => {
    document.body.style.overflow = activeExercise ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [activeExercise])

  const pageNumbers = buildPageNumbers(pageIndex, totalPages)

  return (
    <>
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
        {isLoggedIn && (
          <div className="mx-auto max-w-5xl px-4 pt-8 sm:px-6 lg:px-8">
            <RecommendedExercisesTop5 source="exercises" />
          </div>
        )}

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

            <div className="mt-5 flex items-center gap-4 max-w-sm">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Tiến độ</span>
                  <span className="font-medium text-foreground">
                    {solvedCount}/{totalCount} bài
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${totalCount > 0 ? (solvedCount / totalCount) * 100 : 0}%` }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Zap className="h-4 w-4 fill-primary" />
                <span className="text-sm font-bold">
                  {totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0}%
                </span>
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
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${
                    diffFilter === d
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
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                !showSolved
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
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                  catFilter === cat
                    ? 'bg-foreground text-background'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mb-4">
            {filtered.length > 0
              ? `Hiển thị ${(pageIndex - 1) * PAGE_SIZE + 1}–${Math.min(pageIndex * PAGE_SIZE, totalCount)} / ${totalCount} bài tập`
              : 'Không có bài tập nào phù hợp.'}
          </p>

          {/* Exercise list */}
          <div className="rounded-2xl border overflow-hidden divide-y">
            {loading ? (
              Array.from({ length: PAGE_SIZE }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 animate-pulse">
                  <div className="h-4 w-6 bg-muted rounded" />
                  <div className="h-4 w-4 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center text-sm text-muted-foreground">
                Không có bài tập nào phù hợp với bộ lọc.
              </div>
            ) : (
              filtered.map((ex, idx) => (
                <button
                  key={ex.id}
                  onClick={() => openExercise(ex)}
                  disabled={clickedId !== null}
                  className={`relative w-full flex items-center gap-4 px-5 py-3.5 bg-card hover:bg-muted/40 transition-colors group text-left ${
                    clickedId === ex.id ? 'row-clicked' : ''
                  }`}
                >
                  <span className="w-6 flex-shrink-0 text-xs text-muted-foreground text-right">
                    {(pageIndex - 1) * PAGE_SIZE + idx + 1}
                  </span>
                  <div className="w-5 flex-shrink-0 flex justify-center">
                    {(ex as any).isSolved && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-1">
                      {ex.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 hidden sm:block">
                      {ex.description.replace(/<[^>]*>?/gm, '')}
                    </p>
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
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 mt-6 flex-wrap">
              <button
                onClick={() => fetchExercises(pageIndex - 1)}
                disabled={pageIndex <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Trước
              </button>

              {pageNumbers.map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="px-2 py-1.5 text-xs text-muted-foreground">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => fetchExercises(p as number)}
                    disabled={loading}
                    className={`w-9 h-9 rounded-lg text-xs font-semibold transition-colors ${
                      p === pageIndex
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {p}
                  </button>
                )
              )}

              <button
                onClick={() => fetchExercises(pageIndex + 1)}
                disabled={pageIndex >= totalPages || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium border border-transparent bg-muted text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Sau
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
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
