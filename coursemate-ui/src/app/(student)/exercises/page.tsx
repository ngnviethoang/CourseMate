'use client'

import { useState, useEffect } from 'react'
import { Code2, CheckCircle2, ChevronRight, Filter, Zap } from 'lucide-react'
import { ExerciseEditorModal, type ExerciseData, type Difficulty, DIFF_STYLE } from '@/components/exercises/exercise-editor-modal'

// ─── Mock data ────────────────────────────────────────────────────────────────

type Category = 'Array' | 'String' | 'Tree' | 'DP' | 'Graph' | 'Sorting' | 'HashTable'

interface ExerciseRow {
  id: string; title: string; difficulty: Difficulty; category: Category
  isSolved: boolean; acceptRate: number; description: string
}

const EXERCISES: ExerciseRow[] = [
  { id: 'ex1', title: 'Tổng hai số (Two Sum)', difficulty: 'Dễ', category: 'Array', isSolved: true, acceptRate: 82, description: 'Cho một mảng số nguyên và một target, trả về chỉ số của hai số có tổng bằng target.' },
  { id: 'ex2', title: 'Đảo ngược chuỗi (Reverse String)', difficulty: 'Dễ', category: 'String', isSolved: true, acceptRate: 91, description: 'Đảo ngược một chuỗi ký tự mà không sử dụng hàm built-in.' },
  { id: 'ex3', title: 'Số Fibonacci thứ N', difficulty: 'Dễ', category: 'DP', isSolved: false, acceptRate: 75, description: 'Tính số Fibonacci thứ N với độ phức tạp O(n) hoặc O(log n).' },
  { id: 'ex4', title: 'Hợp nhất hai danh sách liên kết', difficulty: 'Dễ', category: 'Tree', isSolved: true, acceptRate: 67, description: 'Hợp nhất hai danh sách liên kết đã được sắp xếp.' },
  { id: 'ex5', title: 'Duyệt cây nhị phân theo tầng (BFS)', difficulty: 'Trung bình', category: 'Tree', isSolved: false, acceptRate: 58, description: 'Duyệt cây nhị phân theo chiều rộng và trả về các nút theo từng tầng.' },
  { id: 'ex6', title: 'Tìm phần tử xuất hiện nhiều nhất', difficulty: 'Trung bình', category: 'HashTable', isSolved: false, acceptRate: 64, description: 'Tìm phần tử xuất hiện nhiều hơn n/2 lần.' },
  { id: 'ex7', title: 'Số đảo ngược (Palindrome Number)', difficulty: 'Trung bình', category: 'Array', isSolved: false, acceptRate: 52, description: 'Kiểm tra xem một số nguyên có phải palindrome hay không.' },
  { id: 'ex8', title: 'Sắp xếp mảng (Quick Sort)', difficulty: 'Trung bình', category: 'Sorting', isSolved: true, acceptRate: 71, description: 'Cài đặt Quick Sort từ đầu không dùng thư viện sort có sẵn.' },
  { id: 'ex9', title: 'Tìm đường đi ngắn nhất (Dijkstra)', difficulty: 'Khó', category: 'Graph', isSolved: false, acceptRate: 38, description: 'Tìm đường đi ngắn nhất từ đỉnh nguồn đến tất cả các đỉnh còn lại.' },
  { id: 'ex10', title: 'Bài toán người bán hàng rong (TSP)', difficulty: 'Khó', category: 'DP', isSolved: false, acceptRate: 21, description: 'Tìm hành trình ngắn nhất đi qua tất cả các thành phố đúng một lần.' },
  { id: 'ex11', title: 'Tìm số nguyên tố trong khoảng (Sieve)', difficulty: 'Trung bình', category: 'Array', isSolved: false, acceptRate: 69, description: 'Liệt kê tất cả số nguyên tố trong khoảng [2, n].' },
  { id: 'ex12', title: 'Kiểm tra đồ thị có chu trình không', difficulty: 'Khó', category: 'Graph', isSolved: false, acceptRate: 44, description: 'Kiểm tra xem đồ thị có hướng có chu trình hay không bằng DFS.' }
]

const DIFF_LIST_COLOR: Record<Difficulty, string> = {
  'Dễ': 'text-emerald-600', 'Trung bình': 'text-amber-600', 'Khó': 'text-red-600'
}

