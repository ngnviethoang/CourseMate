'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Upload, Link2, ChevronsUpDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, cn } from '@/lib/utils'
import { courseService, categoryService, userService, getRole, getUserId } from '@/lib/admin-service'
import { api } from '@/lib/api-client'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { formatDate } from '@/lib/format-date'

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
  const [categoryOpen, setCategoryOpen] = useState(false)
  const [instructorOpen, setInstructorOpen] = useState(false)
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [selectedInstructorName, setSelectedInstructorName] = useState('')
  const [categorySearch, setCategorySearch] = useState('')
  const [instructorSearch, setInstructorSearch] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Debounced server-side category search
  useEffect(() => {
    if (!categoryOpen) return
    const t = setTimeout(async () => {
      const res = await categoryService.list({ filter: categorySearch, pageSize: 25, sorting: 'name' })
      setCategories(res.items)
    }, 300)
    return () => clearTimeout(t)
  }, [categorySearch, categoryOpen])

  // Debounced server-side instructor search
  useEffect(() => {
    if (!instructorOpen || !isAdmin) return
    const t = setTimeout(async () => {
      const res = await userService.list({ filter: instructorSearch, pageSize: 25, sorting: 'userName' })
      setUsers(res.items)
    }, 300)
    return () => clearTimeout(t)
  }, [instructorSearch, instructorOpen, isAdmin])

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
    setForm({ ...emptyForm, instructorId: isInstructor ? (currentUserId ?? '') : '' })
    setSelectedCategoryName('')
    setSelectedInstructorName('')
    setCategorySearch('')
    setInstructorSearch('')
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
    setSelectedCategoryName(row.categoryName ?? '')
    setSelectedInstructorName(row.instructorName ?? '')
    setCategorySearch('')
    setInstructorSearch('')
    await loadDropdowns()
    setDialogOpen(true)
  }

  async function handleImageFile(file: File) {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('request', file)
      const result = await api.post<{ fileId: string; fileUrl: string }>('/api/files/images', formData)
      f('imageUrl', result.fileUrl)
      toast.success('Image uploaded!')
    } catch {
      toast.error('Failed to upload image. Please try again.')
    } finally {
      setUploadingImage(false)
    }
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
        <DialogContent className="sm:max-w-4xl p-0 gap-0 overflow-hidden rounded-2xl shadow-2xl">

          {/* Header */}
          <DialogHeader className="px-6 py-5 border-b">
            <DialogTitle className="text-xl font-bold">
              {editing ? 'Edit Course' : 'New Course'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editing ? 'Update course details below' : 'Fill in the details to publish a new course'}
            </p>
          </DialogHeader>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-5 max-h-[72vh] overflow-y-auto custom-scrollbar">

            {/* Left — Thumbnail & Status */}
            <div className="md:col-span-2 p-6 bg-muted/20 border-r flex flex-col gap-5">

              {/* Click-to-upload image area */}
              <div
                role="button"
                tabIndex={0}
                onClick={() => !uploadingImage && fileInputRef.current?.click()}
                onKeyDown={e => e.key === 'Enter' && !uploadingImage && fileInputRef.current?.click()}
                className={cn(
                  'relative aspect-video rounded-xl overflow-hidden bg-muted border-2 transition-all',
                  uploadingImage
                    ? 'border-primary/40 cursor-wait'
                    : 'border-dashed border-muted-foreground/20 hover:border-primary/40 hover:bg-muted/60 cursor-pointer'
                )}
              >
                {/* Image or placeholder */}
                {form.imageUrl && (
                  <img
                    src={form.imageUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
                  />
                )}

                {/* Overlay */}
                <div className={cn(
                  'absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all',
                  uploadingImage
                    ? 'bg-background/70'
                    : form.imageUrl
                      ? 'opacity-0 hover:opacity-100 bg-black/50 text-white'
                      : 'text-muted-foreground'
                )}>
                  {uploadingImage ? (
                    <>
                      <div className="h-7 w-7 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      <p className="text-xs font-medium text-foreground">Uploading…</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 opacity-70" />
                      <p className="text-xs font-semibold">
                        {form.imageUrl ? 'Click to change' : 'Click to upload'}
                      </p>
                      {!form.imageUrl && <p className="text-xs opacity-50">JPG, PNG, WebP, GIF</p>}
                    </>
                  )}
                </div>
              </div>

              {/* Hidden file picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0]
                  if (file) handleImageFile(file)
                  e.target.value = ''
                }}
              />

              {/* URL input — secondary option */}
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Link2 className="h-3 w-3" />
                  Or paste image URL
                </Label>
                <Input
                  className="text-sm h-9"
                  placeholder="https://images.unsplash.com/…"
                  value={form.imageUrl}
                  onChange={e => f('imageUrl', e.target.value)}
                />
              </div>

              {/* Publish toggle */}
              <div
                className={cn(
                  'rounded-xl border-2 p-4 transition-all duration-300 cursor-pointer select-none',
                  form.isPublished
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-muted/20'
                )}
                onClick={() => f('isPublished', !form.isPublished)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn('font-semibold text-sm', form.isPublished ? 'text-primary' : '')}>
                      {form.isPublished ? 'Published' : 'Draft'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {form.isPublished ? 'Visible to students' : 'Hidden from students'}
                    </p>
                  </div>
                  <Switch
                    checked={form.isPublished}
                    onCheckedChange={v => f('isPublished', v)}
                    onClick={e => e.stopPropagation()}
                  />
                </div>
              </div>
            </div>

            {/* Right — Form Fields */}
            <div className="md:col-span-3 p-6 space-y-5">

              {/* Title */}
              <div className="space-y-1.5">
                <Label className="font-semibold">
                  Title <span className="text-destructive text-xs">*</span>
                </Label>
                <Input
                  placeholder="e.g. The Complete Web Development Bootcamp 2026"
                  value={form.title}
                  onChange={e => f('title', e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="font-semibold">Description</Label>
                <textarea
                  className="w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[110px] resize-none custom-scrollbar"
                  placeholder="What will students learn in this course?"
                  value={form.description}
                  onChange={e => f('description', e.target.value)}
                />
              </div>

              {/* Category + Instructor */}
              <div className={cn('grid gap-4', isAdmin ? 'grid-cols-2' : 'grid-cols-1')}>
                <div className="space-y-1.5">
                  <Label className="font-semibold">Category</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger
                      role="combobox"
                      disabled={loadingDropdowns}
                      className="h-9 w-full flex items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm hover:bg-muted/40 transition-all disabled:opacity-50"
                    >
                      {selectedCategoryName
                        ? <span>{selectedCategoryName}</span>
                        : <span className="text-muted-foreground">{loadingDropdowns ? 'Loading…' : 'Select category'}</span>}
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent style={{ width: 'var(--anchor-width)' }} className="p-0">
                      <Command shouldFilter={false}>
                        <CommandInput placeholder="Search categories…" value={categorySearch} onValueChange={setCategorySearch} />
                        <CommandList>
                          <CommandEmpty>No categories found.</CommandEmpty>
                          <CommandGroup>
                            {categories.map(c => (
                              <CommandItem key={c.id} value={c.id} onSelect={() => { f('categoryId', c.id); setSelectedCategoryName(c.name); setCategoryOpen(false) }}>
                                <Check className={cn('mr-2 h-4 w-4', form.categoryId === c.id ? 'opacity-100' : 'opacity-0')} />
                                {c.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {isAdmin && (
                  <div className="space-y-1.5">
                    <Label className="font-semibold">Instructor</Label>
                    <Popover open={instructorOpen} onOpenChange={setInstructorOpen}>
                      <PopoverTrigger
                        role="combobox"
                        disabled={loadingDropdowns}
                        className="h-9 w-full flex items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm hover:bg-muted/40 transition-all disabled:opacity-50"
                      >
                        {selectedInstructorName
                          ? <span>{selectedInstructorName}</span>
                          : <span className="text-muted-foreground">{loadingDropdowns ? 'Loading…' : 'Assign instructor'}</span>}
                        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent style={{ width: 'var(--anchor-width)' }} className="p-0">
                        <Command shouldFilter={false}>
                          <CommandInput placeholder="Search instructors…" value={instructorSearch} onValueChange={setInstructorSearch} />
                          <CommandList>
                            <CommandEmpty>No instructors found.</CommandEmpty>
                            <CommandGroup>
                              {users.map(u => (
                                <CommandItem key={u.id} value={u.id} onSelect={() => { f('instructorId', u.id); setSelectedInstructorName(u.userName ?? u.email ?? ''); setInstructorOpen(false) }}>
                                  <Check className={cn('mr-2 h-4 w-4', form.instructorId === u.id ? 'opacity-100' : 'opacity-0')} />
                                  {u.userName ?? u.email}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <Label className="font-semibold">Price</Label>
                <div className="relative">
                  <Input
                    type="number"
                    min={0}
                    step={1000}
                    placeholder="0"
                    value={form.price}
                    onChange={e => f('price', Number(e.target.value))}
                    className="pr-14"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">VNĐ</span>
                </div>
                {form.price === 0 && (
                  <p className="text-xs text-muted-foreground">This course will be free</p>
                )}
              </div>

            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 border-t bg-muted/10 flex flex-row justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                  Saving…
                </span>
              ) : editing ? 'Update Course' : 'Create Course'}
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
