'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Code2,
  ChevronRight,
  Loader2,
  Sparkles,
  Zap,
  CircleDot,
  Star
} from 'lucide-react'

import { exerciseService } from '@/lib/exercise-service'
import type { ExerciseDto } from '@/lib/types'

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  Medium: 'bg-amber-500/15 text-amber-700 border-amber-200',
  Hard: 'bg-rose-500/15 text-rose-700 border-rose-200',
  // Vietnamese fallback handled by data normalization
  Dễ: 'bg-emerald-500/15 text-emerald-700 border-emerald-200',
  'Trung bình': 'bg-amber-500/15 text-amber-700 border-amber-200',
  Khó: 'bg-rose-500/15 text-rose-700 border-rose-200'
}

interface Props {
  /** Source page where this component is rendered */
  source?: 'home' | 'courses' | 'exercises'
  /** Optional title override */
  title?: string
  /** Number of items to show (default 5) */
  topN?: number
}

export function RecommendedExercisesTop5({ source = 'home', title = 'Top 5 bài tập dành cho bạn', topN = 5 }: Props) {
  const [exercises, setExercises] = useState<ExerciseDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await exerciseService.getRecommended(1, topN)
        if (!cancelled) setExercises((res.items || []).slice(0, topN))
      } catch {
        if (!cancelled) setExercises([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [topN])

  if (!loading && exercises.length === 0) return null

  return (
    // <section className="relative overflow-hidden rounded-3xl border-2 border-primary/15 bg-gradient-to-br from-violet-500/5 via-background to-primary/5 p-6 shadow-sm sm:p-8">
    //   <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
    //   <div className="pointer-events-none absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-primary/15 blur-3xl" />

    //   {/* Header */}
    //   <div className="relative mb-6 flex items-end justify-between">
    //     <div className="flex items-start gap-3">

    //       <div>

    //         <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{title}</h2>
    //         <p className="mt-1 text-sm text-muted-foreground">
    //           Bài tập được chọn dựa trên trình độ và chủ đề bạn quan tâm
    //         </p>
    //       </div>
    //     </div>
    //   </div>

    //   {loading ? (
    //     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
    //       {Array.from({ length: topN }).map((_, i) => (
    //         <div key={i} className="rounded-2xl bg-card p-4 shadow-sm">
    //           <div className="mb-3 h-6 w-3/4 animate-pulse rounded bg-muted" />
    //           <div className="mb-2 h-3 w-full animate-pulse rounded bg-muted" />
    //           <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
    //         </div>
    //       ))}
    //     </div>
    //   ) : (
    //     <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
    //       {exercises.map((ex, idx) => (
    //         <RecommendedExerciseCard key={ex.id} exercise={ex} rank={idx + 1} />
    //       ))}
    //     </div>
    //   )}
    // </section>
    <></>
  )
}

function RecommendedExerciseCard({ exercise, rank }: { exercise: ExerciseDto; rank: number }) {
  const acceptRate = estimateAcceptRate(exercise)
  const tags = buildTags(exercise)

  return (
    <Link
      href={`/exercises/${exercise.id}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/50 hover:shadow-xl"
      data-source="recommended-exercises-top5"
    >
      {/* Rank badge */}
      <div className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 text-xs font-extrabold text-white shadow-lg shadow-violet-500/40 ring-2 ring-card">
        #{rank}
      </div>

      {/* Difficulty tag */}
      <span
        className={`mb-2 w-fit rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_COLOR[exercise.difficulty] || 'bg-muted text-muted-foreground border-border'
          }`}
      >
        {exercise.difficulty}
      </span>

      {/* Title */}
      <h3 className="line-clamp-2 pr-6 text-[13px] font-semibold leading-snug text-foreground transition-colors group-hover:text-violet-600">
        {exercise.title}
      </h3>

      {/* Description */}
      <p className="mt-1.5 line-clamp-2 text-[11px] text-muted-foreground">
        {stripHtml(exercise.description)}
      </p>

      <div className="flex-1" />

      {/* Footer meta */}
      <div className="mt-3 flex items-center justify-between border-t border-border/40 pt-2.5">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <Code2 className="h-3 w-3" />
          <span className="font-semibold">{exercise.category}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <CircleDot className="h-3 w-3 fill-emerald-500 text-emerald-500" />
          <span className="font-semibold">{acceptRate}%</span>
        </div>
      </div>
    </Link>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(s: string): string {
  return s.replace(/<[^>]*>?/gm, '').trim()
}

/**
 * Estimate the acceptance rate from the exercise id (deterministic, used as a
 * visual placeholder until backend exposes a real acceptRate field).
 */
function estimateAcceptRate(ex: ExerciseDto): number {
  const base = 65 - rankFromDifficulty(ex.difficulty)
  const noise = (hashString(ex.id) % 21) - 10
  return Math.min(95, Math.max(20, base + noise))
}

function rankFromDifficulty(d: string): number {
  if (d === 'Easy' || d === 'Dễ') return 0
  if (d === 'Medium' || d === 'Trung bình') return 18
  return 35
}

function hashString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

function buildTags(ex: ExerciseDto): string[] {
  return [ex.category]
}