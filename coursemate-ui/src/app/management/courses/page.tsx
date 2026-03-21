'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { courseService, categoryService, userService } from '@/lib/admin-service'
import type { CategoryDto, CourseDto, CreateCourseRequest, UserDto } from '@/lib/types'
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
  const router = useRouter()
  const [items, setItems] = useState<CourseDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<CourseDto | null>(null)
  const [form, setForm] = useState<CreateCourseRequest>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [users, setUsers] = useState<UserDto[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(false)

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

  async function loadDropdowns() {
    setLoadingDropdowns(true)
    try {
      await Promise.all([
        categoryService.list({ filter, pageSize: 25, sorting }).then(res => setCategories(res.items)),
        userService.list({ filter, pageSize: 25, sorting }).then(res => setUsers(res.items))
      ])
    } finally {
      setLoadingDropdowns(false)
    }
  }

  async function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    await loadDropdowns()
    setDialogOpen(true)
  }

  async function openEdit(row: CourseDto) {
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
    await loadDropdowns()
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
        onView={row => router.push(`/management/courses/${row.id}`)}
        onEdit={openEdit}
        onDelete={setDeleteId}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader className="pb-2 border-b">
            <DialogTitle className="text-xl">{editing ? 'Edit Course' : 'New Course'}</DialogTitle>
          </DialogHeader>

          <div className="py-4 space-y-5">
            {/* Basic Info */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Basic Info</p>
              <div className="space-y-1">
                <Label>Title</Label>
                <Input placeholder="Course title" value={form.title} onChange={e => f('title', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label>Description</Label>
                <textarea
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px] resize-y"
                  placeholder="Short description…"
                  value={form.description}
                  onChange={e => f('description', e.target.value)}
                />
              </div>
            </div>

            {/* Media & Pricing */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Media &amp; Pricing
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    min={0}
                    step={0.01}
                    placeholder="0.00"
                    value={form.price}
                    onChange={e => f('price', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Image URL</Label>
                  <Input placeholder="https://…" value={form.imageUrl} onChange={e => f('imageUrl', e.target.value)} />
                </div>
              </div>
            </div>

            {/* Assignment */}
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignment</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select value={form.categoryId} onValueChange={v => f('categoryId', v)} disabled={loadingDropdowns}>
                    <SelectTrigger>
                      <SelectValue placeholder={loadingDropdowns ? 'Loading…' : 'Select category'}>
                        {categories.find(c => c.id === form.categoryId)?.name ??
                          (loadingDropdowns ? 'Loading…' : 'Select category')}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(c => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <Label>Instructor</Label>
                  <Select
                    value={form.instructorId}
                    onValueChange={v => f('instructorId', v)}
                    disabled={loadingDropdowns}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingDropdowns ? 'Loading…' : 'Select instructor'}>
                        {(() => {
                          const u = users.find(u => u.id === form.instructorId)
                          return u ? (u.userName ?? u.email) : loadingDropdowns ? 'Loading…' : 'Select instructor'
                        })()}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {users.map(u => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.userName ?? u.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Publishing */}
            <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
              <Switch checked={form.isPublished} onCheckedChange={v => f('isPublished', v)} />
              <div>
                <p className="text-sm font-medium">Published</p>
                <p className="text-xs text-muted-foreground">Course will be visible to students</p>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Save Changes' : 'Create Course'}
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
