'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, BookOpen } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, cn } from '@/lib/utils'
import { courseService } from '@/lib/course-service'
import { categoryService } from '@/lib/category-service'
import { userService } from '@/lib/user-service'
import { getRole, getUserId } from '@/lib/auth-service'
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
import { formatDate } from '@/lib/utils'

const columns: Column<CourseDto>[] = [
  { key: 'title', header: 'Title', sortKey: 'title' },
  { key: 'categoryName', header: 'Category' },
  { key: 'instructorName', header: 'Instructor' },
  {
    key: 'price',
    header: 'Price',
    sortKey: 'price',
    render: row => formatCurrency(row.price)
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
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<CourseDto | null>(null)
  const [form, setForm] = useState<CreateCourseRequest>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [users, setUsers] = useState<UserDto[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(false)
  const [userRole, setUserRole] = useState<string[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    setUserRole(getRole())
    setCurrentUserId(getUserId())
  }, [])

  const isAdmin = userRole.includes('Admin')
  const isInstructor = userRole.includes('Instructor') && !isAdmin

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await courseService.list({ filter, pageSize, pageIndex, sorting })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, sorting, pageIndex])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  async function loadDropdowns() {
    setLoadingDropdowns(true)
    try {
      const promises: Promise<unknown>[] = [
        categoryService.list({ filter: '', pageSize: 25, sorting: 'name' }).then(res => setCategories(res.items))
      ]

      if (isAdmin) {
        promises.push(
          userService.list({ filter: '', pageSize: 25, sorting: 'userName' }).then(res => setUsers(res.items))
        )
      }

      await Promise.all(promises)
    } finally {
      setLoadingDropdowns(false)
    }
  }

  async function openCreate() {
    setEditing(null)
    setForm({
      ...emptyForm,
      instructorId: isInstructor ? (currentUserId ?? '') : ''
    })
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
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{isAdmin ? 'All Courses' : 'My Courses'}</h1>
          <p className="text-lg text-muted-foreground mt-2">
            {isAdmin ? 'Manage all courses in the platform' : 'Manage your courses and content'}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 h-12 px-6 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" /> New Course
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-11 h-12 text-base rounded-xl border-muted-foreground/20 focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search courses by name or category…"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-xl shadow-foreground/5 overflow-hidden">
        <DataTable
          columns={columns.filter(c => isAdmin || c.key !== 'instructorName')}
          data={items}
          loading={loading}
          sorting={sorting}
          onSort={setSorting}
          onView={row => router.push(`/management/courses/${row.id}`)}
          onEdit={openEdit}
          onDelete={setDeleteId}
          pagination={{
            pageIndex,
            pageSize,
            totalCount,
            onPageChange: setPageIndex
          }}
        />
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] lg:max-w-6xl p-0 gap-0 overflow-hidden rounded-[2rem] border-none shadow-2xl">
          <DialogHeader className="px-10 py-8 bg-primary text-primary-foreground">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                <Plus className="h-8 w-8" />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black">
                  {editing ? 'Edit Course' : 'Create New Course'}
                </DialogTitle>
                <p className="text-primary-foreground/80 font-medium mt-1">
                  Fill in the details below to {editing ? 'update' : 'publish'} your course
                </p>
              </div>
            </div>
          </DialogHeader>

          <div className="px-10 py-10 space-y-12 max-h-[60vh] overflow-y-auto custom-scrollbar bg-background">
            {/* Main Content Area - Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - General Info & Assignment (2/3 width) */}
              <div className="lg:col-span-2 space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <h3 className="text-base font-black uppercase tracking-[0.2em] text-foreground/80">
                      General Information
                    </h3>
                  </div>

                  <div className="grid gap-8">
                    <div className="space-y-3">
                      <Label className="text-lg font-bold">Course Title</Label>
                      <Input
                        className="h-12 text-base rounded-xl border-muted-foreground/20 bg-muted/5 focus:bg-background transition-all"
                        placeholder="e.g. The Complete Web Development Bootcamp 2026"
                        value={form.title}
                        onChange={e => f('title', e.target.value)}
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="text-lg font-bold">Comprehensive Description</Label>
                      <textarea
                        className="w-full rounded-xl border border-muted-foreground/20 bg-muted/5 px-4 py-3 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus:bg-background focus-visible:ring-2 focus-visible:ring-primary/20 min-h-[160px] transition-all leading-relaxed custom-scrollbar"
                        placeholder="Provide a detailed roadmap of what students will learn..."
                        value={form.description}
                        onChange={e => f('description', e.target.value)}
                      />
                    </div>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <h3 className="text-base font-black uppercase tracking-[0.2em] text-foreground/80">
                      Classification & Assignment
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label className="text-lg font-bold">Course Category</Label>
                      <Select
                        value={form.categoryId?.toLowerCase() || undefined}
                        onValueChange={v => f('categoryId', v)}
                        disabled={loadingDropdowns}
                      >
                        <SelectTrigger className="h-12 text-base rounded-xl border-muted-foreground/20 bg-muted/5 focus:bg-background transition-all">
                          <SelectValue placeholder={loadingDropdowns ? 'Loading categories…' : 'Select a category'} />
                        </SelectTrigger>
                        <SelectContent className="rounded-2xl shadow-2xl border-muted-foreground/10">
                          {categories.map(c => (
                            <SelectItem
                              key={c.id}
                              value={c.id.toLowerCase()}
                              className="text-base py-3 hover:bg-primary/5 transition-colors"
                            >
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {isAdmin && (
                      <div className="space-y-3">
                        <Label className="text-lg font-bold">Lead Instructor</Label>
                        <Select
                          value={form.instructorId?.toLowerCase() || undefined}
                          onValueChange={v => f('instructorId', v)}
                          disabled={loadingDropdowns}
                        >
                          <SelectTrigger className="h-12 text-base rounded-xl border-muted-foreground/20 bg-muted/5 focus:bg-background transition-all">
                            <SelectValue
                              placeholder={loadingDropdowns ? 'Loading instructors…' : 'Assign to instructor'}
                            />
                          </SelectTrigger>
                          <SelectContent className="rounded-2xl shadow-2xl border-muted-foreground/10">
                            {users.map(u => (
                              <SelectItem
                                key={u.id}
                                value={u.id.toLowerCase()}
                                className="text-base py-3 hover:bg-primary/5 transition-colors"
                              >
                                {u.userName ?? u.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {/* Right Column - Media, Pricing & Status (1/3 width) */}
              <div className="space-y-12">
                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <h3 className="text-base font-black uppercase tracking-[0.2em] text-foreground/80">Pricing</h3>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-lg font-bold">Course Price</Label>
                    <div className="relative group">
                      <Input
                        className="h-14 pl-6 pr-16 text-2xl font-black rounded-2xl border-primary/20 bg-primary/5 text-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                        type="number"
                        min={0}
                        step={1000}
                        placeholder="0"
                        value={form.price}
                        onChange={e => f('price', Number(e.target.value))}
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 text-primary/60 font-black text-lg">
                        VNĐ
                      </div>
                    </div>
                    <p className="text-sm text-center text-muted-foreground font-medium pt-1">
                      Enter 0 for a free course
                    </p>
                  </div>
                </section>

                <section className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-primary/10 pb-3">
                    <div className="h-3 w-3 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                    <h3 className="text-base font-black uppercase tracking-[0.2em] text-foreground/80">Thumbnail</h3>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground/70">
                        Image URL
                      </Label>
                      <Input
                        className="h-12 text-base rounded-xl border-muted-foreground/20 bg-muted/5"
                        placeholder="https://images.unsplash.com/..."
                        value={form.imageUrl}
                        onChange={e => f('imageUrl', e.target.value)}
                      />
                    </div>

                    <div className="relative aspect-video rounded-3xl overflow-hidden border-4 border-muted shadow-2xl bg-muted group transition-all hover:border-primary/30">
                      {form.imageUrl ? (
                        <>
                          <img
                            src={form.imageUrl}
                            alt="Preview"
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 text-white font-bold tracking-widest text-xs uppercase">
                            Live Preview
                          </div>
                        </>
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground gap-3">
                          <div className="p-4 rounded-full bg-background/50">
                            <BookOpen className="h-8 w-8" />
                          </div>
                          <p className="text-sm font-bold opacity-50">No Image Selected</p>
                        </div>
                      )}
                    </div>
                  </div>
                </section>

                {/* Status Switcher - Pushed to right column */}
                <div className="pt-4">
                  <div
                    className={cn(
                      'flex flex-col gap-6 rounded-[2.5rem] border-4 p-8 transition-all duration-300',
                      form.isPublished
                        ? 'border-primary/20 bg-primary/5 shadow-xl shadow-primary/5 ring-4 ring-primary/5'
                        : 'border-muted bg-muted/30'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-4 rounded-3xl bg-background shadow-lg">
                        <BookOpen
                          className={cn(
                            'h-8 w-8 transition-colors',
                            form.isPublished ? 'text-primary' : 'text-muted-foreground'
                          )}
                        />
                      </div>
                      <Switch
                        className="scale-[2] data-[state=checked]:bg-primary transition-all duration-500"
                        checked={form.isPublished}
                        onCheckedChange={v => f('isPublished', v)}
                      />
                    </div>
                    <div>
                      <p
                        className={cn(
                          'text-xl font-black tracking-tight transition-colors',
                          form.isPublished ? 'text-primary' : 'text-foreground'
                        )}
                      >
                        {form.isPublished ? 'Course is LIVE' : 'Still in Draft'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1 font-medium leading-relaxed">
                        {form.isPublished
                          ? 'Students can now find and purchase this course globally.'
                          : 'Course is hidden. Finalize your content before publishing.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="px-10 py-10 bg-muted/10 border-t flex flex-row items-center justify-between gap-6 rounded-b-[2rem]">
            <p className="text-sm text-muted-foreground font-medium hidden md:block italic">
              * Ensure all mandatory fields are completed before saving.
            </p>
            <div className="flex items-center gap-4 flex-1 md:flex-none">
              <Button
                variant="ghost"
                className="h-16 px-10 text-lg font-bold rounded-2xl hover:bg-background/80 transition-all flex-1 md:flex-none"
                onClick={() => setDialogOpen(false)}
              >
                Discard Changes
              </Button>
              <Button
                className="h-16 px-14 text-xl font-black rounded-2xl shadow-2xl shadow-primary/30 active:scale-95 transition-all flex-1 md:flex-none"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? (
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : editing ? (
                  'Update Course'
                ) : (
                  'Launch Course'
                )}
              </Button>
            </div>
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
