'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { chapterService, courseService, lessonService } from '@/lib/course-service'
import { ChapterDto, CourseDto, LessonDto, CreateLessonRequest, LessonType } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { formatDate } from '@/lib/utils'

const LESSON_TYPES: LessonType[] = Object.values(LessonType)
const LESSON_TYPE_LABELS: Record<LessonType, string> = {
  [LessonType.Video]: 'Video',
  [LessonType.Reading]: 'Bài đọc',
  [LessonType.Coding]: 'Lập trình',
  [LessonType.Quiz]: 'Trắc nghiệm',
  [LessonType.Slide]: 'Trình chiếu'
}

const columns: Column<LessonDto>[] = [
  { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
  { key: 'title', header: 'Tiêu đề', sortKey: 'title' },
  { key: 'chapterName', header: 'Chương' },
  { key: 'courseName', header: 'Khóa học' },
  {
    key: 'lessonType',
    header: 'Loại',
    render: row => <Badge variant="outline">{LESSON_TYPE_LABELS[row.lessonType] ?? row.lessonType}</Badge>
  },
  { key: 'sortOrder', header: 'Thứ tự', sortKey: 'position', render: row => row.sortOrder },
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

const emptyForm: CreateLessonRequest = {
  chapterId: '',
  courseId: '',
  title: '',
  lessonType: LessonType.Video,
  sortOrder: 1
}

export default function LessonsPage() {
  const router = useRouter()
  const [items, setItems] = useState<LessonDto[]>([])
  const [courseOptions, setCourseOptions] = useState<CourseDto[]>([])
  const [chapterOptions, setChapterOptions] = useState<ChapterDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [courseFilterId, setCourseFilterId] = useState('')
  const [chapterFilterId, setChapterFilterId] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<LessonDto | null>(null)
  const [form, setForm] = useState<CreateLessonRequest>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await lessonService.list({
        filter,
        pageSize,
        pageIndex,
        sorting,
        courseId: courseFilterId || undefined,
        chapterId: chapterFilterId || undefined
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, courseFilterId, chapterFilterId, sorting, pageIndex])

  useEffect(() => {
    courseService
      .list({ pageSize: 100, sorting: 'title' })
      .then(res => setCourseOptions(res.items))
      .catch(() => setCourseOptions([]))
  }, [])

  useEffect(() => {
    chapterService
      .list({ pageSize: 100, sorting: 'title', courseId: courseFilterId || undefined })
      .then(res => setChapterOptions(res.items))
      .catch(() => setChapterOptions([]))
  }, [courseFilterId])

  useEffect(() => {
    setPageIndex(0)
  }, [filter, courseFilterId, chapterFilterId, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function openCreate() {
    setEditing(null)
    setForm({
      chapterId: chapterFilterId,
      courseId: courseFilterId,
      title: '',
      lessonType: LessonType.Video,
      sortOrder: chapterFilterId ? totalCount + 1 : 1
    })
    setDialogOpen(true)
  }
  async function openEdit(row: LessonDto) {
    setEditing(row)
    try {
      const detail = await lessonService.getById(row.id)
      setForm({
        chapterId: row.chapterId,
        courseId: row.courseId,
        title: row.title,
        lessonType: row.lessonType,
        sortOrder: detail?.sortOrder ?? row.sortOrder
      })
    } catch {
      setForm({
        chapterId: row.chapterId,
        courseId: row.courseId,
        title: row.title,
        lessonType: row.lessonType,
        sortOrder: row.sortOrder
      })
    } finally {
      setDialogOpen(true)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await lessonService.update(editing.id, form)
        toast.success('Đã cập nhật bài học.')
      } else {
        await lessonService.create(form)
        toast.success('Đã tạo bài học.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await lessonService.delete(deleteId)
    toast.success('Đã xóa bài học.')
    setDeleteId(null)
    load()
  }

  const f = (field: keyof CreateLessonRequest, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Bài học</h1>
          <p className="text-sm text-muted-foreground">Quản lý bài học trong chương</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo bài học
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm bài học..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <select
          value={courseFilterId}
          onChange={e => {
            setCourseFilterId(e.target.value)
            setChapterFilterId('')
          }}
          className="h-10 min-w-[220px] rounded-md -input bg-background px-3 text-sm focus:outline-none"
        >
          <option value="">Tất cả khóa học</option>
          {courseOptions.map(course => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        <select
          value={chapterFilterId}
          onChange={e => setChapterFilterId(e.target.value)}
          className="h-10 min-w-[220px] rounded-md -input bg-background px-3 text-sm focus:outline-none"
        >
          <option value="">Tất cả chương</option>
          {chapterOptions.map(chapter => (
            <option key={chapter.id} value={chapter.id}>
              {chapter.title}
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
        onView={row => router.push(`/management/lessons/${row.id}`)}
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: setPageIndex
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Chỉnh sửa bài học' : 'Tạo bài học mới'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Tiêu đề</Label>
              <Input value={form.title} onChange={e => f('title', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>ID chương</Label>
              <Input value={form.chapterId} onChange={e => f('chapterId', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>ID khóa học</Label>
              <Input value={form.courseId} onChange={e => f('courseId', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Loại</Label>
              <Select value={form.lessonType} onValueChange={v => f('lessonType', v as LessonType)}>
                <SelectTrigger>
                  <SelectValue>{LESSON_TYPE_LABELS[form.lessonType] ?? form.lessonType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {LESSON_TYPES.map(t => (
                    <SelectItem key={t} value={t}>
                      {LESSON_TYPE_LABELS[t] ?? t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label>Thứ tự</Label>
              <Input
                type="number"
                min={1}
                value={form.sortOrder}
                onChange={e => f('sortOrder', Number(e.target.value))}
              />
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
            <AlertDialogTitle>Xóa bài học?</AlertDialogTitle>
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