const CATEGORIES: Array<Category | 'Tất cả'> = ['Tất cả', 'Array', 'String', 'Tree', 'DP', 'Graph', 'Sorting', 'HashTable']

// ─── Full exercise data (for modal) ──────────────────────────────────────────

const EXERCISES_DATA: Record<string, ExerciseData> = {
  ex1: {
    id: 'ex1', title: 'Tổng hai số (Two Sum)', difficulty: 'Dễ', category: 'Array',
    description: 'Cho một mảng số nguyên `nums` và một số nguyên `target`, hãy trả về **chỉ số** (index) của hai số trong mảng có tổng bằng `target`.\n\nBạn có thể giả định rằng mỗi đầu vào sẽ có **đúng một** nghiệm duy nhất, và bạn không được dùng cùng một phần tử hai lần.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] = 2 + 7 = 9' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]' },
      { input: 'nums = [3,3], target = 6', output: '[0,1]' }
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', '-10⁹ ≤ target ≤ 10⁹', 'Chỉ có đúng một nghiệm'],
    hints: ['Dùng HashMap để lưu các phần tử đã duyệt qua.', 'Với mỗi phần tử x, kiểm tra xem (target - x) đã tồn tại trong map chưa.'],
    defaultCode: {
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    // Viết code của bạn ở đây\n    \n}`,
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        # Viết code của bạn ở đây\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Viết code của bạn ở đây\n        return new int[]{};\n    }\n}`
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]', description: 'Test cơ bản' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]', description: 'Không phải hai phần tử đầu' },
      { input: '[3,3], 6', expectedOutput: '[0,1]', description: 'Hai phần tử giống nhau' }
    ]
  },
  ex2: {
    id: 'ex2', title: 'Đảo ngược chuỗi (Reverse String)', difficulty: 'Dễ', category: 'String',
    description: 'Viết hàm đảo ngược chuỗi ký tự. Input là một mảng ký tự `s`. Bạn phải thực hiện đảo ngược **in-place** với O(1) extra memory.',
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }, { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]' }],
    constraints: ['1 ≤ s.length ≤ 10⁵', 's[i] là ký tự ASCII có thể in được'],
    hints: ['Dùng hai con trỏ: một từ đầu, một từ cuối, swap rồi tiến vào giữa.'],
    defaultCode: {
      javascript: `function reverseString(s) {\n    // Viết code của bạn ở đây\n    \n}`,
      python: `class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        pass`,
      java: `class Solution {\n    public void reverseString(char[] s) {\n    }\n}`
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', description: 'Chuỗi 5 ký tự' },
      { input: '["H","a","n","n","a","h"]', expectedOutput: '["h","a","n","n","a","H"]', description: 'Palindrome' }
    ]
  },
  ex5: {
    id: 'ex5', title: 'Duyệt cây nhị phân theo tầng (BFS)', difficulty: 'Trung bình', category: 'Tree',
    description: 'Cho một cây nhị phân, hãy trả về **danh sách các nút** theo từng tầng (từ trái sang phải, tầng trên xuống tầng dưới).',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'Tầng 1: [3], Tầng 2: [9,20], Tầng 3: [15,7]' },
      { input: 'root = [1]', output: '[[1]]' }, { input: 'root = []', output: '[]' }
    ],
    constraints: ['0 ≤ số nút ≤ 2000', '-1000 ≤ Node.val ≤ 1000'],
    hints: ['Sử dụng hàng đợi (Queue) để duyệt BFS.', 'Tại mỗi tầng, xử lý tất cả các nút hiện có trong queue trước khi sang tầng tiếp theo.'],
    defaultCode: {
      javascript: `function levelOrder(root) {\n    // Viết code của bạn ở đây\n    \n}`,
      python: `from collections import deque\n\nclass Solution:\n    def levelOrder(self, root) -> list[list[int]]:\n        pass`,
      java: `class Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}`
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]', description: 'Cây 3 tầng' },
      { input: '[1]', expectedOutput: '[[1]]', description: 'Chỉ root' },
      { input: '[]', expectedOutput: '[]', description: 'Cây rỗng' }
    ]
  }
}

