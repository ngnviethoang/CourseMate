'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowLeft,
  Play,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Code2,
  Terminal,
  BookOpen,
  Loader2,
  Lightbulb,
  GripVertical,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { runnerCodeService } from '@/lib/runner-code-service'
import type { RunCodeRequest, LanguageDto, RunCodeResponse } from '@/lib/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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

// ─── Types ────────────────────────────────────────────────────────────────────

export type Difficulty = 'Dễ' | 'Trung bình' | 'Khó'

export interface ExerciseData {
  id: string
  title: string
  difficulty: Difficulty
  category: string
  description: string
  examples: { input: string; output: string; explanation?: string }[]
  constraints: string[]
  hints: string[]
  defaultCode: Record<string, string>
  testCases: { input: string; expectedOutput: string; description: string }[]
}

interface RunResult {
  passed: boolean
  case: string
  expected: string
  actual: string
  description: string
}

// ─── Drag hooks ──────────────────────────────────────────────────────────────

function useHorizontalDrag(initial: number) {
  const [pct, setPct] = useState(initial)
  const dragging = useRef(false)

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      dragging.current = true
      const startX = e.clientX
      const startPct = pct
      const totalW = document.documentElement.clientWidth
      const onMove = (mv: MouseEvent) => {
        if (!dragging.current) return
        setPct(Math.min(65, Math.max(25, startPct + ((mv.clientX - startX) / totalW) * 100)))
      }
      const onUp = () => {
        dragging.current = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseup', onUp)
      }
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseup', onUp)
    },
    [pct]
  )

  return { pct, onMouseDown }
}

export const DIFF_STYLE: Record<Difficulty, string> = {
  Dễ: 'text-emerald-400 bg-emerald-400/10',
  'Trung bình': 'text-amber-400 bg-amber-400/10',
  Khó: 'text-red-400 bg-red-400/10'
}

// ─── Constants for Runner ─────────────────────────────────────────────────────

const LANGUAGE_MAPPING: Record<string, string> = {
  javascript: 'typescript-deno',
  python: 'python-3.14',
  java: 'openjdk-25',
  csharp: 'dotnet-csharp-9',
  cpp: 'g++-15',
  go: 'go-1.26',
  rust: 'rust-1.93'
}

const DEFAULT_TEMPLATES: Record<string, string> = {
  'python-3.14': 'import sys\n\ndef solve():\n    # Đọc dữ liệu từ stdin\n    # input_data = sys.stdin.read().split()\n    \n    # Logic của bạn ở đây\n    print("Hello from Python")\n\nif __name__ == "__main__":\n    solve()',
  'g++-15': '#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    // Giải quyết bài toán tại đây\n    \n    return 0;\n}',
  'gcc-15': '#include <stdio.h>\n\nint main() {\n    // Giải quyết bài toán tại đây\n    \n    return 0;\n}',
  'openjdk-25': 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Viết code của bạn tại đây\n    }\n}',
  'dotnet-csharp-9': 'using System;\n\nclass Program {\n    static void Main() {\n        // Đọc dữ liệu: string line = Console.ReadLine();\n        Console.WriteLine("Hello C#");\n    }\n}',
  'go-1.26': 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Code của bạn\n    fmt.Println("Hello Go")\n}',
  'rust-1.93': 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    println!("Hello Rust");\n}',
  'typescript-deno': 'const input = new TextDecoder().decode(await Deno.readAll(Deno.stdin));\nconsole.log("Hello TypeScript (Deno)");',
  'php-8.5': '<?php\n\n$stdin = fopen(\'php://stdin\', \'r\');\necho "Hello PHP";',
  'ruby-4.0': 'input = gets\nputs "Hello Ruby"',
  'dotnet-fsharp-9': 'open System\n\n[<EntryPoint>]\nlet main argv = \n    printfn "Hello F#"\n    0',
  'haskell-9.12': 'main :: IO ()\nmain = do\n    putStrLn "Hello Haskell"'
}


// ─── Main component ───────────────────────────────────────────────────────────

interface ExerciseEditorModalProps {
  exercise: ExerciseData
  onClose?: () => void
  isModal?: boolean
  onNext?: () => void
  onPrev?: () => void
  hasNext?: boolean
  hasPrev?: boolean
}

