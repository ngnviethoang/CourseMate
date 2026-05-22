'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Upload, Link2, ChevronsUpDown, Check } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, cn, formatDate } from '@/lib/utils'
import { courseService } from '@/lib/course-service'
import { categoryService } from '@/lib/category-service'
import { userService } from '@/lib/user-service'
import { getRole, getUserId } from '@/lib/auth-token.util'
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
const columns: Column<CourseDto>[] = [
  { key: 'title', header: 'Tiêu đề', sortKey: 'title' },
  { key: 'categoryName', header: 'Danh mục' },
  { key: 'instructorName', header: 'Giảng viên' },
  {
    key: 'price',
    header: 'Giá',
    sortKey: 'price',
    render: row => formatCurrency(row.price)
  },
  {
    key: 'isPublished',
    header: 'Trạng thái',
    render: row => (
      <Badge variant={row.isPublished ? 'default' : 'secondary'}>{row.isPublished ? 'Đã xuất bản' : 'Bản nháp'}</Badge>
    )
  },
  { key: 'creationTime', header: 'Ngày tạo', sortKey: 'creationTime', render: row => formatDate(row.creationTime) },
  {
    key: 'lastModificationTime',
    header: 'Cập nhật',
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
    const role = getRole()
    setUserRole(role ? [role] : [])
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
      const res = await categoryService.list({ filter: categorySearch, pageSize: 25, sorting: 'name', hasCourse: true })
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
        categoryService
          .list({ filter: '', pageSize: 25, sorting: 'name', hasCourse: true })
          .then(res => setCategories(res.items))
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
      toast.success('Tải ảnh lên thành công!')
    } catch {
      toast.error('Không thể tải ảnh lên. Vui lòng thử lại.')
    } finally {
      setUploadingImage(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await courseService.update(editing.id, form)
        toast.success('Đã cập nhật khóa học.')
      } else {
        await courseService.create(form)
        toast.success('Đã tạo khóa học.')
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
    toast.success('Đã xóa khóa học.')
    setDeleteId(null)
    load()
  }

  const f = (field: keyof CreateCourseRequest, value: unknown) => setForm(prev => ({ ...prev, [field]: value }))

  return (
    <div className="space-y-8 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{isAdmin ? 'Tất cả khóa học' : 'Khóa học của tôi'}</h1>
          <p className="text-lg text-muted-foreground mt-2">
            {isAdmin ? 'Quản lý toàn bộ khóa học trên nền tảng' : 'Quản lý khóa học và nội dung của bạn'}
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="gap-2 h-12 px-6 text-base shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-5 w-5" /> Tạo khóa học
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-11 h-12 text-base rounded-xl -muted-foreground/20 focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Tìm khóa học theo tên hoặc danh mục..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card shadow-md border-0 shadow-xl shadow-foreground/5 overflow-hidden">
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
          <DialogHeader className="px-6 py-5 shadow-md border-0 border-b-0">
            <DialogTitle className="text-xl font-bold">
              {editing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-0.5">
              {editing ? 'Cập nhật thông tin khóa học bên dưới' : 'Điền thông tin để xuất bản khóa học mới'}
            </p>
          </DialogHeader>

          {/* Body */}
          <div className="grid grid-cols-1 md:grid-cols-5 max-h-[72vh] overflow-y-auto custom-scrollbar">
            {/* Left — Thumbnail & Status */}
            <div className="md:col-span-2 p-6 bg-muted/20 -r flex flex-col gap-5">
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
                    alt="Ảnh xem trước"
                    className="w-full h-full object-cover"
                    onError={e => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                )}

                {/* Overlay */}
                <div
                  className={cn(
                    'absolute inset-0 flex flex-col items-center justify-center gap-1.5 transition-all',
                    uploadingImage
                      ? 'bg-background/70'
                      : form.imageUrl
                        ? 'opacity-0 hover:opacity-100 bg-black/50 text-white'
                        : 'text-muted-foreground'
                  )}
                >
                  {uploadingImage ? (
                    <>
                      <div className="h-7 w-7 -2 -primary/30 shadow-md border-0 border-t-0-primary rounded-full animate-spin" />
                      <p className="text-xs font-medium text-foreground">Đang tải lên...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="h-7 w-7 opacity-70" />
                      <p className="text-xs font-semibold">{form.imageUrl ? 'Bấm để thay đổi' : 'Bấm để tải lên'}</p>
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
                  Hoặc dán URL ảnh
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
                  form.isPublished ? 'border-primary/30 bg-primary/5' : 'border-transparent bg-muted/20'
                )}
                onClick={() => f('isPublished', !form.isPublished)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className={cn('font-semibold text-sm', form.isPublished ? 'text-primary' : '')}>
                      {form.isPublished ? 'Đã xuất bản' : 'Bản nháp'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {form.isPublished ? 'Hiển thị cho học viên' : 'Ẩn với học viên'}
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
                  Tiêu đề <span className="text-destructive text-xs">*</span>
                </Label>
                <Input
                  placeholder="VD: Khóa học phát triển web toàn diện 2026"
                  value={form.title}
                  onChange={e => f('title', e.target.value)}
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label className="font-semibold">Mô tả</Label>
                <textarea
                  className="w-full rounded-lg -input bg-transparent px-3 py-2 text-sm shadow-md border-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[110px] resize-none custom-scrollbar"
                  placeholder="Học viên sẽ học được gì trong khóa học này?"
                  value={form.description}
                  onChange={e => f('description', e.target.value)}
                />
              </div>

              {/* Category + Instructor */}
              <div className={cn('grid gap-4', isAdmin ? 'grid-cols-2' : 'grid-cols-1')}>
                <div className="space-y-1.5">
                  <Label className="font-semibold">Danh mục</Label>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger
                      role="combobox"
                      disabled={loadingDropdowns}
                      className="h-9 w-full flex items-center justify-between gap-2 rounded-lg -input bg-transparent px-3 text-sm hover:bg-muted/40 transition-all disabled:opacity-50"
                    >
                      {selectedCategoryName ? (
                        <span>{selectedCategoryName}</span>
                      ) : (
                        <span className="text-muted-foreground">
                          {loadingDropdowns ? 'Đang tải...' : 'Chọn danh mục'}
                        </span>
                      )}
                      <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                    </PopoverTrigger>
                    <PopoverContent style={{ width: 'var(--anchor-width)' }} className="p-0">
                      <Command shouldFilter={false}>
                        <CommandInput
                          placeholder="Tìm danh mục..."
                          value={categorySearch}
                          onValueChange={setCategorySearch}
                        />
                        <CommandList>
                          <CommandEmpty>Không tìm thấy danh mục.</CommandEmpty>
                          <CommandGroup>
                            {categories.map(c => (
                              <CommandItem
                                key={c.id}
                                value={c.id}
                                onSelect={() => {
                                  f('categoryId', c.id)
                                  setSelectedCategoryName(c.name)
                                  setCategoryOpen(false)
                                }}
                              >
                                <Check
                                  className={cn('mr-2 h-4 w-4', form.categoryId === c.id ? 'opacity-100' : 'opacity-0')}
                                />
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
                    <Label className="font-semibold">Giảng viên</Label>
                    <Popover open={instructorOpen} onOpenChange={setInstructorOpen}>
                      <PopoverTrigger
                        role="combobox"
                        disabled={loadingDropdowns}
                        className="h-9 w-full flex items-center justify-between gap-2 rounded-lg -input bg-transparent px-3 text-sm hover:bg-muted/40 transition-all disabled:opacity-50"
                      >
                        {selectedInstructorName ? (
                          <span>{selectedInstructorName}</span>
                        ) : (
                          <span className="text-muted-foreground">
                            {loadingDropdowns ? 'Đang tải...' : 'Chọn giảng viên'}
                          </span>
                        )}
                        <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
                      </PopoverTrigger>
                      <PopoverContent style={{ width: 'var(--anchor-width)' }} className="p-0">
                        <Command shouldFilter={false}>
                          <CommandInput
                            placeholder="Tìm giảng viên..."
                            value={instructorSearch}
                            onValueChange={setInstructorSearch}
                          />
                          <CommandList>
                            <CommandEmpty>Không tìm thấy giảng viên.</CommandEmpty>
                            <CommandGroup>
                              {users.map(u => (
                                <CommandItem
                                  key={u.id}
                                  value={u.id}
                                  onSelect={() => {
                                    f('instructorId', u.id)
                                    setSelectedInstructorName(u.userName ?? u.email ?? '')
                                    setInstructorOpen(false)
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      form.instructorId === u.id ? 'opacity-100' : 'opacity-0'
                                    )}
                                  />
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
                <Label className="font-semibold">Giá</Label>
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
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                    VNĐ
                  </span>
                </div>
                {form.price === 0 && <p className="text-xs text-muted-foreground">Khóa học này sẽ miễn phí</p>}
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 shadow-md border-0 border-t-0 bg-muted/10 flex flex-row justify-end gap-3">
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 -2 -current/30 shadow-md border-0 border-t-0-current rounded-full animate-spin" />
                  Đang lưu...
                </span>
              ) : editing ? (
                'Cập nhật khóa học'
              ) : (
                'Tạo khóa học'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa khóa học?</AlertDialogTitle>
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
