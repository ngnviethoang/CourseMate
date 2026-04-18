'use client'

import { use, useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Code2,
  Terminal,
  Loader2,
  GripVertical,
  Menu,
  Flame,
  Send,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'

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

// ─── Mock data ────────────────────────────────────────────────────────────────

interface ContestProblem {
  id: string
  title: string
  difficulty: 'Dễ' | 'Trung bình' | 'Khó'
  points: number
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  defaultCode: Record<string, string>
  testCases: { input: string; expectedOutput: string; description: string }[]
}

const DIFF_COLOR = { Dễ: 'text-emerald-400', 'Trung bình': 'text-amber-400', Khó: 'text-red-400' }
const DIFF_BG = { Dễ: 'bg-emerald-400/10', 'Trung bình': 'bg-amber-400/10', Khó: 'bg-red-400/10' }

const ARENA_DATA: Record<
  string,
  {
    contestId: string
    title: string
    endsAt: string
    totalPoints: number
    problems: ContestProblem[]
  }
> = {
  ct1: {
    contestId: 'ct1',
    title: 'Weekly Code Challenge #12',
    endsAt: new Date(Date.now() + 45 * 60 * 1000).toISOString(), // 45 phút kể từ lúc mount
    totalPoints: 1500,
    problems: [
      {
        id: 'p1',
        title: 'Số lượng đảo (Number of Islands)',
        difficulty: 'Trung bình',
        points: 300,
        description:
          'Cho một ma trận 2D gồm `"1"` (đất) và `"0"` (nước), đếm số **đảo** trong ma trận.\n\nMột đảo là vùng đất liên kết với nhau theo chiều ngang/dọc, được bao quanh bởi nước hoặc biên.',
        examples: [
          {
            input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
            output: '1',
            explanation: 'Chỉ có 1 đảo đất liên kết'
          },
          {
            input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
            output: '3'
          }
        ],
        constraints: ['m == grid.length', 'n == grid[i].length', '1 ≤ m, n ≤ 300', 'grid[i][j] là "0" hoặc "1"'],
        defaultCode: {
          javascript: `/**\n * @param {character[][]} grid\n * @return {number}\n */\nfunction numIslands(grid) {\n    // Viết code của bạn ở đây\n    \n}`,
          python: `class Solution:\n    def numIslands(self, grid: list[list[str]]) -> int:\n        # Viết code của bạn ở đây\n        pass`,
          java: `class Solution {\n    public int numIslands(char[][] grid) {\n        // Viết code của bạn ở đây\n        return 0;\n    }\n}`
        },
        testCases: [
          { input: '[["1","1","0"],["0","1","0"],["0","0","1"]]', expectedOutput: '2', description: 'Hai đảo' },
          { input: '[["1","1","1"],["1","1","1"],["1","1","1"]]', expectedOutput: '1', description: 'Một đảo lớn' }
        ]
      },
      {
        id: 'p2',
        title: 'Đường đi ngắn nhất trong mê cung',
        difficulty: 'Trung bình',
        points: 300,
        description:
          'Cho một mê cung `m×n`, tìm đường đi ngắn nhất từ ô `(0,0)` đến ô `(m-1,n-1)`.\n\n`0` là ô có thể đi qua, `1` là tường. Trả về độ dài đường đi ngắn nhất, hoặc `-1` nếu không có đường.',
        examples: [
          { input: 'maze = [[0,0,0],[1,1,0],[0,0,0]]', output: '4' },
          { input: 'maze = [[0,1],[1,0]]', output: '-1' }
        ],
        constraints: ['1 ≤ m, n ≤ 100', 'maze[i][j] = 0 hoặc 1'],
        defaultCode: {
          javascript: `function shortestPath(maze) {\n    // BFS\n    \n}`,
          python: `from collections import deque\n\nclass Solution:\n    def shortestPath(self, maze) -> int:\n        pass`,
          java: `class Solution {\n    public int shortestPath(int[][] maze) {\n        return -1;\n    }\n}`
        },
        testCases: [{ input: '[[0,0,0],[1,1,0],[0,0,0]]', expectedOutput: '4', description: 'Có đường đi' }]
      },
      {
        id: 'p3',
        title: 'Phát hiện chu trình trong đồ thị',
        difficulty: 'Khó',
        points: 400,
        description:
          'Cho một đồ thị **có hướng** với `n` đỉnh (0 đến n-1) và danh sách cạnh, kiểm tra xem có **chu trình** không.',
        examples: [
          { input: 'n=4, edges=[[0,1],[1,2],[2,0],[3,4]]', output: 'true', explanation: 'Có chu trình 0→1→2→0' },
          { input: 'n=3, edges=[[0,1],[1,2]]', output: 'false' }
        ],
        constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ edges.length ≤ 10⁵'],
        defaultCode: {
          javascript: `function hasCycle(n, edges) {\n    // DFS với trạng thái: 0=chưa thăm, 1=đang thăm, 2=xong\n    \n}`,
          python: `class Solution:\n    def hasCycle(self, n: int, edges: list[list[int]]) -> bool:\n        pass`,
          java: `class Solution {\n    public boolean hasCycle(int n, int[][] edges) {\n        return false;\n    }\n}`
        },
        testCases: [
          { input: '4, [[0,1],[1,2],[2,0]]', expectedOutput: 'true', description: 'Có chu trình' },
          { input: '3, [[0,1],[1,2]]', expectedOutput: 'false', description: 'Không có chu trình' }
        ]
      },
      {
        id: 'p4',
        title: 'Clone đồ thị (Clone Graph)',
        difficulty: 'Trung bình',
        points: 300,
        description:
          'Cho một **nút** trong đồ thị vô hướng liên thông, hãy trả về **bản sao sâu** (deep copy) của đồ thị.',
        examples: [
          {
            input: 'adjList = [[2,4],[1,3],[2,4],[1,3]]',
            output: '[[2,4],[1,3],[2,4],[1,3]]',
            explanation: 'Clone đồ thị giữ nguyên cấu trúc'
          }
        ],
        constraints: ['Số nút: 0 đến 100', 'ID nút: 1 đến 100', 'Không có cạnh lặp hay cạnh tự vòng'],
        defaultCode: {
          javascript: `function cloneGraph(node) {\n    // Dùng HashMap để tránh clone lại node đã xử lý\n    if (!node) return null;\n    \n}`,
          python: `class Solution:\n    def cloneGraph(self, node):\n        pass`,
          java: `class Solution {\n    public Node cloneGraph(Node node) {\n        return null;\n    }\n}`
        },
        testCases: [
          {
            input: '[[2,4],[1,3],[2,4],[1,3]]',
            expectedOutput: '[[2,4],[1,3],[2,4],[1,3]]',
            description: 'Clone đơn giản'
          }
        ]
      },
      {
        id: 'p5',
        title: 'Thứ tự topo (Topological Sort)',
        difficulty: 'Khó',
        points: 400,
        description:
          'Cho `n` task và danh sách phụ thuộc, trả về **thứ tự thực hiện hợp lệ** (Topological Order). Nếu có chu trình, trả về mảng rỗng.',
        examples: [
          {
            input: 'n=4, prereqs=[[1,0],[2,0],[3,1],[3,2]]',
            output: '[0,1,2,3] hoặc [0,2,1,3]',
            explanation: 'Task 0 phải làm trước 1 và 2'
          },
          { input: 'n=2, prereqs=[[0,1],[1,0]]', output: '[]' }
        ],
        constraints: ['1 ≤ n ≤ 10⁵', '0 ≤ prereqs.length ≤ 10⁵'],
        defaultCode: {
          javascript: `function findOrder(n, prerequisites) {\n    // Kahn's algorithm (BFS) hoặc DFS + stack\n    \n}`,
          python: `from collections import deque\n\nclass Solution:\n    def findOrder(self, n: int, prerequisites: list[list[int]]) -> list[int]:\n        pass`,
          java: `class Solution {\n    public int[] findOrder(int n, int[][] prerequisites) {\n        return new int[]{};\n    }\n}`
        },
        testCases: [
          { input: '4, [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: '[0,2,1,3]', description: 'Thứ tự đúng' },
          { input: '2, [[0,1],[1,0]]', expectedOutput: '[]', description: 'Có chu trình' }
        ]
      }
    ]
  }
}

const LANG_OPTIONS = ['javascript', 'python', 'java'] as const
type Lang = (typeof LANG_OPTIONS)[number]

// ─── Timer ───────────────────────────────────────────────────────────────────

function useCountdown(endsAt: string) {
  const getRemaining = useCallback(() => {
    const diff = new Date(endsAt).getTime() - Date.now()
    if (diff <= 0) return { h: 0, m: 0, s: 0, total: 0 }
    const s = Math.floor(diff / 1000)
    return { h: Math.floor(s / 3600), m: Math.floor((s % 3600) / 60), s: s % 60, total: diff }
  }, [endsAt])

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
  const arena = ARENA_DATA[id]

  const [selectedProblemId, setSelectedProblemId] = useState(arena?.problems[0]?.id ?? '')
  const [lang, setLang] = useState<Lang>('javascript')
  const [codes, setCodes] = useState<Record<string, Record<string, string>>>({})
  const [running, setRunning] = useState(false)
  const [rightTab, setRightTab] = useState<'editor' | 'console'>('editor')
  const [results, setResults] = useState<
    Record<string, { passed: boolean; case: string; expected: string; actual: string; description: string }[]>
  >({})
  const [solved, setSolved] = useState<Set<string>>(new Set())
  const [submitted, setSubmitted] = useState<Set<string>>(new Set())
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false)
  const [hPct, setHPct] = useState(26) // sidebar width %

  const timer = useCountdown(arena?.endsAt ?? new Date().toISOString())
  const timerWarning = timer.total < 10 * 60 * 1000 && timer.total > 0
  const timerDanger = timer.total < 3 * 60 * 1000

  const selectedProblem = arena?.problems.find(p => p.id === selectedProblemId)

  const getCode = (pid: string, l: string) =>
    codes[pid]?.[l] ?? arena?.problems.find(p => p.id === pid)?.defaultCode[l] ?? ''

  const setCode = (v: string) =>
    setCodes(prev => ({
      ...prev,
      [selectedProblemId]: { ...prev[selectedProblemId], [lang]: v }
    }))

  const handleReset = () =>
    setCodes(prev => ({
      ...prev,
      [selectedProblemId]: { ...prev[selectedProblemId], [lang]: selectedProblem?.defaultCode[lang] ?? '' }
    }))

  const handleRun = async () => {
    if (!selectedProblem) return
    setRunning(true)
    await new Promise(r => setTimeout(r, 1200))
    const mockResults = selectedProblem.testCases.map((tc, i) => ({
      passed: i < selectedProblem.testCases.length - 1,
      case: tc.input,
      expected: tc.expectedOutput,
      actual: i < selectedProblem.testCases.length - 1 ? tc.expectedOutput : 'undefined',
      description: tc.description
    }))
    setResults(prev => ({ ...prev, [selectedProblemId]: mockResults }))
    setRunning(false)
    setRightTab('console')
  }

  const handleSubmit = async () => {
    if (!selectedProblem) return
    setShowSubmitConfirm(false)
    setRunning(true)
    await new Promise(r => setTimeout(r, 1500))
    // Mock: mark as solved
    setSolved(prev => new Set([...prev, selectedProblemId]))
    setSubmitted(prev => new Set([...prev, selectedProblemId]))
    setRunning(false)
    setRightTab('console')
    setResults(prev => ({
      ...prev,
      [selectedProblemId]: selectedProblem.testCases.map(tc => ({
        passed: true,
        case: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput,
        description: tc.description
      }))
    }))
  }

  // Sidebar drag
  const onSidebarDrag = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      const startX = e.clientX
      const startPct = hPct
      const totalW = document.documentElement.clientWidth
      const onMove = (mv: MouseEvent) =>
        setHPct(Math.min(40, Math.max(15, startPct + ((mv.clientX - startX) / totalW) * 100)))
      const onUp = () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [hPct]
  )

  if (!arena) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen gap-4 bg-[#0f0f14]">
        <Trophy className="h-12 w-12 text-neutral-500" />
        <p className="text-neutral-400">Không tìm thấy phòng thi.</p>
        <Link href={`/contests/${id}`} className="text-sm text-blue-400 hover:underline">
          ← Quay lại chi tiết
        </Link>
      </div>
    )
  }

  const myScore = arena.problems.filter(p => solved.has(p.id)).reduce((sum, p) => sum + p.points, 0)

  return (
    <>
      <style>{`
        @keyframes arenaReveal {
          from { opacity: 0; transform: scale(0.97); filter: blur(4px); }
          to   { opacity: 1; transform: scale(1);    filter: blur(0); }
        }
        @keyframes timerPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .arena-enter { animation: arenaReveal 350ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .timer-blink { animation: timerPulse 1s ease-in-out infinite; }
      `}</style>

      <div className="arena-enter fixed inset-0 z-50 flex flex-col bg-[#0a0a12] text-neutral-100 overflow-hidden">
        {/* ── Top bar ── */}
        <div className="flex items-center gap-3 h-12 px-4 bg-[#13131f] border-b border-white/8 flex-shrink-0">
          <Link
            href={`/contests/${id}`}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>

          <div className="h-4 w-px bg-white/10" />
          <Flame className="h-3.5 w-3.5 text-orange-400 flex-shrink-0" />
          <h1 className="text-xs font-semibold text-neutral-200 truncate flex-1">{arena.title}</h1>

          {/* Solved progress chips */}
          <div className="hidden sm:flex items-center gap-1">
            {arena.problems.map(p => (
              <div
                key={p.id}
                title={p.title}
                className={`h-2 w-5 rounded-sm transition-colors ${
                  solved.has(p.id) ? 'bg-emerald-500' : submitted.has(p.id) ? 'bg-red-500' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Score */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="font-bold text-amber-300">{myScore}</span>
            <span className="text-neutral-500">/ {arena.totalPoints}</span>
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Timer */}
          <div
            className={`flex items-center gap-1.5 font-mono text-sm font-bold tabular-nums ${
              timerDanger ? 'text-red-400 timer-blink' : timerWarning ? 'text-amber-400' : 'text-neutral-200'
            }`}
          >
            <Clock className="h-3.5 w-3.5 flex-shrink-0" />
            {String(timer.h).padStart(2, '0')}:{String(timer.m).padStart(2, '0')}:{String(timer.s).padStart(2, '0')}
          </div>

          <div className="h-4 w-px bg-white/10" />

          {/* Action buttons */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            className="flex items-center justify-center w-7 h-7 rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-white/10 transition-colors"
          >
            <Menu className="h-4 w-4" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-1 overflow-hidden">
          {/* Problem sidebar */}
          {sidebarOpen && (
            <>
              <div
                className="flex flex-col bg-[#13131f] border-r border-white/8 flex-shrink-0 overflow-hidden"
                style={{ width: `${hPct}%` }}
              >
                {/* Sidebar header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/8 flex-shrink-0">
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-500">
                    Bài toán ({arena.problems.length})
                  </span>
                  <span className="text-[10px] text-neutral-500">
                    {solved.size}/{arena.problems.length} xong
                  </span>
                </div>

                {/* Problem list */}
                <div className="flex-1 overflow-y-auto py-1">
                  {arena.problems.map((p, idx) => {
                    const isActive = p.id === selectedProblemId
                    const isSolved = solved.has(p.id)
                    return (
                      <button
                        key={p.id}
                        onClick={() => setSelectedProblemId(p.id)}
                        className={`w-full text-left flex items-start gap-3 px-4 py-3 transition-colors group ${
                          isActive
                            ? 'bg-blue-500/10 border-r-2 border-blue-500'
                            : 'hover:bg-white/4 border-r-2 border-transparent'
                        }`}
                      >
                        {/* Status dot */}
                        <div
                          className={`mt-1 h-2 w-2 rounded-full flex-shrink-0 ${
                            isSolved ? 'bg-emerald-500' : isActive ? 'bg-blue-400' : 'bg-white/15'
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-xs font-medium leading-snug truncate ${isActive ? 'text-blue-300' : isSolved ? 'text-emerald-300' : 'text-neutral-400 group-hover:text-neutral-200'}`}
                          >
                            {idx + 1}. {p.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] font-semibold ${DIFF_COLOR[p.difficulty]}`}>
                              {p.difficulty}
                            </span>
                            <span className="text-[10px] text-neutral-600">{p.points} điểm</span>
                          </div>
                        </div>
                        {isSolved && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />}
                      </button>
                    )
                  })}
                </div>

                {/* My score */}
                <div className="border-t border-white/8 p-4 flex-shrink-0">
                  <div className="rounded-xl bg-white/4 border border-white/8 p-3 text-center">
                    <p className="text-[10px] text-neutral-500 uppercase tracking-widest mb-1">Điểm của bạn</p>
                    <p className="text-xl font-bold text-amber-300">{myScore}</p>
                    <div className="mt-2 h-1 rounded-full bg-white/8">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${(myScore / arena.totalPoints) * 100}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-neutral-600 mt-1">
                      {solved.size} / {arena.problems.length} bài hoàn thành
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar drag handle */}
              <div
                className="w-1 flex-shrink-0 bg-white/4 hover:bg-blue-500/30 cursor-col-resize transition-colors flex items-center justify-center group"
                onMouseDown={onSidebarDrag}
              >
                <GripVertical className="h-4 w-4 text-neutral-700 group-hover:text-blue-400 transition-colors" />
              </div>
            </>
          )}

          {/* ── Main: Problem desc + Editor ── */}
          {selectedProblem && (
            <div className="flex flex-1 overflow-hidden">
              {/* Problem description — left side of editor area */}
              <div className="w-[42%] flex-shrink-0 flex flex-col overflow-hidden border-r border-white/8">
                {/* Tab bar */}
                <div className="flex items-center h-9 border-b border-white/8 bg-[#13131f] px-4 gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${DIFF_BG[selectedProblem.difficulty]} ${DIFF_COLOR[selectedProblem.difficulty]}`}
                  >
                    {selectedProblem.difficulty}
                  </span>
                  <span className="text-xs text-neutral-400 flex-1 truncate">{selectedProblem.title}</span>
                  <span className="text-[10px] font-bold text-amber-400">{selectedProblem.points} điểm</span>
                </div>

                {/* Content */}
                <div
                  className="flex-1 overflow-y-auto p-5 space-y-6 text-neutral-300 select-text"
                  style={{ fontFamily: 'system-ui, sans-serif' }}
                >
                  <div
                    className="text-sm leading-7 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: selectedProblem.description
                        .replace(
                          /`([^`]+)`/g,
                          '<code class="bg-white/8 rounded px-1.5 py-0.5 text-emerald-300 text-[12px] font-mono">$1</code>'
                        )
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    }}
                  />

                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Ví dụ</p>
                    {selectedProblem.examples.map((ex, i) => (
                      <div
                        key={i}
                        className="rounded-lg bg-[#1c1c28] border border-white/8 p-3.5 space-y-2 font-mono text-xs"
                      >
                        <div>
                          <span className="text-neutral-500">Input: </span>
                          <span className="text-emerald-300">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-neutral-500">Output: </span>
                          <span className="text-blue-300">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-neutral-400 font-sans text-[11px] mt-1 pt-2 border-t border-white/5">
                            💡 {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Ràng buộc</p>
                    <ul className="space-y-1.5">
                      {selectedProblem.constraints.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-neutral-400">
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                          <code className="font-mono">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Editor + console */}
              <div className="flex-1 flex flex-col overflow-hidden">
                {/* Editor toolbar */}
                <div className="flex items-center h-9 border-b border-white/8 bg-[#1c1c28] px-3 gap-2 flex-shrink-0">
                  {[
                    { key: 'editor' as const, label: 'Code', icon: <Code2 className="h-3 w-3" /> },
                    {
                      key: 'console' as const,
                      label: results[selectedProblemId]
                        ? `Kết quả (${results[selectedProblemId].filter(r => r.passed).length}/${results[selectedProblemId].length})`
                        : 'Kết quả',
                      icon: <Terminal className="h-3 w-3" />
                    }
                  ].map(t => (
                    <button
                      key={t.key}
                      onClick={() => setRightTab(t.key)}
                      className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors ${
                        rightTab === t.key ? 'bg-white/10 text-white' : 'text-neutral-500 hover:text-neutral-300'
                      }`}
                    >
                      {t.icon}
                      {t.label}
                    </button>
                  ))}
                  <div className="flex-1" />

                  {/* Lang */}
                  <div className="flex items-center bg-[#0f0f14] rounded-md p-0.5 gap-0.5">
                    {LANG_OPTIONS.map(l => (
                      <button
                        key={l}
                        onClick={() => setLang(l)}
                        className={`px-2 py-1 rounded text-[10px] font-medium capitalize transition-colors ${
                          lang === l ? 'bg-white/15 text-white' : 'text-neutral-500 hover:text-neutral-300'
                        }`}
                      >
                        {l}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleReset}
                    className="flex items-center justify-center w-6 h-6 rounded text-neutral-500 hover:text-neutral-300 hover:bg-white/8 transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </button>

                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 px-2.5 text-[10px] text-emerald-400 hover:text-white hover:bg-emerald-600 gap-1 border border-emerald-600/40"
                    onClick={handleRun}
                    disabled={running}
                  >
                    {running ? (
                      <Loader2 className="h-2.5 w-2.5 animate-spin" />
                    ) : (
                      <Play className="h-2.5 w-2.5 fill-emerald-400" />
                    )}
                    Chạy thử
                  </Button>

                  <Button
                    size="sm"
                    className="h-6 px-2.5 text-[10px] bg-blue-600 hover:bg-blue-500 text-white gap-1"
                    onClick={() => setShowSubmitConfirm(true)}
                    disabled={running || solved.has(selectedProblemId)}
                  >
                    {solved.has(selectedProblemId) ? (
                      <>
                        <CheckCircle2 className="h-2.5 w-2.5" /> Đã nộp
                      </>
                    ) : (
                      <>
                        <Send className="h-2.5 w-2.5" /> Nộp bài
                      </>
                    )}
                  </Button>
                </div>

                {/* Monaco editor */}
                <div
                  className="flex-1 overflow-hidden"
                  style={{ display: rightTab === 'editor' ? 'flex' : 'none', flexDirection: 'column' }}
                >
                  <MonacoEditor
                    height="100%"
                    language={lang}
                    value={getCode(selectedProblemId, lang)}
                    onChange={v => setCode(v ?? '')}
                    theme="vs-dark"
                    options={{
                      fontSize: 13,
                      minimap: { enabled: false },
                      scrollBeyondLastLine: false,
                      lineNumbers: 'on',
                      tabSize: 2,
                      wordWrap: 'on',
                      padding: { top: 12, bottom: 12 },
                      fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace'
                    }}
                  />
                </div>

                {/* Console */}
                {rightTab === 'console' && (
                  <div className="flex-1 overflow-y-auto bg-[#090912] p-4 space-y-3">
                    {running && (
                      <div className="flex items-center gap-2 py-10 justify-center text-neutral-400">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                        <span className="text-sm">Đang chạy…</span>
                      </div>
                    )}
                    {!running && !results[selectedProblemId] && (
                      <div className="flex flex-col items-center gap-3 py-12 text-center">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center">
                          <Play className="h-5 w-5 text-neutral-500" />
                        </div>
                        <p className="text-xs text-neutral-500">
                          Nhấn <strong className="text-neutral-300">Chạy thử</strong> hoặc{' '}
                          <strong className="text-neutral-300">Nộp bài</strong>
                        </p>
                      </div>
                    )}
                    {!running && results[selectedProblemId] && (
                      <>
                        {results[selectedProblemId].every(r => r.passed) ? (
                          <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 flex items-center gap-3">
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                            <div>
                              <p className="text-sm font-bold text-emerald-300">Tất cả test case đúng! 🎉</p>
                              {submitted.has(selectedProblemId) && (
                                <p className="text-xs text-emerald-400/80 mt-0.5">
                                  +{selectedProblem.points} điểm đã được tính
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center gap-3">
                            <XCircle className="h-5 w-5 text-red-400" />
                            <p className="text-sm font-semibold text-red-300">
                              {results[selectedProblemId].filter(r => r.passed).length}/
                              {results[selectedProblemId].length} test case đúng
                            </p>
                          </div>
                        )}
                        {results[selectedProblemId].map((r, i) => (
                          <div
                            key={i}
                            className={`rounded-xl border p-3 ${r.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}
                          >
                            <div className="flex items-center gap-2">
                              {r.passed ? (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5 text-red-400" />
                              )}
                              <span
                                className={`text-xs font-semibold ${r.passed ? 'text-emerald-300' : 'text-red-300'}`}
                              >
                                Test {i + 1}: {r.passed ? 'Đúng ✓' : 'Sai ✗'} — {r.description}
                              </span>
                            </div>
                            {!r.passed && (
                              <div className="mt-2 pl-5 space-y-1 font-mono text-xs text-neutral-400">
                                <div>
                                  Input: <span className="text-neutral-200">{r.case}</span>
                                </div>
                                <div>
                                  Kỳ vọng: <span className="text-emerald-300">{r.expected}</span>
                                </div>
                                <div>
                                  Nhận được: <span className="text-red-300">{r.actual}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Submit confirmation overlay ── */}
        {showSubmitConfirm && selectedProblem && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="bg-[#1c1c28] border border-white/12 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                  <Send className="h-5 w-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-100">Xác nhận nộp bài</h3>
                  <p className="text-xs text-neutral-400">{selectedProblem.title}</p>
                </div>
              </div>
              <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-3 flex gap-2 mb-5">
                <AlertCircle className="h-4 w-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Sau khi nộp, bài thi sẽ được chấm điểm tự động. Bạn có thể nộp lại nếu có token còn.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  className="flex-1 text-sm text-neutral-400"
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Hủy
                </Button>
                <Button className="flex-1 text-sm bg-blue-600 hover:bg-blue-500 gap-2" onClick={handleSubmit}>
                  <Send className="h-3.5 w-3.5" /> Nộp bài
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
