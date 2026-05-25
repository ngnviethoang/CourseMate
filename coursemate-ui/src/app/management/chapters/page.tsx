'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { chapterService, courseService } from '@/lib/course-service'
import type { ChapterDto, CourseDto, CreateChapterRequest } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
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
import { formatDate } from '@/lib/utils'

const columns: Column<ChapterDto>[] = [
  { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
  { key: 'title', header: 'Tiêu đề', sortKey: 'title' },
  { key: 'courseName', header: 'Khóa học' },
  { key: 'position', header: 'Vị trí', sortKey: 'position' },
  {
    key: 'creationTime',
    header: 'Ngày tạo',
    sortKey: 'creationTime',
    render: row => formatDate(row.creationTime)
  },
  {
    key: 'lastModificationTime',
    header: 'Cập nhật lần cuối',
    sortKey: 'lastModificationTime',
    render: row => formatDate(row.lastModificationTime)
  }
]

const emptyForm: CreateChapterRequest = { courseId: '', title: '', position: 0 }

export default function ChaptersPage() {
  const router = useRouter()
  const [items, setItems] = useState<ChapterDto[]>([])
  const [courseOptions, setCourseOptions] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [courseFilterId, setCourseFilterId] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<ChapterDto | null>(null)
  const [form, setForm] = useState<CreateChapterRequest>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await chapterService.list({
        filter,
        pageSize,
        pageIndex,
        sorting,
        courseId: courseFilterId || undefined
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, courseFilterId, sorting, pageIndex])

  useEffect(() => {
    courseService
      .list({ pageSize: 100, sorting: 'title' })
      .then(res => setCourseOptions(res.items))
      .catch(() => setCourseOptions([]))
  }, [])

  useEffect(() => {
    setPageIndex(0)
  }, [filter, courseFilterId, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }
  function openEdit(row: ChapterDto) {
    setEditing(row)
    setForm({ courseId: row.courseId, title: row.title, position: row.position })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await chapterService.update(editing.id, form)
        toast.success('Đã cập nhật chương.')
      } else {
        await chapterService.create(form)
        toast.success('Đã tạo chương.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await chapterService.delete(deleteId)
    toast.success('Đã xóa chương.')
    setDeleteId(null)
    load()
  }

  const f = (field: keyof CreateChapterRequest, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Chương</h1>
          <p className="text-sm text-muted-foreground">Quản lý chương của khóa học</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo chương
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm chương..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <select
          value={courseFilterId}
          onChange={e => setCourseFilterId(e.target.value)}
          className="h-10 min-w-[220px] rounded-md -input bg-background px-3 text-sm focus:outline-none"
        >
          <option value="">Tất cả khóa học</option>
          {courseOptions.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        sorting={sorting}
        onSort={setSorting}
        onEdit={openEdit}
        onDelete={setDeleteId}
        onView={row => router.push(`/management/chapters/${row.id}`)}
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: setPageIndex
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Chỉnh sửa chương' : 'Tạo chương mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>ID khóa học</Label>
              <Input value={form.courseId} onChange={e => f('courseId', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Tiêu đề</Label>
              <Input value={form.title} onChange={e => f('title', e.target.value)} />
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

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa chương?</AlertDialogTitle>
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
