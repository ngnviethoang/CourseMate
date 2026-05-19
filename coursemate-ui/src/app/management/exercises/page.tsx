'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
  Eye,
  Loader2,
  Code2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { api } from '@/lib/api-client'
import { exerciseService } from '@/lib/exercise-service'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

interface ExerciseDto {
  id: string
  title: string
  description: string
  difficulty: 'Easy' | 'Medium' | 'Hard'
  category: string
  createdByName?: string
  testCaseCount: number
  creationTime: string
}

interface PagedDto<T> {
  items: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
}

const DIFF_STYLE: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
}

const DIFF_LABEL: Record<string, string> = { Easy: 'Dễ', Medium: 'Trung bình', Hard: 'Khó' }

export default function ExercisesManagementPage() {
  const router = useRouter()
  const [data, setData] = useState<PagedDto<ExerciseDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [page, setPage] = useState(1)
  const pageSize = 10

  // Create Modal State
  const [openNewModal, setOpenNewModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    category: '',
    examples: [],
    constraints: [],
    hints: [],
    testCases: [],
    defaultCodes: []
  })

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        pageIndex: String(page),
        pageSize: String(pageSize),
        ...(filter && { filter }),
        ...(difficulty && { difficulty })
      })
      const result = await api.get<PagedDto<ExerciseDto>>(`/api/exercises?${params}`)
      setData(result)
    } catch {
      toast.error('Không thể tải danh sách bài tập')
    } finally {
      setLoading(false)
    }
  }, [page, filter, difficulty])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleCreate = async () => {
    if (!newForm.title.trim()) {
      toast.error('Tiêu đề không được để trống')
      return
    }
    setCreating(true)
    try {
      const payload = {
        title: newForm.title,
        description: newForm.description,
        difficulty: newForm.difficulty,
        category: newForm.category,
        examples: [],
        constraints: [],
        hints: [],
        testCases: [],
        defaultCodes: []
      }
      const res = (await exerciseService.create(payload)) as any
      toast.success('Đã tạo bài tập! Tiếp tục thêm chi tiết.')
      setOpenNewModal(false)
      router.push(`/management/exercises/${res.id || res}`)
    } catch {
      toast.error('Tạo bài tập thất bại')
    } finally {
      setCreating(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Xoá bài tập "${title}" không thể hoàn tác. Tiếp tục?`)) return
    setDeletingId(id)
    try {
      await api.delete(`/api/exercises/${id}`)
      toast.success('Đã xoá bài tập')
      fetchData()
    } catch {
      toast.error('Xoá thất bại')
    } finally {
      setDeletingId(null)
    }
  }

  const totalPages = data ? Math.ceil(data.totalCount / pageSize) : 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Code2 className="h-6 w-6 text-primary" />
            Quản lý Bài tập
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Tạo và quản lý bài tập lập trình, test cases, code mẫu</p>
        </div>

        <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Thêm bài tập
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo bài tập mới</DialogTitle>
              <DialogDescription>Điền các thông tin cơ bản trước khi thêm test cases và code mẫu.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  value={newForm.title}
                  onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ví dụ: Tính tổng A + B"
                  className="w-full -input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Độ khó</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setNewForm(f => ({ ...f, difficulty: d }))}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${newForm.difficulty === d ? (d === 'Easy' ? '-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 dark:-emerald-500/50' : d === 'Medium' ? '-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 dark:-amber-500/50' : '-red-500 bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 dark:-red-500/50') : '-transparent text-muted-foreground hover:text-foreground'}`}
                    >
                      {d === 'Easy' ? 'Dễ' : d === 'Medium' ? 'Trung bình' : 'Khó'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Danh mục</label>
                <input
                  value={newForm.category}
                  onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}
                  list="category-list"
                  placeholder="Array, String, Tree..."
                  className="w-full -input rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background"
                />
                <datalist id="category-list">
                  {['Array', 'String', 'Tree', 'Graph', 'DP', 'Math', 'Sorting', 'HashTable', 'Cơ bản'].map(c => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Mô tả ngắn</label>
                <textarea
                  value={newForm.description}
                  onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Mô tả tóm tắt về bài tập (có thể chỉnh sửa chi tiết sau)"
                  className="w-full -input rounded-lg px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenNewModal(false)}>
                Huỷ
              </Button>
              <Button onClick={handleCreate} disabled={creating} className="gap-2 min-w-[100px]">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {creating ? 'Đang tạo...' : 'Tạo mới'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Tìm kiếm bài tập..."
            value={filter}
            onChange={e => {
              setFilter(e.target.value)
              setPage(1)
            }}
            className="w-full pl-9 pr-4 py-2 text-sm -input rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={difficulty}
            onChange={e => {
              setDifficulty(e.target.value)
              setPage(1)
            }}
            className="text-sm -input rounded-lg px-3 py-2 bg-background focus:outline-none"
          >
            <option value="">Tất cả độ khó</option>
            <option value="Easy">Dễ</option>
            <option value="Medium">Trung bình</option>
            <option value="Hard">Khó</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl bg-card shadow-md border-0 overflow-hidden shadow-md border-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="shadow-md border-0 border-b-0 bg-muted/40">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-8">#</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Tiêu đề</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Danh mục</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Độ khó</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden lg:table-cell">Test Cases</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden xl:table-cell">Người tạo</th>
              <th className="text-right px-4 py-3 font-medium text-muted-foreground">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-">
            {loading ? (
              <tr>
                <td colSpan={7} className="py-16 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                </td>
              </tr>
            ) : data?.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-16 text-center text-muted-foreground text-sm">
                  Không có bài tập nào.{' '}
                  <button onClick={() => setOpenNewModal(true)} className="text-primary hover:underline cursor-pointer">
                    Tạo bài đầu tiên
                  </button>
                </td>
              </tr>
            ) : (
              data?.items.map((ex, idx) => (
                <tr key={ex.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 text-muted-foreground text-xs">{(page - 1) * pageSize + idx + 1}</td>
                  <td className="px-4 py-3">
                    <p className="font-medium line-clamp-1">{ex.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5 hidden sm:block">
                      {ex.description}
                    </p>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <span className="text-xs bg-muted px-2 py-0.5 rounded-md">{ex.category}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_STYLE[ex.difficulty]}`}>
                      {DIFF_LABEL[ex.difficulty] ?? ex.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3" />
                      {ex.testCaseCount} test cases
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden xl:table-cell text-xs text-muted-foreground">
                    {ex.createdByName ?? '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7" asChild>
                        <Link href={`/management/exercises/${ex.id}`}>
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(ex.id, ex.title)}
                        disabled={deletingId === ex.id}
                      >
                        {deletingId === ex.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data && data.totalCount > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            Hiển thị {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, data.totalCount)} / {data.totalCount} bài
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => p - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs">
              {page} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => setPage(p => p + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
