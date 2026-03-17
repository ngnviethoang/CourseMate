'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { courseService } from '@/lib/admin-service'
import type { CourseDto, CreateCourseRequest } from '@/lib/types'
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
import { Switch } from '@/components/ui/switch'
import { formatDate } from '@/lib/format-date'

const columns: Column<CourseDto>[] = [
  { key: 'title', header: 'Title', sortKey: 'title' },
  { key: 'categoryName', header: 'Category' },
  { key: 'instructorName', header: 'Instructor' },
  {
    key: 'price',
    header: 'Price',
    sortKey: 'price',
    render: row => `$${row.price.toFixed(2)}`
  },
  {
    key: 'isPublished',
    header: 'Status',
    render: row => (
      <Badge variant={row.isPublished ? 'default' : 'secondary'}>{row.isPublished ? 'Published' : 'Draft'}</Badge>
    )
  },
  { key: 'creationTime', header: 'Created', sortKey: 'creationTime', render: row => formatDate(row.creationTime) },
  {
    key: 'lastModificationTime',
    header: 'Updated',
    sortKey: 'lastModificationTime',
    render: row => formatDate(row.lastModificationTime)
  }
]

const emptyForm: CreateCourseRequest = {
  title: '',
  description: '',
  price: 0,
  imageUrl: '',
  isPublished: false,
  categoryId: '',
  instructorId: ''
}

export default function CoursesPage() {
  const [items, setItems] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<CourseDto | null>(null)
  const [form, setForm] = useState<CreateCourseRequest>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await courseService.list({ filter, pageSize: 10, sorting })
      setItems(res.items)
    } finally {
      setLoading(false)
    }
  }, [filter, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setDialogOpen(true)
  }

  function openEdit(row: CourseDto) {
    setEditing(row)
    setForm({
      title: row.title,
      description: row.description,
      price: row.price,
      imageUrl: row.imageUrl,
      isPublished: row.isPublished,
      categoryId: row.categoryId,
      instructorId: row.instructorId
    })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await courseService.update(editing.id, form)
        toast.success('Course updated.')
      } else {
        await courseService.create(form)
        toast.success('Course created.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await courseService.delete(deleteId)
    toast.success('Course deleted.')
    setDeleteId(null)
    load()
  }

  const f = (field: keyof CreateCourseRequest, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-muted-foreground">Manage all courses</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Course
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search courses…"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        sorting={sorting}
        onSort={setSorting}
        onEdit={openEdit}
        onDelete={setDeleteId}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Course' : 'New Course'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-2">
            <div className="col-span-2 space-y-1">
              <Label>Title</Label>
              <Input value={form.title} onChange={e => f('title', e.target.value)} />
            </div>
            <div className="col-span-2 space-y-1">
              <Label>Description</Label>
              <Input value={form.description} onChange={e => f('description', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Price ($)</Label>
              <Input type="number" min={0} value={form.price} onChange={e => f('price', Number(e.target.value))} />
            </div>
            <div className="space-y-1">
              <Label>Image URL</Label>
              <Input value={form.imageUrl} onChange={e => f('imageUrl', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Category ID</Label>
              <Input value={form.categoryId} onChange={e => f('categoryId', e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label>Instructor ID</Label>
              <Input value={form.instructorId} onChange={e => f('instructorId', e.target.value)} />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <Switch checked={form.isPublished} onCheckedChange={v => f('isPublished', v)} />
              <Label>Published</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete course?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
