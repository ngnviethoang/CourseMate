'use client'

import { use } from 'react'
import Link from 'next/link'
import { Code2 } from 'lucide-react'
import { ExerciseEditorModal, type ExerciseData } from '@/components/exercises/exercise-editor-modal'

// ─── Mock data (same as exercises list fallback) ──────────────────────────────

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
      python: `class Solution:\n    def twoSum(self, nums: list[int], target: int) -> list[int]:\n        pass`,
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        return new int[]{};\n    }\n}`
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
    examples: [{ input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]' }],
    constraints: ['1 ≤ s.length ≤ 10⁵'],
    hints: ['Dùng hai con trỏ: một từ đầu, một từ cuối, swap rồi tiến vào giữa.'],
    defaultCode: {
      javascript: `function reverseString(s) {\n    // Viết code của bạn ở đây\n    \n}`,
      python: `class Solution:\n    def reverseString(self, s: list[str]) -> None:\n        pass`,
      java: `class Solution {\n    public void reverseString(char[] s) {\n    }\n}`
    },
    testCases: [
      { input: '["h","e","l","l","o"]', expectedOutput: '["o","l","l","e","h"]', description: 'Chuỗi 5 ký tự' }
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
    hints: ['Sử dụng hàng đợi (Queue) để duyệt BFS.', 'Tại mỗi tầng, xử lý tất cả các nút hiện có trong queue.'],
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

// ─── Page (direct URL access) ─────────────────────────────────────────────────

export default function ExerciseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const exercise = EXERCISES_DATA[id]

  if (!exercise) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center h-screen gap-4 bg-[#0f0f14]">
        <Code2 className="h-12 w-12 text-neutral-500" />
        <p className="text-neutral-400">Không tìm thấy bài tập.</p>
        <Link href="/exercises" className="text-sm text-blue-400 hover:underline">← Quay lại danh sách</Link>
      </div>
    )
  }

  return (
    // full-screen overlay, no modal controls (isModal=false means no close button, link-based back)
    <div className="fixed inset-0 z-50">
      <ExerciseEditorModal exercise={exercise} isModal={false} />
    </div>
  )
}
