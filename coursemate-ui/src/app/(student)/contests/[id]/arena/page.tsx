'use client'

import { use, useState, useEffect, useCallback, useRef } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Terminal,
  Loader2,
  Flame,
  Send,
  Shield,
  History,
  Lightbulb,
  Info,
  BookOpen,
  Ban,
  ShieldAlert,
  PanelLeftClose,
  PanelLeftOpen,
  Eye,
  EyeOff
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { contestService, ContestWorkspaceDto, ContestExerciseDto } from '@/lib/contest-service'
import { runnerCodeService } from '@/lib/runner-code-service'
import { toast } from 'sonner'
import { useAntiCheat } from '@/hooks/useAntiCheat'
import type { LanguageDto } from '@/lib/types'

interface TestResult {
  passed: boolean
  case: string
  expected: string
  actual: string
  description: string
  isHidden?: boolean
}

interface SubmitExerciseResponse {
  testResults?: Array<{
    passed: boolean
    isHidden?: boolean
    expectedOutput?: string
    actualOutput?: string
    description?: string
  }>
}

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => (
    <div className="h-full flex items-center justify-center bg-[#1e1e1e]">
      <div className="flex items-center gap-2 text-sm text-neutral-400">
        <Loader2 className="h-4 w-4 animate-spin" /> Đang tải editor…
      </div>
    </div>
  )
})

const DEFAULT_TEMPLATES: Record<string, string> = {
  'python-3.14':
    'import sys\n\ndef solve():\n # Logic của bạn ở đây\n print("Xin chao Python")\n\nif __name__ == "__main__":\n solve()',
  'openjdk-25':
    'import java.util.*;\n\npublic class Solution {\n public static void main(String[] args) {\n Scanner sc = new Scanner(System.in);\n // Viết code của bạn tại đây\n }\n}',
  'g++-15': '#include <iostream>\nusing namespace std;\n\nint main() {\n return 0;\n}',
  'typescript-deno': 'console.log("Xin chao TypeScript");'
}

const ANTI_CHEAT_LEVEL_LABELS: Record<string, string> = {
  None: 'Tắt',
  Basic: 'Cơ bản',
  Strict: 'Nghiêm ngặt'
}

// ─── Timer Hook ───────────────────────────────────────────────────────────────

function useCountdown(joinTime?: string, durationInMinutes?: number) {
  const getRemaining = useCallback(() => {
    if (!joinTime || !durationInMinutes) return { h: 0, m: 0, s: 0, total: 0 }

    const startTime = new Date(joinTime).getTime()
    const endTime = startTime + durationInMinutes * 60 * 1000
    const diff = endTime - Date.now()

    if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 }
    const s = Math.floor(diff / 1000)
    return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, total: diff }
  }, [joinTime, durationInMinutes])

  const [time, setTime] = useState(getRemaining)

  useEffect(() => {
    const t = setInterval(() => setTime(getRemaining()), 1000)
    return () => clearInterval(t)
  }, [getRemaining])

  return time
}

// ─── Arena Page ───────────────────────────────────────────────────────────────

