'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowLeft, Play, RotateCcw, CheckCircle2, XCircle,
  Code2, Terminal, BookOpen, Loader2, Lightbulb, GripVertical, X
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
  passed: boolean; case: string; expected: string; actual: string; description: string
}

// ─── Drag hooks ──────────────────────────────────────────────────────────────

function useHorizontalDrag(initial: number) {
  const [pct, setPct] = useState(initial)
  const dragging = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
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
  }, [pct])

  return { pct, onMouseDown }
}

// ─── Difficulty style ─────────────────────────────────────────────────────────

export const DIFF_STYLE: Record<Difficulty, string> = {
  'Dễ': 'text-emerald-400 bg-emerald-400/10',
  'Trung bình': 'text-amber-400 bg-amber-400/10',
  'Khó': 'text-red-400 bg-red-400/10'
}

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  exercise: ExerciseData
  /** called when user clicks Back / presses Esc */
  onClose?: () => void
  /** show as overlay modal (true) or full standalone page (false) */
  isModal?: boolean
}

export function ExerciseEditorModal({ exercise, onClose, isModal = true }: Props) {
  const LANG_OPTIONS = ['javascript', 'python', 'java'] as const
  type Lang = typeof LANG_OPTIONS[number]

  const [lang, setLang] = useState<Lang>('javascript')
  const [code, setCode] = useState(exercise.defaultCode.javascript ?? '')
  const [running, setRunning] = useState(false)
  const [results, setResults] = useState<RunResult[] | null>(null)
  const [leftTab, setLeftTab] = useState<'problem' | 'hints'>('problem')
  const [rightTab, setRightTab] = useState<'editor' | 'console'>('editor')

  const { pct: hPct, onMouseDown: hDrag } = useHorizontalDrag(40)

  // Esc to close
  useEffect(() => {
    if (!isModal || !onClose) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isModal, onClose])

  const handleLangChange = (l: Lang) => { setLang(l); setCode(exercise.defaultCode[l] ?? ''); setResults(null) }
  const handleReset = () => { setCode(exercise.defaultCode[lang]); setResults(null) }

  const handleRun = async () => {
    setRunning(true); setResults(null)
    await new Promise(r => setTimeout(r, 1400))
    const mockResults: RunResult[] = exercise.testCases.map((tc, i) => ({
      passed: i < exercise.testCases.length - 1,
      case: tc.input, expected: tc.expectedOutput,
      actual: i < exercise.testCases.length - 1 ? tc.expectedOutput : 'undefined',
      description: tc.description
    }))
    setResults(mockResults); setRunning(false); setRightTab('console')
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

      <div className="editor-enter flex flex-col bg-[#0f0f14] text-neutral-100 overflow-hidden select-none" style={{ height: '100%' }}>

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
            <Link href="/exercises" className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-neutral-100 transition-colors flex-shrink-0">
              <ArrowLeft className="h-3.5 w-3.5" /> Bài tập
            </Link>
          )}

          <div className="h-4 w-px bg-white/10" />
          <h1 className="text-xs font-medium text-neutral-200 truncate flex-1 select-text">{exercise.title}</h1>
          <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${DIFF_STYLE[exercise.difficulty]}`}>
            {exercise.difficulty}
          </span>
          <div className="h-4 w-px bg-white/10" />

          {/* Lang selector */}
          <div className="flex items-center bg-[#2a2a3a] rounded-md p-0.5 gap-0.5">
            {LANG_OPTIONS.map(l => (
              <button key={l} onClick={() => handleLangChange(l)}
                className={`px-2.5 py-1 rounded text-[11px] font-medium capitalize transition-colors ${lang === l ? 'bg-white/15 text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}>
                {l}
              </button>
            ))}
          </div>

          <Button size="sm" variant="ghost"
            className="h-7 px-2.5 text-[11px] text-neutral-400 hover:text-white hover:bg-white/10 gap-1.5"
            onClick={handleReset}>
            <RotateCcw className="h-3 w-3" /> Reset
          </Button>

          <Button size="sm"
            className="h-7 px-3 text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 rounded-md"
            onClick={handleRun} disabled={running}>
            {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3 fill-white" />}
            {running ? 'Đang chạy…' : 'Chạy thử'}
          </Button>

          {/* Close button for modal mode */}
          {isModal && onClose && (
            <button onClick={onClose}
              className="ml-1 flex items-center justify-center w-7 h-7 rounded-lg text-neutral-500 hover:text-neutral-100 hover:bg-white/10 transition-colors">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left panel */}
          <div className="editor-left-panel flex overflow-hidden bg-[#13131f] flex-shrink-0" style={{ width: `${hPct}%` }}>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-neutral-300 select-text min-w-0" style={{ fontFamily: 'system-ui, sans-serif' }}>

              {leftTab === 'problem' && (
                <>
                  <div className="text-sm leading-7 whitespace-pre-line"
                    dangerouslySetInnerHTML={{
                      __html: exercise.description
                        .replace(/`([^`]+)`/g, '<code class="bg-white/8 rounded px-1.5 py-0.5 text-emerald-300 text-[12px] font-mono">$1</code>')
                        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>')
                    }}
                  />

                  <div className="space-y-3">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-neutral-500">Ví dụ</p>
                    {exercise.examples.map((ex, i) => (
                      <div key={i} className="rounded-lg bg-[#1c1c28] border border-white/8 p-3.5 space-y-2 font-mono text-xs">
                        <div><span className="text-neutral-500">Input: </span><span className="text-emerald-300">{ex.input}</span></div>
                        <div><span className="text-neutral-500">Output: </span><span className="text-blue-300">{ex.output}</span></div>
                        {ex.explanation && <div className="text-neutral-400 font-sans text-[11px] mt-1 pt-2 border-t border-white/5">💡 {ex.explanation}</div>}
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
                      <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500/60 mb-2">Gợi ý {i + 1}</p>
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
                <button key={t.key} onClick={() => setLeftTab(t.key)} title={t.label}
                  className={`group relative flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${leftTab === t.key ? 'bg-blue-500/15 text-blue-400' : 'text-neutral-600 hover:text-neutral-300 hover:bg-white/5'
                    }`}>
                  {t.icon}
                  {leftTab === t.key && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-full bg-blue-400" />}
                  <span className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-800 border border-white/10 px-2 py-1 text-[11px] text-neutral-200 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                    {t.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Horizontal drag handle */}
          <div className="w-1 flex-shrink-0 bg-white/5 hover:bg-blue-500/40 cursor-col-resize transition-colors flex items-center justify-center group" onMouseDown={hDrag}>
            <GripVertical className="h-4 w-4 text-neutral-600 group-hover:text-blue-400 transition-colors" />
          </div>

          {/* Right panel */}
          <div className="editor-right-panel flex flex-col flex-1 overflow-hidden">
            {/* Right tab bar */}
            <div className="flex border-b border-white/8 bg-[#1c1c28] flex-shrink-0">
              {[
                { key: 'editor' as const, label: 'Code', icon: <Code2 className="h-3.5 w-3.5" /> },
                { key: 'console' as const, label: `Kết quả${results ? ` (${passedCount}/${results.length})` : ''}`, icon: <Terminal className="h-3.5 w-3.5" /> }
              ].map(t => (
                <button key={t.key} onClick={() => setRightTab(t.key)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium border-b-2 transition-colors ${rightTab === t.key ? 'border-blue-500 text-blue-400' : 'border-transparent text-neutral-500 hover:text-neutral-300'
                    }`}>
                  {t.icon}{t.label}
                </button>
              ))}
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden" style={{ display: rightTab === 'editor' ? 'flex' : 'none', flexDirection: 'column' }}>
              <MonacoEditor
                height="100%"
                language={lang}
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
              <div className="flex-1 overflow-y-auto bg-[#0a0a12] p-5 space-y-3">
                {running && (
                  <div className="flex items-center gap-2 text-sm text-neutral-400 py-10 justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
                    <span>Đang chạy code…</span>
                  </div>
                )}
                {!running && results === null && (
                  <div className="flex flex-col items-center gap-3 py-14 text-center">
                    <div className="h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center">
                      <Play className="h-6 w-6 text-neutral-500" />
                    </div>
                    <p className="text-xs text-neutral-500">Nhấn <strong className="text-neutral-300">Chạy thử</strong> để kiểm tra code của bạn</p>
                  </div>
                )}
                {!running && results !== null && (
                  <>
                    {allPassed ? (
                      <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-3 flex items-center gap-3 mb-4">
                        <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-300">Tất cả test case đều đúng! 🎉</span>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 flex items-center gap-3 mb-4">
                        <XCircle className="h-5 w-5 text-red-400" />
                        <span className="text-sm font-semibold text-red-300">{passedCount}/{results.length} test case đúng</span>
                      </div>
                    )}
                    {results.map((r, i) => (
                      <div key={i} className={`rounded-xl border p-4 ${r.passed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                          {r.passed
                            ? <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                            : <XCircle className="h-4 w-4 text-red-400 flex-shrink-0" />
                          }
                          <span className={`text-xs font-semibold tracking-wide ${r.passed ? 'text-emerald-300' : 'text-red-300'}`}>
                            Test {i + 1}: {r.passed ? 'Đúng ✓' : 'Sai ✗'} — {r.description}
                          </span>
                        </div>
                        {!r.passed && (
                          <div className="space-y-1.5 font-mono text-xs pl-6 text-neutral-400">
                            <div>Input: <span className="text-neutral-200">{r.case}</span></div>
                            <div>Kỳ vọng: <span className="text-emerald-300">{r.expected}</span></div>
                            <div>Nhận được: <span className="text-red-300">{r.actual}</span></div>
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
      </div>
    </>
  )
}
