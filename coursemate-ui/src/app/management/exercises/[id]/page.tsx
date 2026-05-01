'use client'

import { useState, useEffect, use } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { toast } from 'sonner'
import {
  Save, Loader2, Plus, Trash2, Eye, EyeOff,
  GripVertical, ArrowLeft, Code2, FlaskConical, Info, Pencil
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { exerciseService } from '@/lib/exercise-service'

const MonacoEditor = dynamic(() => import('@monaco-editor/react'), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin mr-2" />Đang tải editor…</div>
})

// ─── Types ─────────────────────────────────────────────────────────────────────

interface TestCase {
  id?: string
  input: string
  expectedOutput: string
  description: string
  isHidden: boolean
  order: number
}

interface DefaultCode {
  id?: string
  language: string
  starterCode: string
}

interface Example {
  input: string
  output: string
  explanation?: string
}

interface ExerciseForm {
  title: string
  description: string
  difficulty: string
  category: string
  examples: Example[]
  constraints: string[]
  hints: string[]
  testCases: TestCase[]
  defaultCodes: DefaultCode[]
}

const LANGUAGES = [
  { id: 'python-3.14', label: 'Python 3.14', monaco: 'python' },
  { id: 'g++-15', label: 'C++ (G++ 15)', monaco: 'cpp' },
  { id: 'gcc-15', label: 'C (Gcc 15)', monaco: 'cpp' },
  { id: 'openjdk-25', label: 'Java (Openjdk 25)', monaco: 'java' },
  { id: 'dotnet-csharp-9', label: 'C# (Dotnet 9)', monaco: 'csharp' },
  { id: 'go-1.26', label: 'Go 1.26', monaco: 'go' },
  { id: 'rust-1.93', label: 'Rust 1.93', monaco: 'rust' },
  { id: 'typescript-deno', label: 'TypeScript (Deno)', monaco: 'typescript' },
  { id: 'php-8.5', label: 'PHP 8.5', monaco: 'php' },
  { id: 'ruby-4.0', label: 'Ruby 4.0', monaco: 'ruby' },
  { id: 'dotnet-fsharp-9', label: 'F# (Dotnet 9)', monaco: 'fsharp' },
  { id: 'haskell-9.12', label: 'Haskell 9.12', monaco: 'haskell' }
]

const TEMPLATES: Record<string, string> = {
  'python-3.14': 'import sys\n\ndef solve():\n    # Đọc dữ liệu từ stdin\n    # input_data = sys.stdin.read().split()\n    \n    print("Hello from Python")\n\nif __name__ == "__main__":\n    solve()',
  'g++-15': '#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nint main() {\n    // Giải quyết bài toán tại đây\n    \n    return 0;\n}',
  'gcc-15': '#include <stdio.h>\n\nint main() {\n    // Giải quyết bài toán tại đây\n    \n    return 0;\n}',
  'openjdk-25': 'import java.util.*;\n\npublic class Solution {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Code của bạn\n    }\n}',
  'dotnet-csharp-9': 'using System;\n\nclass Program {\n    static void Main() {\n        // Đọc dữ liệu\n        // string line = Console.ReadLine();\n        \n        Console.WriteLine("Hello C#");\n    }\n}',
  'go-1.26': 'package main\n\nimport "fmt"\n\nfunc main() {\n    var input string\n    fmt.Scanln(&input)\n    fmt.Println("Hello Go")\n}',
  'rust-1.93': 'use std::io;\n\nfn main() {\n    let mut input = String::new();\n    io::stdin().read_line(&mut input).unwrap();\n    println!("Hello Rust");\n}',
  'typescript-deno': 'const input = new TextDecoder().decode(await Deno.readAll(Deno.stdin));\nconsole.log("Hello TypeScript");',
  'php-8.5': '<?php\n\n$stdin = fopen(\'php://stdin\', \'r\');\n// $line = fgets($stdin);\n\necho "Hello PHP";',
  'ruby-4.0': 'input = gets\nputs "Hello Ruby"',
  'dotnet-fsharp-9': 'open System\n\n[<EntryPoint>]\nlet main argv = \n    printfn "Hello F#"\n    0',
  'haskell-9.12': 'main :: IO ()\nmain = do\n    input <- getLine\n    putStrLn "Hello Haskell"'
}