export default function ContestArenaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()

  const [arena, setArena] = useState<ContestWorkspaceDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState<ContestExerciseDto | null>(null)

  // Language & Code state
  const [supportedLangs, setSupportedLangs] = useState<LanguageDto[]>([])
  const [selectedLang, setSelectedLang] = useState<LanguageDto | null>(null)
  const [codes, setCodes] = useState<Record<string, Record<string, string>>>({})

  const [running, setRunning] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [leftTab, setLeftTab] = useState<'problem' | 'hints'>('problem')

  // Execution Results
  const [results, setResults] = useState<TestResult[]>([])
  const [isFinishing, setIsFinishing] = useState(false)

  // Sidebar state
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const sidebarPanelRef = useRef<any>(null)

  // Track whether initial data was loaded to avoid re-init on every render
  const initializedRef = useRef(false)

  const timer = useCountdown(arena?.joinTime, arena?.durationInMinutes)
  const timerDanger = timer.total < 5 * 60 * 1000 && timer.total > 0

  // Anti-cheat integration
  const [disqualifiedReason, setDisqualifiedReason] = useState<string | null>(null)
  const [lockRemaining, setLockRemaining] = useState<number>(0)

  const antiCheat = useAntiCheat({
    contestId: id,
    antiCheatLevel: arena?.antiCheatLevel ?? 'None',
    maxViolations: arena?.maxViolations ?? 5,
    initialViolationCount: arena?.violationCount ?? 0,
    onDisqualified: reason => setDisqualifiedReason(reason)
  })

  // ── Auto-redirect countdown when disqualified ─────────────────────────────
  const [dqCountdown, setDqCountdown] = useState<number | null>(null)

  useEffect(() => {
    const isDQ = antiCheat.isDisqualified || !!disqualifiedReason
    if (!isDQ) return

    // Start 5-second countdown then redirect
    setDqCountdown(5)
    const interval = setInterval(() => {
      setDqCountdown(prev => {
        if (prev === null || prev <= 1) {
          clearInterval(interval)
          router.push(`/contests/${id}`)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antiCheat.isDisqualified, disqualifiedReason])

  // Timer for lockout countdown
  useEffect(() => {
    if (!antiCheat.lockedUntil) {
      setLockRemaining(0)
      return
    }
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((antiCheat.lockedUntil! - Date.now()) / 1000))
      setLockRemaining(remaining)
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [antiCheat.lockedUntil])

  // Bug fix: removed selectedExercise/selectedLang from deps to prevent infinite re-render.
  // Use ref to guard one-time initialization of exercise/lang selection.
  const fetchData = useCallback(async () => {
    try {
      const [workspaceData, langs] = await Promise.all([
        contestService.getWorkspace(id),
        runnerCodeService.getLanguages()
      ])

      setArena(workspaceData)
      setSupportedLangs(langs)

      // Only pick defaults on first load
      if (!initializedRef.current) {
        if (workspaceData.exercises.length > 0) {
          setSelectedExercise(workspaceData.exercises[0])
        }
        if (langs.length > 0) {
          setSelectedLang(langs[0])
        }
        initializedRef.current = true
      }

      const initialCodes: Record<string, Record<string, string>> = {}
      workspaceData.exercises.forEach(ex => {
        initialCodes[ex.exerciseId] = {}
        langs.forEach(l => {
          initialCodes[ex.exerciseId][l.id] = DEFAULT_TEMPLATES[l.id] || ''
        })
        if (ex.defaultCodes) {
          ex.defaultCodes.forEach(dc => {
            initialCodes[ex.exerciseId][dc.language] = dc.starterCode
          })
        }
      })
      setCodes(prev => ({ ...initialCodes, ...prev }))
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Không thể vào phòng thi')
      router.push(`/contests/${id}`)
    } finally {
      setLoading(false)
    }
  }, [id, router])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // Check if already disqualified on load
  useEffect(() => {
    if (arena?.isDisqualified) {
      setDisqualifiedReason('Bạn đã bị loại khỏi cuộc thi này.')
    }
  }, [arena?.isDisqualified])

  const getCode = (exId: string, langId: string) => {
    return codes[exId]?.[langId] || ''
  }

  const handleRun = async () => {
    // Guard: disqualified students cannot run code
    if (antiCheat.isDisqualified || disqualifiedReason) {
      toast.error('Bạn đã bị loại khỏi cuộc thi — không thể chạy code.')
      return
    }
    // Guard: locked-out students cannot run code
    if (antiCheat.lockedUntil && antiCheat.lockedUntil > Date.now()) {
      const secs = Math.ceil((antiCheat.lockedUntil - Date.now()) / 1000)
      toast.error(`Màn hình bị khóa — vui lòng đợi ${secs}s trước khi chạy code.`)
      return
    }
    if (!selectedExercise || !selectedLang) return
    const code = getCode(selectedExercise.exerciseId, selectedLang.id)
    if (!code.trim()) return toast.error('Vui lòng nhập code')

    setRunning(true)

    // Run against all examples
    const examples = selectedExercise.examples || []
    if (examples.length === 0) {
      try {
        const res = await runnerCodeService.run({ compiler: selectedLang.id, code, input: '' })
        setResults([
          {
            passed: !res.error && res.exit_code === 0,
            case: 'Chạy thử',
            expected: '(không có dữ liệu mẫu)',
            actual: res.output || res.error || 'Không có kết quả đầu ra',
            description: 'Mã nguồn được biên dịch và chạy với đầu vào trống'
          }
        ])
      } catch {
        toast.error('Lỗi khi chạy code')
      } finally {
        setRunning(false)
      }
      return
    }

    try {
      const runResults = await Promise.all(
        examples.map(async (ex, idx) => {
          try {
            const res = await runnerCodeService.run({ compiler: selectedLang.id, code, input: ex.input })
            const actual = (res.output || '').trim()
            const expected = ex.output.trim()
            return {
              passed: actual === expected,
              case: `Ví dụ ${idx + 1}`,
              expected,
              actual: actual || res.error || 'Không có kết quả đầu ra',
              description: ex.explanation || 'Kiểm tra với dữ liệu mẫu',
              isHidden: false
            }
          } catch {
            return {
              passed: false,
              case: `Ví dụ ${idx + 1}`,
              expected: ex.output,
              actual: 'Lỗi hệ thống',
              description: '',
              isHidden: false
            }
          }
        })
      )
      setResults(runResults)
    } catch {
      toast.error('Lỗi khi chạy code')
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    // Guard: disqualified students cannot submit
    if (antiCheat.isDisqualified || disqualifiedReason) {
      toast.error('Bạn đã bị loại khỏi cuộc thi — không thể nộp bài.')
      return
    }
    // Guard: locked-out students cannot submit
    if (antiCheat.lockedUntil && antiCheat.lockedUntil > Date.now()) {
      const secs = Math.ceil((antiCheat.lockedUntil - Date.now()) / 1000)
      toast.error(`Màn hình bị khóa — vui lòng đợi ${secs}s trước khi nộp bài.`)
      return
    }
    if (!selectedExercise || !selectedLang) return
    const code = getCode(selectedExercise.exerciseId, selectedLang.id)
    if (!code.trim()) return toast.error('Vui lòng nhập code')

    setSubmitting(true)
    try {
      // Gọi backend để chấm điểm server-side (backend chạy toàn bộ test cases bao gồm hidden)
      const response = (await contestService.submitExercise(id, selectedExercise.exerciseId, {
        language: selectedLang.id,
        code
      })) as SubmitExerciseResponse

      // Hiển thị kết quả từ backend nếu có, fallback về thông báo tổng quát
      if (response?.testResults && Array.isArray(response.testResults)) {
        const runResults: TestResult[] = response.testResults.map((tc, idx) => ({
          passed: tc.passed,
          case: `Bộ kiểm thử ${idx + 1}`,
          expected: tc.isHidden ? 'Ẩn' : (tc.expectedOutput ?? ''),
          actual: tc.isHidden ? 'Ẩn' : (tc.actualOutput ?? ''),
          description: tc.description ?? '',
          isHidden: tc.isHidden ?? false
        }))
        setResults(runResults)
        const passedCount = runResults.filter(r => r.passed).length
        const total = runResults.length
        if (passedCount === total) {
          toast.success(`✅ Nộp bài thành công! ${passedCount}/${total} bộ kiểm thử đúng!`)
        } else {
          toast.warning(`📋 Đã nộp! ${passedCount}/${total} bộ kiểm thử đúng.`)
        }
      } else {
        // Backend chưa trả về chi tiết bộ kiểm thử — chỉ báo đã nộp
        setResults([])
        toast.success('📋 Đã nộp bài thành công! Điểm sẽ được cập nhật sau.')
      }

      fetchData()
    } catch (err) {
      // Bỏ qua toast error ở đây vì global api-client.ts interceptor đã tự động hiện toast cho lỗi backend
    } finally {
      setSubmitting(false)
    }
  }

  const handleFinish = async () => {
    if (!confirm('Bạn có chắc chắn muốn nộp toàn bộ bài thi và kết thúc?')) return
    setIsFinishing(true)
    try {
      await contestService.finish(id)
      toast.success('Chúc mừng! Bạn đã hoàn thành cuộc thi.')
      router.push(`/contests/${id}`)
    } catch {
      toast.error('Lỗi khi kết thúc bài thi')
    } finally {
      setIsFinishing(false)
    }
  }

  if (loading)
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a12]" suppressHydrationWarning>
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )

  const myScore = arena?.exercises.reduce((sum, ex) => sum + (ex.bestScore || 0), 0) || 0

  // Disqualification overlay — with auto-redirect countdown
  if (antiCheat.isDisqualified || disqualifiedReason) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0f]/98 backdrop-blur-xl">
        {/* Animated red background */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <div className="w-[50rem] h-[50rem] bg-red-600 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="max-w-md w-full mx-4 text-center space-y-6 relative z-10">
          {/* Icon */}
          <div className="w-24 h-24 mx-auto rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center animate-pulse">
            <Ban className="h-12 w-12 text-red-500" />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <h1 className="text-3xl font-black text-red-400 tracking-tight">Bạn đã bị loại</h1>
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm mx-auto">
              {disqualifiedReason || 'Vi phạm nghiêm trọng nội quy thi.'}
            </p>
          </div>

          {/* Violation count */}
          <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10">
            <p className="text-xs text-neutral-500">
              Số lần vi phạm: <span className="text-red-400 font-bold">{antiCheat.violationCount}</span>
            </p>
          </div>

          {/* Countdown */}
          <div className="space-y-3">
            <p className="text-neutral-500 text-sm">Tự động chuyển trang trong</p>
            <div className="text-6xl font-black font-mono text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
              {dqCountdown ?? 5}
            </div>
            <p className="text-neutral-600 text-xs">giây...</p>
          </div>

          <Button
            onClick={() => router.push(`/contests/${id}`)}
            className="bg-white/5 hover:bg-white/10 text-neutral-300 font-bold rounded-xl px-8 h-12 w-full"
          >
            Quay lại ngay
          </Button>
        </div>
      </div>
    )
  }

  // Penalty Lockout Screen
  if (lockRemaining > 0) {
    const mins = Math.floor(lockRemaining / 60)
    const secs = lockRemaining % 60
    return (
      <div className="fixed inset-0 z-[100] bg-[#0a0a0f] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden backdrop-blur-3xl">
        {/* Animated background pulse */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <div className="w-[40rem] h-[40rem] bg-orange-500 rounded-full blur-3xl animate-pulse" />
        </div>

        <div className="w-24 h-24 rounded-full bg-orange-500/10 flex items-center justify-center mb-6 relative z-10 border-orange-500/20">
          <ShieldAlert className="w-12 h-12 text-orange-500 animate-bounce" />
        </div>

        <h1 className="text-4xl font-black text-white mb-3 tracking-tight relative z-10">MÀN HÌNH BỊ KHÓA</h1>
        <p className="text-orange-400 mb-6 max-w-lg text-lg relative z-10">
          {antiCheat.lockoutReason ||
            'Bạn đã vi phạm quy chế thi nhiều lần. Vui lòng đợi hết thời gian phạt để tiếp tục làm bài.'}
        </p>

        <div className="flex items-center gap-2 text-6xl font-black font-mono text-white mb-8 relative z-10 tracking-widest drop-shadow-[0_0_15px_rgba(249,115,22,0.5)]">
          <span>{mins.toString().padStart(2, '0')}</span>
          <span className="text-orange-500 animate-pulse">:</span>
          <span>{secs.toString().padStart(2, '0')}</span>
        </div>

        <div className="text-xs font-bold tracking-[0.2em] uppercase text-neutral-500 relative z-10 bg-black/40 px-4 py-2 rounded-full border-white/5">
          Cố tình tải lại trang sẽ không làm mất thời gian chờ
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a0f] text-neutral-100 overflow-hidden font-sans">
      <style>{`
 .monaco-editor .margin { background-color: #1e1e1e !important; }
 .no-scrollbar::-webkit-scrollbar { display: none; }
 `}</style>

      {/* Header */}
      <header className="h-14 shadow-md border-b border-white/5 bg-[#12121a] flex items-center px-4 gap-4 flex-shrink-0 shadow-lg z-20">
        <Link href={`/contests/${id}`} className="p-2 hover:bg-white/5 rounded-lg transition-colors">
          <ArrowLeft className="h-5 w-5 text-neutral-400" />
        </Link>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-neutral-400 hover:text-white"
          onClick={() => {
            if (isSidebarCollapsed) {
              sidebarPanelRef.current?.expand()
            } else {
              sidebarPanelRef.current?.collapse()
            }
          }}
        >
          {isSidebarCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>

        <div className="h-6 w-px bg-white/10" />

        <div className="flex-1 min-w-0">
          <h1 className="font-bold text-sm truncate flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            {arena?.title}
          </h1>
          <p className="text-[10px] text-neutral-500 font-medium uppercase tracking-widest mt-0.5">
            Phòng thi trực tuyến
          </p>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-3 px-4 py-1.5 rounded-xl ${timerDanger ? 'bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse' : 'bg-white/5 border border-white/10 text-neutral-200'} font-mono font-bold tabular-nums text-sm`}
        >
          <Clock className="h-4 w-4" />
          {String(timer.h).padStart(2, '0')}:{String(timer.m).padStart(2, '0')}:{String(timer.s).padStart(2, '0')}
        </div>

        <div className="h-6 w-px bg-white/10" />

        {/* Score */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-xl">
          <span className="text-[10px] font-bold text-amber-500/70 uppercase">Điểm</span>
          <span className="text-lg font-black text-amber-500 leading-none">{myScore}</span>
        </div>

        <Button
          onClick={handleFinish}
          disabled={isFinishing}
          className="bg-primary hover:bg-primary/90 text-white font-bold rounded-xl px-6 h-10 shadow-lg shadow-primary/20"
        >
          {isFinishing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Nộp bài & Kết thúc'}
        </Button>
      </header>

      {/* Main Layout */}
      <main className="flex flex-1 overflow-hidden relative">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          {/* Sidebar: Exercise List */}
          <ResizablePanel
            ref={sidebarPanelRef}
            defaultSize={200}
            collapsible
            minSize={150}
            maxSize={400}
            onResize={(size) => setIsSidebarCollapsed(size === 0)}
            className="bg-[#0f0f16] overflow-hidden transition-all duration-300"
          >
            <div className="h-full flex flex-col bg-[#0f0f16] overflow-hidden">
              <div className="p-4 shadow-md border-b border-white/5 flex items-center justify-between shrink-0 bg-[#0f0f16] z-10 relative">
                <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-primary/70" />
                  Danh sách bài thi ({arena?.exercises.length || 0})
                </span>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2">
                {arena?.exercises.map((ex, idx) => {
                  const isActive = selectedExercise?.exerciseId === ex.exerciseId
                  return (
                    <button
                      key={ex.id}
                      onClick={() => setSelectedExercise(ex)}
                      className={`w-full p-3.5 rounded-xl flex items-start gap-4 transition-all duration-300 group border outline-none 
                        ${isActive
                          ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/40 shadow-[0_0_15px_rgba(var(--primary),0.15)] ring-1 ring-primary/20'
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.04] hover:border-white/10 hover:shadow-lg hover:-translate-y-0.5'
                        }`}
                    >
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-sm shrink-0 transition-colors shadow-sm
                          ${ex.isPassed
                            ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30'
                            : isActive
                              ? 'bg-primary text-white shadow-primary/30 shadow-md'
                              : 'bg-neutral-800/50 text-neutral-400 ring-1 ring-white/10 group-hover:bg-neutral-800 group-hover:text-neutral-300'
                          }`}
                      >
                        {ex.isPassed ? <CheckCircle2 className="h-5 w-5" /> : idx + 1}
                      </div>
                      <div className="flex-1 text-left min-w-0">
                        <p
                          className={`text-sm font-bold truncate transition-colors ${isActive ? 'text-white' : ex.isPassed ? 'text-emerald-100' : 'text-neutral-300 group-hover:text-neutral-200'}`}
                        >
                          {ex.title}
                        </p>
                        <div className="flex items-center gap-2 mt-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-800 text-neutral-400 border border-neutral-700/50">
                            {ex.scoreWeight} PTS
                          </span>
                          {ex.bestScore !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${ex.bestScore === ex.scoreWeight
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                }`}
                            >
                              BEST: {ex.bestScore}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-white/5 w-1 hover:bg-primary/50 transition-colors" />

          {/* Center: Problem Desc */}
          <ResizablePanel defaultSize={30} minSize={500} maxSize={800} className="bg-[#0a0a0f]">
            <div className="h-full flex flex-col">
              <div className="flex flex-col items-center justify-center w-full bg-[#0a0a0f] border-b border-white/5 py-3 shrink-0 z-10 relative shadow-sm">
                <div className="flex gap-2 p-1 bg-white/5 rounded-xl border border-white/5">
                  {(
                    [
                      { id: 'problem', label: 'Đề bài', icon: BookOpen },
                      { id: 'hints', label: 'Gợi ý', icon: Lightbulb }
                    ] as const
                  ).map(t => (
                    <button
                      key={t.id}
                      onClick={() => setLeftTab(t.id)}
                      className={`flex items-center gap-2 px-5 py-2 text-xs font-bold transition-all duration-300 rounded-lg ${leftTab === t.id
                        ? 'bg-gradient-to-r from-primary/20 to-primary/10 text-primary shadow-sm border border-primary/20'
                        : 'text-neutral-400 hover:text-neutral-200 hover:bg-white/5 border border-transparent'
                        }`}
                    >
                      <t.icon className={`h-4 w-4 ${leftTab === t.id ? 'text-primary' : 'text-neutral-500'}`} />
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar pb-20">
                {leftTab === 'problem' && (
                  <>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <h2 className="text-3xl font-black text-white tracking-tight">{selectedExercise?.title}</h2>
                      </div>
                      <div className="prose prose-invert prose-blue max-w-none">
                        <div className="text-neutral-400 leading-relaxed text-base whitespace-pre-line">
                          {selectedExercise?.description}
                        </div>
                      </div>
                    </div>

                    {selectedExercise?.examples && selectedExercise.examples.length > 0 && (
                      <div className="space-y-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                          <Info className="h-4 w-4" /> Ví dụ mẫu
                        </h3>
                        <div className="space-y-6">
                          {selectedExercise.examples.map((ex, i) => (
                            <div key={i} className="space-y-3">
                              <p className="text-sm font-bold text-neutral-300">Ví dụ {i + 1}:</p>
                              <div className="grid gap-3">
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
                                    Đầu vào
                                  </p>
                                  <code className="text-sm text-amber-400/90">{ex.input}</code>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-600">
                                    Đầu ra
                                  </p>
                                  <code className="text-sm text-emerald-400/90">{ex.output}</code>
                                </div>
                                {ex.explanation && (
                                  <p className="text-xs text-neutral-500 italic mt-1 pl-1 border-l-2 border-white/10">
                                    {ex.explanation}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {selectedExercise?.constraints && selectedExercise.constraints.length > 0 && (
                      <div className="space-y-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                          <Shield className="h-4 w-4" /> Ràng buộc
                        </h3>
                        <ul className="space-y-3">
                          {selectedExercise.constraints.map((c, i) => (
                            <li key={i} className="flex gap-3 text-sm text-neutral-400 items-start">
                              <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </>
                )}

                {leftTab === 'hints' && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <Lightbulb className="h-4 w-4" /> Gợi ý giải thuật
                    </h3>
                    <div className="space-y-4 mt-6">
                      {selectedExercise?.hints && selectedExercise.hints.length > 0 ? (
                        selectedExercise.hints.map((h, i) => (
                          <div key={i} className="p-6 rounded-3xl bg-amber-500/5 border-amber-500/10 space-y-2 group">
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/40">
                              Gợi ý {i + 1}
                            </p>
                            <p className="text-sm text-neutral-300 leading-relaxed italic">{h}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-neutral-500">Không có gợi ý cho bài tập này.</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="bg-white/5 w-1 hover:bg-primary/50 transition-colors" />

          {/* Right: Code Editor & Results split vertically */}
          <ResizablePanel defaultSize={45} minSize={30} className="bg-[#1e1e1e]">
            <ResizablePanelGroup direction="vertical" className="h-full w-full flex-col">
              {/* Editor */}
              <ResizablePanel defaultSize={60} minSize={30}>
                <div className="h-full flex flex-col">
                  {/* Editor Toolbar */}
                  <div className="h-14 bg-[#0a0a0f] shadow-md border-b border-white/5 flex items-center px-5 justify-between shrink-0 z-10 relative">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-primary/10 rounded-md">
                        <Terminal className="h-3.5 w-3.5 text-primary" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">Trình soạn thảo</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-[#12121a] rounded-lg p-1 min-w-[140px] border border-white/10 shadow-inner">
                        <select
                          className="bg-transparent text-xs font-semibold px-2 py-1 outline-none text-neutral-300 cursor-pointer w-full hover:text-white transition-colors"
                          value={selectedLang?.id || ''}
                          onChange={e => {
                            const l = supportedLangs.find(x => x.id === e.target.value)
                            if (l) setSelectedLang(l)
                          }}
                        >
                          {supportedLangs.map(l => (
                            <option key={l.id} value={l.id} className="bg-[#1c1c28]">
                              {l.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 text-neutral-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-transparent hover:border-white/10"
                          onClick={() => {
                            if (selectedExercise && selectedLang) {
                              setCodes(prev => ({
                                ...prev,
                                [selectedExercise.exerciseId]: {
                                  ...prev[selectedExercise.exerciseId],
                                  [selectedLang.id]:
                                    selectedExercise.defaultCodes.find(dc => dc.language === selectedLang.id)?.starterCode ||
                                    DEFAULT_TEMPLATES[selectedLang.id] ||
                                    ''
                                }
                              }))
                            }
                          }}
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={handleRun}
                          disabled={
                            running ||
                            submitting ||
                            !!antiCheat.isDisqualified ||
                            !!disqualifiedReason ||
                            (!!antiCheat.lockedUntil && antiCheat.lockedUntil > Date.now()) ||
                            (!!arena?.joinTime && !!arena?.durationInMinutes && timer.total <= 0)
                          }
                          title={antiCheat.isDisqualified || disqualifiedReason ? 'Bạn đã bị loại' : undefined}
                          className="h-9 px-4 bg-[#1e1e2d] hover:bg-[#2a2a3f] text-neutral-200 border border-white/5 hover:border-white/10 text-[10px] font-black uppercase tracking-widest rounded-lg gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                          {running ? <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" /> : <Play className="h-3.5 w-3.5 fill-current text-primary" />}
                          Chạy thử
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={
                            running ||
                            submitting ||
                            !!antiCheat.isDisqualified ||
                            !!disqualifiedReason ||
                            (!!antiCheat.lockedUntil && antiCheat.lockedUntil > Date.now()) ||
                            (!!arena?.joinTime && !!arena?.durationInMinutes && timer.total <= 0)
                          }
                          title={antiCheat.isDisqualified || disqualifiedReason ? 'Bạn đã bị loại' : undefined}
                          className="h-9 px-5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white text-[10px] font-black uppercase tracking-widest rounded-lg gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] border border-emerald-400/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:bg-neutral-600 disabled:from-neutral-600 disabled:to-neutral-600 disabled:shadow-none"
                        >
                          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                          Nộp bài
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 relative">
                    <MonacoEditor
                      height="100%"
                      language={
                        selectedLang?.id.split('-')[0] === 'openjdk'
                          ? 'java'
                          : selectedLang?.id.split('-')[0] === 'dotnet'
                            ? selectedLang?.id.includes('csharp')
                              ? 'csharp'
                              : 'fsharp'
                            : selectedLang?.id.startsWith('g++') || selectedLang?.id.startsWith('gcc')
                              ? 'cpp'
                              : selectedLang?.id.startsWith('python')
                                ? 'python'
                                : selectedLang?.id.startsWith('go')
                                  ? 'go'
                                  : selectedLang?.id.startsWith('rust')
                                    ? 'rust'
                                    : selectedLang?.id.startsWith('typescript')
                                      ? 'typescript'
                                      : 'javascript'
                      }
                      value={getCode(selectedExercise?.exerciseId || '', selectedLang?.id || '')}
                      onChange={v => {
                        if (selectedExercise && selectedLang) {
                          setCodes(prev => ({
                            ...prev,
                            [selectedExercise.exerciseId]: {
                              ...prev[selectedExercise.exerciseId],
                              [selectedLang.id]: v || ''
                            }
                          }))
                        }
                      }}
                      theme="vs-dark"
                      options={{
                        fontSize: 14,
                        minimap: { enabled: false },
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        padding: { top: 20, bottom: 20 },
                        fontFamily: 'JetBrains Mono, Menlo, Monaco, Courier New, monospace',
                        renderLineHighlight: 'all',
                        lineNumbersMinChars: 3,
                        // Lock editor when student is DQ'd or locked out or time is up
                        readOnly: !!(
                          antiCheat.isDisqualified ||
                          disqualifiedReason ||
                          (antiCheat.lockedUntil && antiCheat.lockedUntil > Date.now()) ||
                          (!!arena?.joinTime && !!arena?.durationInMinutes && timer.total <= 0)
                        )
                      }}
                    />
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle withHandle className="bg-white/5 h-1 hover:bg-primary/50 transition-colors" />

              {/* Console Results */}
              <ResizablePanel defaultSize={40} collapsible minSize={20} className="bg-[#09090f]">
                <div className="h-full flex flex-col">
                  {/* Results Header */}
                  <div className="h-10 bg-[#0a0a0f] shadow-md border-b border-white/5 flex items-center px-5 justify-between shrink-0 z-10 relative">
                    <div className="flex items-center gap-2">
                      <Terminal className="h-3.5 w-3.5 text-primary/70" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Kết quả Console</span>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 no-scrollbar bg-[#09090f]">
                    {!running && !submitting && results.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center text-neutral-600 gap-4 min-h-[200px]">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-2 border border-white/5">
                          <Terminal className="h-8 w-8 opacity-40" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-widest">Chưa có kết quả</p>
                        <p className="text-[11px] text-neutral-500">Nhấn Chạy thử hoặc Nộp bài để xem kết quả thực thi.</p>
                      </div>
                    )}

                    {(running || submitting) && (
                      <div className="h-full flex flex-col items-center justify-center gap-6 min-h-[200px]">
                        <div className="relative">
                          <div className="h-16 w-16 rounded-full border-4 border-primary/20 shadow-[0_0_20px_rgba(var(--primary),0.2)] border-t-primary animate-spin" />
                          <Flame className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-primary animate-pulse" />
                        </div>
                        <div className="text-center space-y-1.5">
                          <p className="text-sm font-black text-white tracking-widest uppercase">
                            {submitting ? 'Đang chấm điểm...' : 'Đang thực thi mã nguồn...'}
                          </p>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-black">
                            Vui lòng không đóng cửa sổ này
                          </p>
                        </div>
                      </div>
                    )}

                    {!running && !submitting && results.length > 0 && (
                      <div className="space-y-6 max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Chi tiết Test Cases</h3>
                          <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 font-bold text-xs flex items-center gap-2 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {results.filter(r => r.passed).length} / {results.length} ĐẠT
                          </div>
                        </div>

                        {results.map((res, i) => (
                          <div
                            key={i}
                            className={`p-5 rounded-2xl transition-all duration-300 shadow-sm border ${res.passed
                              ? 'bg-gradient-to-br from-emerald-500/5 to-transparent border-emerald-500/20 hover:border-emerald-500/40 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                              : 'bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20 hover:border-red-500/40 hover:shadow-[0_0_15px_rgba(239,68,68,0.1)]'
                              }`}
                          >
                            <div className="flex items-center gap-4 mb-4">
                              <div className={`p-2 rounded-xl ${res.passed ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                                {res.passed ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                ) : (
                                  <XCircle className="h-5 w-5 text-red-400" />
                                )}
                              </div>
                              <div className="flex-1 flex items-center justify-between">
                                <span className={`text-sm font-black uppercase tracking-widest ${res.passed ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {res.case}: {res.passed ? 'ĐẠT' : 'KHÔNG ĐẠT'}
                                </span>
                                {res.isHidden ? (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-800/80 rounded-md border border-neutral-700 text-[9px] text-neutral-400 font-black uppercase tracking-widest">
                                    <EyeOff className="h-3 w-3" /> Ẩn
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 rounded-md border border-emerald-500/20 text-[9px] text-emerald-500 font-black uppercase tracking-widest">
                                    <Eye className="h-3 w-3" /> Công khai
                                  </div>
                                )}
                              </div>
                            </div>

                            {!res.isHidden ? (
                              <div className="space-y-3 font-mono text-xs">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 relative overflow-hidden group">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-neutral-600/50" />
                                    <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest flex items-center gap-2">
                                      Kết quả mong đợi
                                    </p>
                                    <pre className="text-neutral-300 break-all whitespace-pre-wrap">{res.expected}</pre>
                                  </div>
                                  <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2 relative overflow-hidden group">
                                    <div className={`absolute top-0 left-0 w-1 h-full ${res.passed ? 'bg-emerald-500/50' : 'bg-red-500/50'}`} />
                                    <p className="text-[9px] text-neutral-500 font-black uppercase tracking-widest flex items-center gap-2">
                                      Kết quả thực tế
                                    </p>
                                    <pre
                                      className={
                                        res.passed
                                          ? 'text-emerald-400 break-all whitespace-pre-wrap font-bold'
                                          : 'text-red-400 break-all whitespace-pre-wrap font-bold'
                                      }
                                    >
                                      {res.actual}
                                    </pre>
                                  </div>
                                </div>
                                {res.description && (
                                  <p className="text-[10px] text-neutral-500 mt-2 pl-3 border-l-2 border-white/10 italic">{res.description}</p>
                                )}
                              </div>
                            ) : (
                              <div className="p-4 rounded-xl bg-black/30 border border-white/5 text-center mt-2 backdrop-blur-sm">
                                <p className="text-xs text-neutral-500 italic font-medium">
                                  Dữ liệu và kết quả của bộ kiểm thử này được ẩn để đảm bảo tính khách quan.
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </main>

      {/* Progress Footer */}
      <footer className="h-8 bg-[#0a0a0f] shadow-md border-t border-white/5 px-6 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.2em] text-neutral-600">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5">
            <Shield className="h-3 w-3" />
            Chống gian lận: {ANTI_CHEAT_LEVEL_LABELS[arena?.antiCheatLevel ?? 'None'] ?? arena?.antiCheatLevel ?? 'Tắt'}
            {arena?.antiCheatLevel !== 'None' && (
              <span className="text-amber-500">
                {' '}
                ({antiCheat.violationCount}/{arena?.maxViolations ?? '∞'})
              </span>
            )}
          </span>
          <span className="flex items-center gap-1.5">
            <History className="h-3 w-3" /> Tự động lưu đã bật
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-1.5 h-1.5 rounded-full ${arena?.antiCheatLevel === 'None'
              ? 'bg-neutral-600'
              : antiCheat.connectionState === 'connected'
                ? 'bg-emerald-500 animate-pulse'
                : antiCheat.connectionState === 'connecting'
                  ? 'bg-amber-500 animate-pulse'
                  : 'bg-red-500'
              }`}
          />
          {arena?.antiCheatLevel === 'None'
            ? 'Giám sát tắt'
            : antiCheat.connectionState === 'connected'
              ? 'Đã kết nối'
              : antiCheat.connectionState === 'connecting'
                ? 'Đang kết nối...'
                : 'Mất kết nối!'}{' '}
          • CourseMate V2.0
        </div>
      </footer>
    </div>
  )
}