// fallback cho bài chưa có data đầy đủ
function getExerciseData(row: ExerciseRow): ExerciseData {
  return EXERCISES_DATA[row.id] ?? {
    id: row.id, title: row.title, difficulty: row.difficulty, category: row.category,
    description: row.description,
    examples: [{ input: 'Đang cập nhật...', output: '...' }],
    constraints: ['Đang cập nhật...'],
    hints: ['Đang cập nhật...'],
    defaultCode: {
      javascript: `// ${row.title}\nfunction solve() {\n    // Viết code của bạn ở đây\n    \n}`,
      python: `# ${row.title}\ndef solve():\n    pass`,
      java: `// ${row.title}\nclass Solution {\n    public void solve() {\n    }\n}`
    },
    testCases: [{ input: '...', expectedOutput: '...', description: 'Test cơ bản' }]
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ExercisesPage() {
  const [diffFilter, setDiffFilter] = useState<Difficulty | 'Tất cả'>('Tất cả')
  const [catFilter, setCatFilter] = useState<Category | 'Tất cả'>('Tất cả')
  const [showSolved, setShowSolved] = useState(true)

  // Modal state
  const [activeExercise, setActiveExercise] = useState<ExerciseData | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [clickedId, setClickedId] = useState<string | null>(null)

  const filtered = EXERCISES.filter(ex => {
    if (diffFilter !== 'Tất cả' && ex.difficulty !== diffFilter) return false
    if (catFilter !== 'Tất cả' && ex.category !== catFilter) return false
    if (!showSolved && ex.isSolved) return false
    return true
  })
  const solvedCount = EXERCISES.filter(e => e.isSolved).length

  const openExercise = (row: ExerciseRow) => {
    setClickedId(row.id)
    // Brief flash delay, then open modal
    setTimeout(() => {
      setActiveExercise(getExerciseData(row))
      window.history.pushState(null, '', `/exercises/${row.id}`)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setModalVisible(true))
      })
      setClickedId(null)
    }, 220)
  }

  const closeModal = () => {
    setModalVisible(false)
    // Wait for exit animation, then unmount + restore URL
    setTimeout(() => {
      setActiveExercise(null)
      window.history.pushState(null, '', '/exercises')
    }, 300)
  }

  // lock body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = activeExercise ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
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
            <p className="text-sm text-muted-foreground mt-1">Luyện tập các bài toán từ dễ đến khó. Hoàn toàn miễn phí.</p>

            {/* Progress */}
            <div className="mt-5 flex items-center gap-4 max-w-sm">
              <div className="flex-1">
                <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                  <span>Tiến độ</span>
                  <span className="font-medium text-foreground">{solvedCount}/{EXERCISES.length} bài</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(solvedCount / EXERCISES.length) * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-1 text-primary">
                <Zap className="h-4 w-4 fill-primary" />
                <span className="text-sm font-bold">{Math.round((solvedCount / EXERCISES.length) * 100)}%</span>
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
                <button key={d} onClick={() => setDiffFilter(d)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors border ${diffFilter === d ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-muted text-muted-foreground hover:text-foreground'
                    }`}>
                  {d}
                </button>
              ))}
            </div>
            <button onClick={() => setShowSolved(v => !v)}
              className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${!showSolved ? 'border-primary bg-primary/10 text-primary' : 'border-transparent bg-muted text-muted-foreground hover:text-foreground'
                }`}>
              {showSolved ? 'Ẩn bài đã làm' : 'Hiện bài đã làm'}
            </button>
          </div>

          {/* Category pills */}
          <div className="flex gap-1.5 flex-wrap mb-6">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCatFilter(cat as typeof catFilter)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${catFilter === cat ? 'bg-foreground text-background' : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}>
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
                  {ex.isSolved && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors line-clamp-1">{ex.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1 hidden sm:block">{ex.description}</p>
                </div>
                <span className="hidden md:block flex-shrink-0 rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground">{ex.category}</span>
                <span className="hidden sm:block flex-shrink-0 text-xs text-muted-foreground w-14 text-right">{ex.acceptRate}%</span>
                <span className={`flex-shrink-0 text-xs font-semibold w-20 text-right ${DIFF_LIST_COLOR[ex.difficulty]}`}>{ex.difficulty}</span>
                <ChevronRight className="flex-shrink-0 h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="py-16 text-center text-sm text-muted-foreground">Không có bài tập nào phù hợp với bộ lọc.</div>
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
          />
        </div>
      )}
    </>
  )
}
