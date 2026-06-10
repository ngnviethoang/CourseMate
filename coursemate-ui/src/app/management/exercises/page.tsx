'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, Search, Loader2, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, type Column } from '@/components/admin/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { exerciseService } from '@/lib/exercise-service'
import { formatDate } from '@/lib/utils'
import type { ExerciseDto } from '@/lib/types'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

const DIFF_STYLE: Record<string, string> = {
  Easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  Medium: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  Hard: 'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
}

const DIFF_LABEL: Record<string, string> = { Easy: 'Dễ', Medium: 'Trung bình', Hard: 'Khó' }

const difficultyItems: Array<{ label: string; value: string | null }> = [
  { label: 'Tất cả độ khó', value: null },
  { label: 'Dễ', value: 'Easy' },
  { label: 'Trung bình', value: 'Medium' },
  { label: 'Khó', value: 'Hard' }
]

export default function ExercisesManagementPage() {
  const router = useRouter()
  const [items, setItems] = useState<ExerciseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [difficulty, setDifficulty] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const [openNewModal, setOpenNewModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newForm, setNewForm] = useState({
    title: '',
    description: '',
    difficulty: 'Easy',
    category: ''
  })

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await exerciseService.getList({
        pageIndex: pageIndex + 1,
        pageSize,
        ...(filter && { filter }),
        ...(difficulty && { difficulty })
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } catch {
      toast.error('Không thể tải danh sách bài tập')
    } finally {
      setLoading(false)
    }
  }, [pageIndex, pageSize, filter, difficulty])

  useEffect(() => {
    setPageIndex(0)
  }, [filter, difficulty])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function handlePageChange(nextPageIndex: number) {
    if (nextPageIndex === pageIndex) return
    setLoading(true)
    setPageIndex(nextPageIndex)
  }

  function handleDifficultyChange(value: string | null) {
    const next = value ?? ''
    if (next === difficulty) return
    setLoading(true)
    setDifficulty(next)
  }

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
      const res = await exerciseService.create(payload)
      toast.success('Đã tạo bài tập! Tiếp tục thêm chi tiết.')
      setOpenNewModal(false)
      router.push(`/management/exercises/${res.id}`)
    } catch {
      toast.error('Tạo bài tập thất bại')
    } finally {
      setCreating(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await exerciseService.delete(deleteId)
      toast.success('Đã xoá bài tập')
      setDeleteId(null)
      load()
    } catch {
      toast.error('Xoá thất bại')
    }
  }

  const handleToggleHidden = async (id: string, currentIsHidden: boolean) => {
    try {
      const fullExercise = await exerciseService.getById(id)
      await exerciseService.update({ ...fullExercise, isHidden: !currentIsHidden })
      toast.success(!currentIsHidden ? 'Đã ẩn bài tập' : 'Đã công khai bài tập')
      load()
    } catch {
      toast.error('Cập nhật trạng thái thất bại')
    }
  }

  const columns: Column<ExerciseDto>[] = [
    { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
    {
      key: 'title',
      header: 'Tiêu đề',
      render: row => (
        <div>
          <p className="font-medium line-clamp-1">{row.title}</p>
          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{row.description}</p>
        </div>
      )
    },
    {
      key: 'difficulty',
      header: 'Độ khó',
      render: row => (
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${DIFF_STYLE[row.difficulty]}`}>
          {DIFF_LABEL[row.difficulty] ?? row.difficulty}
        </span>
      )
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: row => <span className="text-xs bg-muted px-2 py-0.5 rounded-md">{row.category}</span>
    },
    {
      key: 'isHidden',
      header: 'Trạng thái',
      render: row => (
        <Button
          variant="ghost"
          size="sm"
          onClick={e => {
            e.stopPropagation()
            handleToggleHidden(row.id, row.isHidden)
          }}
          className={`h-7 px-2 text-xs font-semibold ${row.isHidden ? 'text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10' : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-500/10'}`}
        >
          {row.isHidden ? (
            <>
              <EyeOff className="h-3.5 w-3.5 mr-1" /> Ẩn
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5 mr-1" /> Hiện
            </>
          )}
        </Button>
      )
    },
    {
      key: 'creationTime',
      header: 'Ngày tạo',
      render: row => formatDate(row.creationTime)
    },
    {
      key: 'lastModificationTime',
      header: 'Cập nhật lần cuối',
      render: row => formatDate(row.lastModificationTime)
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Quản lý Bài tập</h1>
          <p className="text-sm text-muted-foreground">Tạo và quản lý bài tập lập trình, bộ kiểm thử và mã mẫu</p>
        </div>

        <Dialog open={openNewModal} onOpenChange={setOpenNewModal}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" /> Thêm bài tập
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Tạo bài tập mới</DialogTitle>
              <DialogDescription>Điền các thông tin cơ bản trước khi thêm bộ kiểm thử và mã mẫu.</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newForm.title}
                  onChange={e => setNewForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="Ví dụ: Tính tổng A + B"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Độ khó</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Easy', 'Medium', 'Hard'] as const).map(d => (
                    <button
                      key={d}
                      onClick={() => setNewForm(f => ({ ...f, difficulty: d }))}
                      className={`py-2 rounded-lg text-xs font-semibold transition-all ${newForm.difficulty === d ? DIFF_STYLE[d] : 'text-muted-foreground hover:text-foreground'}`}
                    >
                      {DIFF_LABEL[d]}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Danh mục</label>
                <Input
                  value={newForm.category}
                  onChange={e => setNewForm(f => ({ ...f, category: e.target.value }))}
                  list="category-list"
                  placeholder="Mảng, Chuỗi, Cây..."
                />
                <datalist id="category-list">
                  {['Mảng', 'Chuỗi', 'Cây', 'Đồ thị', 'Quy hoạch động', 'Toán', 'Sắp xếp', 'Bảng băm', 'Cơ bản'].map(
                    c => (
                      <option key={c} value={c} />
                    )
                  )}
                </datalist>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Mô tả ngắn</label>
                <textarea
                  value={newForm.description}
                  onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                  placeholder="Mô tả tóm tắt về bài tập (có thể chỉnh sửa chi tiết sau)"
                  className="w-full rounded-lg border border-input px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background resize-none"
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

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Tìm kiếm bài tập..." value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        <Select items={difficultyItems} value={difficulty || null} onValueChange={handleDifficultyChange}>
          <SelectTrigger className="h-10 min-w-[180px]">
            <SelectValue placeholder="Tất cả độ khó" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {difficultyItems.map(item => (
                <SelectItem key={item.value ?? 'all-difficulties'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        onEdit={row => router.push(`/management/exercises/${row.id}`)}
        onDelete={setDeleteId}
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: handlePageChange
        }}
      />

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa bài tập?</AlertDialogTitle>
            <AlertDialogDescription>Hành động này không thể hoàn tác.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
