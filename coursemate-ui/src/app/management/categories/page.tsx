'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { categoryService } from '@/lib/category-service'
import type { CategoryDto, CreateCategoryRequest } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/utils'

const columns: Column<CategoryDto>[] = [
  { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
  { key: 'name', header: 'Title', sortKey: 'name' },
  { key: 'description', header: 'Mô tả' },
  {
    key: 'isActive',
    header: 'Trạng thái',
    render: row => (
      <Badge variant={row.isActive ? 'default' : 'secondary'}>
        {row.isActive ? 'Đang hoạt động' : 'Ngừng hoạt động'}
      </Badge>
    )
  },
  {
    key: 'creationTime',
    header: 'Creation Time',
    sortKey: 'creationTime',
    render: row => formatDate(row.creationTime)
  },
  {
    key: 'lastModificationTime',
    header: 'Last Modification Time',
    sortKey: 'lastModificationTime',
    render: row => formatDate(row.lastModificationTime)
  }
]

const emptyForm: CreateCategoryRequest = { name: '', description: '', isActive: true }

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [hasCourseFilter, setHasCourseFilter] = useState<'all' | 'has' | 'none'>('has')
  const [sorting, setSorting] = useState('creationTime')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<CategoryDto | null>(null)
  const [form, setForm] = useState<CreateCategoryRequest>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const hasCourse = hasCourseFilter === 'all' ? undefined : hasCourseFilter === 'has'
      const res = await categoryService.list({
        filter,
        pageIndex,
        pageSize,
        sorting,
        hasCourse
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, hasCourseFilter, pageIndex, pageSize, sorting])

  // Reset về trang đầu khi filter hoặc sorting thay đổi
  useEffect(() => {
    setPageIndex(0)
  }, [filter, hasCourseFilter, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(row: CategoryDto) {
    setEditing(row)
    setForm({ name: row.name, description: row.description, isActive: row.isActive })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await categoryService.update(editing.id, form)
        toast.success('Đã cập nhật danh mục.')
      } else {
        await categoryService.create(form)
        toast.success('Đã tạo danh mục.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await categoryService.delete(deleteId)
    toast.success('Đã xóa danh mục.')
    setDeleteId(null)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Danh mục</h1>
          <p className="text-sm text-muted-foreground">Quản lý danh mục khóa học</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo danh mục
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm danh mục..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Select value={hasCourseFilter} onValueChange={val => setHasCourseFilter(val as 'all' | 'has' | 'none')}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Lọc theo khóa học" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả danh mục</SelectItem>
            <SelectItem value="has">Có khóa học</SelectItem>
            <SelectItem value="none">Chưa có khóa học</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        sorting={sorting}
        onSort={setSorting}
        onEdit={openEdit}
        onDelete={setDeleteId}
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: setPageIndex
        }}
      />

      {/* Edit / Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="cat-name">Tên</Label>
              <Input id="cat-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cat-desc">Mô tả</Label>
              <Input
                id="cat-desc"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="cat-active"
                checked={form.isActive}
                onCheckedChange={v => setForm({ ...form, isActive: v })}
              />
              <Label htmlFor="cat-active">Đang hoạt động</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
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