export function ExerciseEditorModal({ 
  exercise, 
  onClose, 
  isModal = true,
  onNext,
  onPrev,
  hasNext,
  hasPrev
}: ExerciseEditorModalProps) {
  const [supportedLangs, setSupportedLangs] = useState<LanguageDto[]>([])
  const [selectedLang, setSelectedLang] = useState<LanguageDto | null>(null)
  const [code, setCode] = useState('')
  const [stdin, setStdin] = useState('')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<RunResult[] | null>(null)
  const [rawOutput, setRawOutput] = useState<{ stdout: string; stderr: string; time?: string; memory?: string; status?: string; exitCode?: number } | null>(null)
  const [leftTab, setLeftTab] = useState<'problem' | 'hints'>('problem')
  const [rightTab, setRightTab] = useState<'editor' | 'console'>('editor')

  const { pct: hPct, onMouseDown: hDrag } = useHorizontalDrag(40)

  // 1. Fetch supported languages on mount
  useEffect(() => {
    const fetchLangs = async () => {
      try {
        const langs = await runnerCodeService.getLanguages()
        setSupportedLangs(langs)
        if (langs.length > 0) {
          setSelectedLang(langs[0])
          // Set initial code from template or exercise
          setCode(exercise.defaultCode[langs[0].id] ?? DEFAULT_TEMPLATES[langs[0].id] ?? '')
        }
      } catch (err) {
        console.error('Failed to fetch languages', err)
      }
    }
    fetchLangs()
  }, [exercise.defaultCode])

  // 2. Initialize stdin from first example
  useEffect(() => {
    if (exercise.examples.length > 0) {
      // Use the raw input value
      const firstInput = exercise.examples[0].input.replace(/^[a-z]+ = /i, '')
      setStdin(firstInput)
    }
  }, [exercise])


  // Esc to close
  useEffect(() => {
    if (!isModal || !onClose) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isModal, onClose])

  const handleLangChange = (l: LanguageDto) => {
    setSelectedLang(l)
    setCode(exercise.defaultCode[l.id] ?? DEFAULT_TEMPLATES[l.id] ?? '')
    setResults(null)
    setRawOutput(null)
  }
  const handleReset = () => {
    if (!selectedLang) return
    setCode(exercise.defaultCode[selectedLang.id] ?? DEFAULT_TEMPLATES[selectedLang.id] ?? '')
    setResults(null)
    setRawOutput(null)
  }

  const handleRun = async (input: string) => {
    if (!selectedLang) return null
    setRunning(true)
    setResults(null)
    setRawOutput(null)
    setRightTab('console')

    try {
      const response = await runnerCodeService.run({
        compiler: selectedLang.id,
        code: code,
        input: input
      })

      setRawOutput({
        stdout: response.output,
        stderr: response.error,
        time: response.time,
        memory: response.memory,
        status: response.status,
        exitCode: response.exit_code
      })

      setRunning(false)
      return response
    } catch (err) {
      console.error('Run failed', err)
      setRawOutput({
        stdout: '',
      })
      return null
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedLang || exercise.testCases.length === 0) return
    setRunning(true)
    setResults([]) // Khởi tạo mảng kết quả trống
    setRawOutput(null)
    setRightTab('console')

    const newResults: RunResult[] = []
    let passedCount = 0

    // Duyệt qua từng test case để thực thi
    for (const tc of exercise.testCases) {
      try {
        const response = await runnerCodeService.run({
          compiler: selectedLang.id,
          code: code,
          input: tc.input
        })

        const actual = (response.output || '').trim()
        const expected = (tc.expectedOutput || '').trim()
        const isPassed = actual === expected

        if (isPassed) passedCount++

        newResults.push({
          passed: isPassed,
          case: tc.input,
          expected: expected,
          actual: actual,
          description: tc.description
        })
      } catch (err) {
        newResults.push({
          passed: false,
          case: tc.input,
          expected: tc.expectedOutput,
          actual: 'Lỗi thực thi',
          description: tc.description
        })
      }
    }

    setResults(newResults)
    setRunning(false)
    
    // Nếu vượt qua tất cả, có thể làm gì đó thêm (vd: confetti)
    if (newResults.every(r => r.passed)) {
       // logic cho success
    }
  }

  const allPassed = results?.every(r => r.passed) ?? false
  const passedCount = results?.filter(r => r.passed).length ?? 0

  return (
    <>
      {/* ── Animation styles ── */}
      <style>{`
        @keyframes editorReveal {
          0%   { opacity: 0; transform: scale(0.96) translateY(20px); filter: blur(6px); }
          60%  { opacity: 1; filter: blur(0px); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
        }
        @keyframes editorExit {
          0%   { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
          100% { opacity: 0; transform: scale(0.97) translateY(12px); filter: blur(4px); }
        }
        @keyframes loadBar {
          0%   { transform: translateX(-100%); }
          40%  { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes loadBarFade {
          0%, 75% { opacity: 1; }
          100%     { opacity: 0; }
        }
        @keyframes panelFadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scanline {
          0%   { background-position: 0 0; }
          100% { background-position: 0 100vh; }
        }
        .editor-enter {
          animation: editorReveal 380ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .editor-topbar {
          animation: panelFadeIn 300ms 120ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .editor-left-panel {
          animation: panelFadeIn 320ms 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .editor-right-panel {
          animation: panelFadeIn 320ms 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .load-bar-track {
          animation: loadBarFade 700ms 100ms ease forwards;
          overflow: hidden;
        }
        .load-bar-fill {
          animation: loadBar 600ms 100ms cubic-bezier(0.4, 0, 0.2, 1) forwards;
          background: linear-gradient(90deg, transparent, #60a5fa, #a78bfa, #34d399, transparent);
          height: 100%;
          width: 120%;
        }
      `}</style>

      <div
        className="editor-enter flex flex-col bg-[#0f0f14] text-neutral-100 overflow-hidden select-none"
        style={{ height: '100%' }}
      >
        {/* Rainbow loading bar */}
        <div className="load-bar-track absolute top-0 left-0 right-0 h-[2px] z-10 bg-transparent pointer-events-none">
          <div className="load-bar-fill" />
        </div>

        {/* Top bar */}
        <div className="editor-topbar flex items-center gap-3 h-11 px-4 bg-[#1c1c28] border-b border-white/8 flex-shrink-0">
          {isModal && onClose ? (
            <button
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Bài tập
            </button>
          ) : (
            <Link
              href="/exercises"
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Bài tập
            </Link>
          )}

          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-xs font-medium text-neutral-200 truncate select-text">{exercise.title}</h1>
          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${DIFF_STYLE[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>

          <div className="flex items-center gap-1 mx-2">
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-neutral-400 hover:text-white"
              onClick={onPrev}
              disabled={!hasPrev}
              title="Bài trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6 text-neutral-400 hover:text-white"
              onClick={onNext}
              disabled={!hasNext}
              title="Bài kế tiếp"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex-1" />
          <div className="h-4 w-px bg-white/10" />

          <div className="flex items-center bg-[#2a2a3a] rounded-md p-1 gap-1 max-w-[300px] overflow-hidden">
            <select
              className="bg-transparent text-[11px] font-medium px-2 py-0.5 outline-none text-neutral-200 cursor-pointer w-full"
              value={selectedLang?.id || ''}
              onChange={(e) => {
                const l = supportedLangs.find(x => x.id === e.target.value)
                if (l) handleLangChange(l)
              }}
            >
              {supportedLangs.map(l => (
                <option key={l.id} value={l.id} className="bg-[#1c1c28]">
                  {l.name}
                </option>
              ))}
            </select>
          </div>

          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2.5 text-[11px] text-neutral-400 hover:text-white hover:bg-white/10 gap-1.5"
            onClick={handleReset}
          >
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>

          <Button
            size="sm"
            className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 rounded-md"
            onClick={() => handleRun(stdin)}
            disabled={running}
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-white" />}
            {running ? 'Đang chạy' : 'Chạy thử'}
          </Button>

          <Button
            size="sm"
            className="h-7 px-3 text-[11px] bg-blue-600 hover:bg-blue-500 text-white gap-1.5 rounded-md"
            onClick={handleSubmit}
            disabled={running}
          >
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
            {running ? 'Đang chấm' : 'Nộp bài'}
          </Button>

          {/* Close button for modal mode */}
          {isModal && onClose && (
            <button
              onClick={onClose}
              className="ml-1 flex items-center justify-center w-7 h-7 rounded-lg text-neutral-500 hover:text-neutral-100 hover:bg-white/10 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left panel */}
          <div
            className="editor-left-panel flex overflow-hidden bg-[#13131f] flex-shrink-0"
            style={{ width: `${hPct}%` }}
          >
            {/* Content area */}
            <div
              className="flex-1 overflow-y-auto p-5 space-y-6 text-neutral-300 select-text min-w-0"
              style={{ fontFamily: 'system-ui, sans-serif' }}
            >
              {leftTab === 'problem' && (
                <>
                  <div
                    className="text-sm leading-7 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: exercise.description
                        .replace(
                          /`([^`]+)`/g,
                          '<code class="bg-white/8 rounded px-1.5 py-0.5 text-emerald-300 text-[12px] font-mono">$1</code>'
                        )
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    }}
                  />

                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Ví dụ</p>
                    {exercise.examples.map((ex, i) => (
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
                      {exercise.constraints.map((c, i) => (
                        <li key={i} className="flex gap-2 text-xs text-neutral-400">
                          <span className="text-blue-500 mt-0.5 flex-shrink-0">•</span>
                          <code className="font-mono">{c}</code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              {leftTab === 'hints' && (
                <div className="space-y-3">
                  {exercise.hints.map((hint, i) => (
                    <div key={i} className="rounded-lg bg-[#1c1c28] border border-amber-500/20 p-4">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 mb-2">
                        Gợi ý {i + 1}
                      </p>
                      <p className="text-sm text-neutral-300 leading-relaxed">{hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Vertical tab strip — right of left panel */}
            <div className="flex flex-col items-center gap-1 w-10 flex-shrink-0 bg-[#1c1c28] border-l border-white/8 py-2">
              {[
                { key: 'problem' as const, icon: <BookOpen className="h-4 w-4" />, label: 'Đề bài' },
                { key: 'hints' as const, icon: <Lightbulb className="h-4 w-4" />, label: 'Gợi ý' }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setLeftTab(t.key)}
                  title={t.label}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${leftTab === t.key
                      ? 'bg-blue-500/15 text-blue-400'
                      : 'text-neutral-600 hover:text-neutral-300 hover:bg-white/5'
                    }`}
                >
                  {t.icon}
                  {leftTab === t.key && (
                    <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-blue-400" />
                  )}
                  <span className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-800 border border-white/10 px-2 py-1 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal drag handle */}
          <div
            className="w-1 flex-shrink-0 bg-white/5 hover:bg-blue-500/40 cursor-col-resize transition-colors flex items-center justify-center group"
            onMouseDown={hDrag}
          >
            <GripVertical className="h-4 w-4 text-neutral-600 group-hover:text-blue-400 transition-colors" />
          </div>

          {/* Right panel */}
          <div className="editor-right-panel flex flex-col flex-1 overflow-hidden">
            {/* Right tab bar */}
            <div className="flex border-b border-white/8 bg-[#1c1c28] flex-shrink-0">
              {[
                { key: 'editor' as const, label: 'Code', icon: <Code2 className="h-3.5 w-3.5" /> },
                {
                  key: 'console' as const,
                  label: `Kết quả${results ? ` (${passedCount}/${results.length})` : ''}`,
                  icon: <Terminal className="h-3.5 w-3.5" />
                }
              ].map(t => (
                <button
                  key={t.key}
                  onClick={() => setRightTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${rightTab === t.key
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-neutral-500 hover:text-neutral-300'
                    }`}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div
              className="flex-1 overflow-hidden"
              style={{ display: rightTab === 'editor' ? 'flex' : 'none', flexDirection: 'column' }}
            >
              <MonacoEditor
                height="100%"
                language={
                  selectedLang?.id.split('-')[0] === 'openjdk' ? 'java' :
                  selectedLang?.id.split('-')[0] === 'dotnet' ? (selectedLang?.id.includes('csharp') ? 'csharp' : 'fsharp') :
                  selectedLang?.id.startsWith('g++') || selectedLang?.id.startsWith('gcc') ? 'cpp' :
                  selectedLang?.id.startsWith('python') ? 'python' :
                  selectedLang?.id.startsWith('go') ? 'go' :
                  selectedLang?.id.startsWith('rust') ? 'rust' :
                  selectedLang?.id.startsWith('typescript') ? 'typescript' :
                  selectedLang?.id.startsWith('php') ? 'php' :
                  selectedLang?.id.startsWith('ruby') ? 'ruby' :
                  selectedLang?.id.startsWith('haskell') ? 'haskell' :
                  'javascript'
                }
                value={code}
                onChange={v => setCode(v ?? '')}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on',
                  renderLineHighlight: 'line',
                  tabSize: 2,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                  fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace',
                  fontLigatures: true
                }}
              />
            </div>

            {/* Console */}
            {rightTab === 'console' && (
              <div className="flex-1 overflow-y-auto bg-[#0a0a12] p-5 space-y-5">
                {/* Custom Input */}
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">Custom Input (stdin)</Label>
                  <textarea
                    value={stdin}
                    onChange={(e) => setStdin(e.target.value)}
                    placeholder="Nhập dữ liệu đầu vào..."
                    className="w-full h-20 bg-[#1c1c28] border border-white/8 rounded-lg p-3 text-xs font-mono outline-none focus:border-blue-500/50 transition-colors resize-none"
                  />
                </div>

                <div className="h-px bg-white/5" />

                {running && (
                  <div className="flex flex-col items-center gap-4 py-10 justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                    <span className="text-sm text-neutral-400 animate-pulse">Server đang thực thi mã nguồn…</span>
                  </div>
                )}

                {!running && !rawOutput && (!results || results.length === 0) && (
                  <div className="flex flex-col items-center gap-3 py-14 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Play className="h-6 w-6 text-neutral-500" />
                    </div>
                    <p className="text-xs text-neutral-500">
                      Nhấn <strong className="text-neutral-300">Chạy thử</strong> hoặc <strong className="text-neutral-300">Nộp bài</strong>
                    </p>
                  </div>
                )}

                {/* Submission Results Summary */}
                {results && results.length > 0 && (
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border flex items-center gap-4 ${
                      results.every(r => r.passed) 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                    }`}>
                      {results.every(r => r.passed) ? <CheckCircle2 className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
                      <div className="flex-1">
                        <p className="text-sm font-bold">
                          {results.every(r => r.passed) ? 'Vượt qua tất cả test cases! 🎉' : 'Một số test case không vượt qua.'}
                        </p>
                        <p className="text-xs opacity-80">
                          Kết quả: {results.filter(r => r.passed).length}/{results.length} test cases đúng
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black">{Math.round((results.filter(r => r.passed).length / results.length) * 100)}/100</p>
                        <p className="text-[10px] font-bold uppercase tracking-tight opacity-60">Điểm số</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                       {results.map((r, i) => (
                         <div key={i} className={`p-3 rounded-lg border text-[11px] font-mono ${
                           r.passed ? 'bg-[#161d16] border-emerald-500/20' : 'bg-[#1d1616] border-red-500/20'
                         }`}>
                           <div className="flex items-center justify-between mb-2">
                             <div className="flex items-center gap-2">
                               {r.passed ? <CheckCircle2 className="h-3 w-3 text-emerald-500" /> : <XCircle className="h-3 w-3 text-red-500" />}
                               <span className={r.passed ? 'text-emerald-400' : 'text-red-400'}>Test {i + 1}: {r.description}</span>
                             </div>
                             <span className={r.passed ? 'text-emerald-500' : 'text-red-500'}>{r.passed ? 'PASSED' : 'FAILED'}</span>
                           </div>
                           {!r.passed && (
                             <div className="space-y-1 pl-5 opacity-80">
                               <p><span className="text-neutral-500">Input:</span> {r.case}</p>
                               <p><span className="text-neutral-500">Expected:</span> <span className="text-emerald-500">{r.expected}</span></p>
                               <p><span className="text-neutral-500">Actual:</span> <span className="text-red-500">{r.actual}</span></p>
                             </div>
                           )}
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {!running && rawOutput && (
                  <div className="space-y-4">
                    {rawOutput.stdout && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">Standard Output (stdout)</Label>
                          {rawOutput.time && (
                            <span className="text-[10px] text-neutral-500 font-mono">
                              {rawOutput.status} • {rawOutput.time}s • {Math.round(parseInt(rawOutput.memory || '0') / 1024)}MB • Exit: {rawOutput.exitCode}
                            </span>
                          )}
                        </div>
                        <pre className="bg-[#1c1c28] border border-emerald-500/20 rounded-lg p-4 text-xs font-mono text-emerald-50 text-wrap">
                          {rawOutput.stdout}
                        </pre>
                      </div>
                    )}

                    {rawOutput.stderr && (
                      <div className="space-y-2">
                        <Label className="text-[10px] font-bold uppercase tracking-widest text-red-500">Error Output (stderr)</Label>
                        <pre className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 text-xs font-mono text-red-300 text-wrap">
                          {rawOutput.stderr}
                        </pre>
                      </div>
                    )}

                    {!rawOutput.stdout && !rawOutput.stderr && (
                      <div className="text-xs text-neutral-500 italic py-4">
                        Chương trình kết thúc mà không có output.
                      </div>
                    )}
                  </div>
                )}

                {/* Test Cases Quick Access */}
                <div className="pt-4 border-t border-white/5">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-3 block">Sử dụng Test Case</Label>
                  <div className="grid grid-cols-1 gap-2">
                    {exercise.testCases.map((tc, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          setStdin(tc.input)
                          handleRun(tc.input)
                        }}
                        className="flex items-center justify-between p-3 rounded-lg bg-[#16161e] border border-white/5 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all text-left group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] font-medium text-neutral-300 truncate">{tc.description || `Test case ${i+1}`}</p>
                          <code className="text-[10px] text-neutral-500 truncate block mt-0.5">Input: {tc.input}</code>
                        </div>
                        <Play className="h-3 w-3 text-neutral-600 group-hover:text-blue-400 ml-3" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