const EMPTY_FORM: ExerciseForm = {
  title: '',
  description: '',
  difficulty: 'Easy',
  category: '',
  examples: [],
  constraints: [],
  hints: [],
  testCases: [],
  defaultCodes: []
}

type Tab = 'info' | 'examples' | 'constraints' | 'hints' | 'testcases' | 'code'

// ─── Page ───────────────────────────────────────────────────────────────────────

export default function ExerciseFormPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const isNew = id === 'new'
  const router = useRouter()

  const [form, setForm] = useState<ExerciseForm>(EMPTY_FORM)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('info')
  const [activeLang, setActiveLang] = useState('python-3.14')

  const [editMode, setEditMode] = useState<Record<string, boolean>>({
    examples: false,
    constraints: false,
    hints: false
  })
  const toggleEditMode = (tab: string) => setEditMode(prev => ({ ...prev, [tab]: !prev[tab] }))

  const [editModeTestCases, setEditModeTestCases] = useState<Record<number, boolean>>({})
  const toggleTestCaseEditMode = (idx: number, state?: boolean) => {
    setEditModeTestCases(prev => ({
      ...prev,
      [idx]: state !== undefined ? state : !prev[idx]
    }))
  }

  // Load existing exercise
  useEffect(() => {
    if (isNew) return
    setLoading(true)
    exerciseService.getById(id)
      .then(data => setForm({
        title: data.title,
        description: data.description,
        difficulty: data.difficulty,
        category: data.category,
        examples: data.examples || [],
        constraints: data.constraints || [],
        hints: data.hints || [],
        testCases: data.testCases.map((tc: any) => ({
          id: tc.id,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          description: tc.description,
          isHidden: tc.isHidden,
          order: tc.order
        })),
        defaultCodes: data.defaultCodes.map((dc: any) => ({
          id: dc.id,
          language: dc.language,
          starterCode: dc.starterCode
        }))
      }))
      .catch(() => toast.error('Không thể tải bài tập'))
      .finally(() => setLoading(false))
  }, [id, isNew])

  // ─ Handlers ─

  const updateForm = (patch: Partial<ExerciseForm>) => setForm(f => ({ ...f, ...patch }))

  // Examples
  const addExample = () => updateForm({ examples: [...form.examples, { input: '', output: '', explanation: '' }] })
  const updateExample = (idx: number, patch: Partial<Example>) => updateForm({
    examples: form.examples.map((ex, i) => i === idx ? { ...ex, ...patch } : ex)
  })
  const removeExample = (idx: number) => updateForm({ examples: form.examples.filter((_, i) => i !== idx) })

  // Constraints & Hints
  const addItem = (field: 'constraints' | 'hints') => updateForm({ [field]: [...form[field], ''] })
  const updateItem = (field: 'constraints' | 'hints', idx: number, val: string) => updateForm({
    [field]: form[field].map((v, i) => i === idx ? val : v)
  })
  const removeItem = (field: 'constraints' | 'hints', idx: number) => updateForm({ [field]: form[field].filter((_, i) => i !== idx) })

  const addTestCase = () => {
    const newIdx = form.testCases.length
    setForm(f => ({
      ...f,
      testCases: [...f.testCases, { input: '', expectedOutput: '', description: `Test case ${newIdx + 1}`, isHidden: false, order: newIdx }]
    }))
    toggleTestCaseEditMode(newIdx, true)
  }

  const removeTestCase = (idx: number) => setForm(f => ({
    ...f,
    testCases: f.testCases.filter((_, i) => i !== idx).map((tc, i) => ({ ...tc, order: i }))
  }))

  const updateTestCase = (idx: number, patch: Partial<TestCase>) => setForm(f => ({
    ...f,
    testCases: f.testCases.map((tc, i) => i === idx ? { ...tc, ...patch } : tc)
  }))

  const getDefaultCode = (lang: string) => {
    const existing = form.defaultCodes.find(d => d.language === lang)?.starterCode
    return existing ?? TEMPLATES[lang] ?? ''
  }

  const setDefaultCode = (lang: string, code: string) => setForm(f => {
    const exists = f.defaultCodes.find(d => d.language === lang)
    if (exists) return { ...f, defaultCodes: f.defaultCodes.map(d => d.language === lang ? { ...d, starterCode: code } : d) }
    return { ...f, defaultCodes: [...f.defaultCodes, { language: lang, starterCode: code }] }
  })

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error('Tiêu đề không được để trống'); return }
    setSaving(true)
    try {
      if (isNew) {
        const res = await exerciseService.create(form)
        toast.success('Tạo bài tập thành công! Bây giờ bạn có thể thêm Test Cases.')
        router.push(`/management/exercises/${res}`)
      } else {
        await exerciseService.update({ ...form, id })
        toast.success('Cập nhật thành công!')
        router.refresh()
      }
    } catch {
      toast.error('Lưu thất bại, vui lòng thử lại')
    } finally {
      setSaving(false)
    }
  }

  const saveTestCase = async (idx: number) => {
    const tc = form.testCases[idx]
    try {
      if (tc.id) {
        await exerciseService.updateTestCase(id as string, tc.id, tc)
        toast.success(`Đã cập nhật Test case #${idx + 1}`)
      } else {
        const res = await exerciseService.addTestCase(id as string, tc)
        updateTestCase(idx, { id: res.id || res })
        toast.success(`Đã thêm Test case #${idx + 1}`)
      }
      toggleTestCaseEditMode(idx, false)
    } catch {
      toast.error('Lưu test case thất bại')
    }
  }

  const saveDefaultCode = async () => {
    const code = getDefaultCode(activeLang)
    try {
      await exerciseService.upsertDefaultCode(id as string, {
        language: activeLang,
        starterCode: code
      })
      toast.success(`Đã cập nhật code mẫu cho ${activeLang}`)
    } catch {
      toast.error('Lưu code mẫu thất bại')
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-32"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
  }

  // ─── UI ────────────────────────────────────────────────────────────────────────

  const tabs: { key: Tab; label: string; icon: React.ReactNode; disabled?: boolean }[] = [
    { key: 'info', label: '1. Thông tin cơ bản', icon: <Info className="h-4 w-4" /> },
    { key: 'examples', label: '2. Ví dụ', icon: <Plus className="h-4 w-4" /> },
    { key: 'constraints', label: '3. Ràng buộc', icon: <Plus className="h-4 w-4" /> },
    { key: 'hints', label: '4. Gợi ý', icon: <Plus className="h-4 w-4" /> },
    {
      key: 'testcases',
      label: `5. Test Cases (${form.testCases.length})`,
      icon: <FlaskConical className="h-4 w-4" />,
      disabled: isNew
    },
    {
      key: 'code',
      label: '6. Code mẫu',
      icon: <Code2 className="h-4 w-4" />,
      disabled: isNew
    }
  ]

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-xl font-bold">{isNew ? 'Tạo bài tập mới' : `Chỉnh sửa: ${form.title || '...'}`}</h1>
          <p className="text-sm text-muted-foreground">Điền đầy đủ thông tin bên dưới rồi nhấn Lưu</p>
        </div>
        <Button onClick={handleSave} disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {saving ? 'Đang lưu…' : 'Lưu bài tập'}
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex gap-0">
          {tabs.map(t => (
            <button
              key={t.key}
              disabled={t.disabled}
              onClick={() => setActiveTab(t.key)}
              className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors -mb-px ${t.disabled ? 'opacity-40 cursor-not-allowed' :
                activeTab === t.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
            >
              {t.icon}{t.label}
              {t.disabled && <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded ml-1">Khoá</span>}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab 1: Thông tin cơ bản ─── */}
      {activeTab === 'info' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Tiêu đề <span className="text-red-500">*</span></label>
              <input
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Ví dụ: Tính tổng A + B"
                className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Mô tả bài tập <span className="text-red-500">*</span></label>
              <p className="text-xs text-muted-foreground">
                Hỗ trợ Markdown. Mô tả yêu cầu, ví dụ, ràng buộc và hướng dẫn giải.
              </p>
              <textarea
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                rows={12}
                placeholder={`## Mô tả\nCho hai số nguyên a và b...\n\n## Ví dụ\n**Input:** 5 3\n**Output:** 8\n\n**Hướng dẫn học:** Dùng toán tử +`}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Độ khó</label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map(d => (
                  <button
                    key={d}
                    onClick={() => setForm(f => ({ ...f, difficulty: d }))}
                    className={`py-2 rounded-lg text-xs font-semibold border transition-all ${form.difficulty === d
                      ? d === 'Easy' ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/50'
                        : d === 'Medium' ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/50'
                          : 'border-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/50'
                      : 'border-border text-muted-foreground hover:text-foreground'
                      }`}
                  >
                    {d === 'Easy' ? 'Dễ' : d === 'Medium' ? 'Trung bình' : 'Khó'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Danh mục</label>
              <input
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                list="category-list"
                placeholder="Array, String, Tree..."
                className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
              />
              <datalist id="category-list">
                {['Array', 'String', 'Tree', 'Graph', 'DP', 'Math', 'Sorting', 'HashTable', 'Cơ bản'].map(c => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </div>

            {/* Summary card */}
            <div className="rounded-xl border bg-muted/30 p-4 space-y-2 text-sm">
              <p className="font-medium text-xs uppercase tracking-widest text-muted-foreground">Tóm tắt</p>
              <div className="flex justify-between"><span className="text-muted-foreground">Độ khó</span><span className="font-medium">{form.difficulty === 'Easy' ? 'Dễ' : form.difficulty === 'Medium' ? 'Trung bình' : 'Khó'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Test Cases</span><span className="font-medium">{form.testCases.length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Test ẩn</span><span className="font-medium">{form.testCases.filter(t => t.isHidden).length}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Ngôn ngữ</span><span className="font-medium">{form.defaultCodes.length}</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Tab: Ví dụ ─── */}
      {activeTab === 'examples' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Các ví dụ minh họa giúp học sinh hiểu đề bài nhanh hơn.</p>
            {editMode['examples'] ? (
              <Button size="sm" variant="outline" onClick={addExample} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Thêm ví dụ
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => toggleEditMode('examples')} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
              </Button>
            )}
          </div>
          <div className="space-y-4">
            {form.examples.map((ex, idx) => (
              <div key={idx} className="p-4 border rounded-xl bg-card space-y-3 relative group">
                {editMode['examples'] && (
                  <button onClick={() => removeExample(idx)} className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Input</label>
                    {editMode['examples'] ? (
                      <textarea
                        value={ex.input}
                        onChange={e => updateExample(idx, { input: e.target.value })}
                        className="w-full border rounded-md p-2 text-sm font-mono bg-background resize-none"
                        rows={2}
                      />
                    ) : (
                      <pre className="w-full border rounded-md p-2 text-sm font-mono bg-muted/30 whitespace-pre-wrap">{ex.input}</pre>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase text-muted-foreground">Output</label>
                    {editMode['examples'] ? (
                      <textarea
                        value={ex.output}
                        onChange={e => updateExample(idx, { output: e.target.value })}
                        className="w-full border rounded-md p-2 text-sm font-mono bg-background resize-none"
                        rows={2}
                      />
                    ) : (
                      <pre className="w-full border rounded-md p-2 text-sm font-mono bg-muted/30 whitespace-pre-wrap">{ex.output}</pre>
                    )}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-muted-foreground">Giải thích (Dành cho học sinh)</label>
                  {editMode['examples'] ? (
                    <input
                      value={ex.explanation}
                      onChange={e => updateExample(idx, { explanation: e.target.value })}
                      className="w-full border rounded-md p-2 text-sm bg-background"
                      placeholder="Ví dụ: Vì n=5 là số lẻ nên kết quả là NO..."
                    />
                  ) : (
                    <p className="text-sm bg-muted/10 p-2 rounded-md border border-transparent">{ex.explanation || <span className="text-muted-foreground italic">Không có giải thích</span>}</p>
                  )}
                </div>
              </div>
            ))}
            {form.examples.length === 0 && (
              <div className="py-12 text-center border border-dashed rounded-xl text-muted-foreground italic text-sm">
                Chưa có ví dụ nào. {editMode['examples'] ? 'Nhấn "Thêm ví dụ" để bắt đầu.' : 'Nhấn "Chỉnh sửa" để thêm.'}
              </div>
            )}
          </div>
          {editMode['examples'] && (
            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => toggleEditMode('examples')}>Hủy</Button>
              <Button onClick={async () => { await handleSave(); toggleEditMode('examples'); }} disabled={saving} className="gap-2 px-8">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Lưu thay đổi Ví dụ
              </Button>
            </div>
          )}
        </div>
      )}

      {/* ─── Tab: Ràng buộc & Gợi ý ─── */}
      {(['constraints', 'hints'] as const).map(tab => activeTab === tab && (
        <div key={tab} className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {tab === 'constraints' ? 'Các giới hạn về thời gian, bộ nhớ hoặc giá trị đầu vào.' : 'Các mẹo nhỏ giúp học sinh khi gặp khó khăn.'}
            </p>
            {editMode[tab] ? (
              <Button size="sm" variant="outline" onClick={() => addItem(tab)} className="gap-1.5">
                <Plus className="h-3.5 w-3.5" /> Thêm {tab === 'constraints' ? 'ràng buộc' : 'gợi ý'}
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={() => toggleEditMode(tab)} className="gap-1.5">
                <Pencil className="h-3.5 w-3.5" /> Chỉnh sửa
              </Button>
            )}
          </div>
          <div className="space-y-2">
            {form[tab].map((item, idx) => (
              <div key={idx} className="flex gap-2">
                {editMode[tab] ? (
                  <>
                    <input
                      value={item}
                      onChange={e => updateItem(tab, idx, e.target.value)}
                      className="flex-1 border rounded-md px-3 py-2 text-sm bg-background"
                      placeholder={tab === 'constraints' ? '1 <= n <= 10^5' : 'Hãy sử dụng thuật toán Sàng Eratosthenes...'}
                    />
                    <Button size="icon" variant="ghost" onClick={() => removeItem(tab, idx)} className="text-red-500 h-9 w-9">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <div className="flex-1 border rounded-md px-3 py-2 text-sm bg-muted/30">
                    {item}
                  </div>
                )}
              </div>
            ))}
            {form[tab].length === 0 && (
              <div className="py-12 text-center border border-dashed rounded-xl text-muted-foreground italic text-sm">
                Chưa có {tab === 'constraints' ? 'ràng buộc' : 'gợi ý'} nào.
              </div>
            )}
          </div>
          {editMode[tab] && (
            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => toggleEditMode(tab)}>Hủy</Button>
              <Button onClick={async () => { await handleSave(); toggleEditMode(tab); }} disabled={saving} className="gap-2 px-8">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                Lưu thay đổi {tab === 'constraints' ? 'Ràng buộc' : 'Gợi ý'}
              </Button>
            </div>
          )}
        </div>
      ))}

      {/* ─── Tab 2: Test Cases ─── */}
      {activeTab === 'testcases' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Thêm các test case để kiểm tra bài làm của học sinh. Test case <strong>ẩn</strong> sẽ không hiện cho học sinh thấy input/output.
            </p>
            <Button size="sm" onClick={addTestCase} className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Thêm Test Case
            </Button>
          </div>

          {form.testCases.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border rounded-xl border-dashed">
              <FlaskConical className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Chưa có test case. Nhấn <strong>Thêm Test Case</strong> để bắt đầu.</p>
            </div>
          )}

          <div className="space-y-3">
            {form.testCases.map((tc, idx) => (
              <div key={idx} className={`rounded-xl border p-4 space-y-3 ${tc.isHidden ? 'border-amber-300/50 bg-amber-50/30 dark:bg-amber-500/5' : 'bg-card'}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                    <span className="text-sm font-semibold">Test case #{idx + 1}</span>
                    {tc.isHidden && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400 font-medium">Ẩn</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {(editModeTestCases[idx] || !tc.id) ? (
                      <>
                        {tc.id && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 gap-1.5 text-xs text-muted-foreground"
                            onClick={() => toggleTestCaseEditMode(idx, false)}
                          >
                            Hủy
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 gap-1.5 text-xs text-primary bg-primary/5 hover:bg-primary/10 border-primary/20"
                          onClick={() => saveTestCase(idx)}
                        >
                          <Save className="h-3 w-3" />
                          Lưu
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1.5 text-xs text-muted-foreground"
                        onClick={() => toggleTestCaseEditMode(idx, true)}
                      >
                        <Pencil className="h-3 w-3" />
                        Sửa
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      className={`h-7 gap-1.5 text-xs ${tc.isHidden ? 'text-amber-600' : 'text-muted-foreground'}`}
                      onClick={() => updateTestCase(idx, { isHidden: !tc.isHidden })}
                    >
                      {tc.isHidden ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      {tc.isHidden ? 'Ẩn' : 'Hiện'}
                    </Button>
                    <Button size="icon" variant="ghost" className="h-7 w-7 text-red-500 hover:bg-red-50" onClick={() => removeTestCase(idx)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Input (stdin)</label>
                    {(editModeTestCases[idx] || !tc.id) ? (
                      <textarea
                        value={tc.input}
                        onChange={e => updateTestCase(idx, { input: e.target.value })}
                        rows={3}
                        placeholder="5 3"
                        className="w-full border border-input rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                      />
                    ) : (
                      <pre className="w-full border border-input rounded-lg px-3 py-2 text-xs font-mono bg-muted/30 whitespace-pre-wrap min-h-[74px]">{tc.input || <span className="italic text-muted-foreground">Trống</span>}</pre>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Expected Output</label>
                    {(editModeTestCases[idx] || !tc.id) ? (
                      <textarea
                        value={tc.expectedOutput}
                        onChange={e => updateTestCase(idx, { expectedOutput: e.target.value })}
                        rows={3}
                        placeholder="8"
                        className="w-full border border-input rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                      />
                    ) : (
                      <pre className="w-full border border-input rounded-lg px-3 py-2 text-xs font-mono bg-muted/30 whitespace-pre-wrap min-h-[74px]">{tc.expectedOutput || <span className="italic text-muted-foreground">Trống</span>}</pre>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Mô tả</label>
                  {(editModeTestCases[idx] || !tc.id) ? (
                    <input
                      value={tc.description}
                      onChange={e => updateTestCase(idx, { description: e.target.value })}
                      placeholder="Ví dụ: Số dương cơ bản"
                      className="w-full border border-input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                    />
                  ) : (
                    <div className="w-full border border-transparent px-1 py-1.5 text-sm bg-transparent">
                      {tc.description || <span className="italic text-muted-foreground">Không có mô tả</span>}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tab 3: Code mẫu ─── */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Cung cấp code mẫu/starter code cho từng ngôn ngữ lập trình. Học sinh sẽ thấy code này khi mở bài tập.
          </p>

          <div className="flex gap-1 bg-muted/40 rounded-xl p-1 overflow-x-auto max-w-full">
            {LANGUAGES.map(lang => (
              <button
                key={lang.id}
                type="button"
                onClick={() => setActiveLang(lang.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${activeLang === lang.id ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          {/* Monaco editor */}
          <div className="rounded-xl border overflow-hidden" style={{ height: 480 }}>
            <MonacoEditor
              height="100%"
              language={LANGUAGES.find(l => l.id === activeLang)?.monaco ?? 'javascript'}
              value={getDefaultCode(activeLang)}
              onChange={v => setDefaultCode(activeLang, v ?? '')}
              theme="vs-dark"
              options={{
                fontSize: 13,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                tabSize: 2,
                wordWrap: 'on',
                padding: { top: 16, bottom: 16 },
                fontFamily: '"JetBrains Mono", "Fira Code", Consolas, monospace'
              }}
            />
          </div>

          <div className="flex justify-end">
            <Button size="sm" onClick={saveDefaultCode} className="gap-2">
              <Save className="h-4 w-4" /> Lưu code mẫu {activeLang}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground">
            💡 Bạn không cần điền tất cả ngôn ngữ. Chỉ điền những ngôn ngữ bạn muốn hỗ trợ.
          </p>
        </div>
      )}


    </div>
  )
}
