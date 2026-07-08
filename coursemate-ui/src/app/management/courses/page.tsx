'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { courseService } from '@/lib/course-service'
import { lookupService } from '@/lib/lookup-service'
import { getRole, getUserId } from '@/lib/auth-token.util'
import { fileService } from '@/lib/file-service'
import type { CourseDto, CreateCourseRequest, LookupItemDto } from '@/lib/types'
import { CourseFormDialog } from '@/components/admin/course-form-dialog'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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

const columns: Column<CourseDto>[] = [
  { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
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
  const [categoryFilterId, setCategoryFilterId] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<CourseDto | null>(null)
  const [form, setForm] = useState<CreateCourseRequest>(emptyForm)
  const [saving, setSaving] = useState(false)
  const [categoryLookups, setCategoryLookups] = useState<LookupItemDto[]>([])
  const [instructorLookups, setInstructorLookups] = useState<LookupItemDto[]>([])
  const [loadingDropdowns, setLoadingDropdowns] = useState(false)
  const [userRole, setUserRole] = useState<string[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const role = getRole()
    setUserRole(role ? [role] : [])
    setCurrentUserId(getUserId())
  }, [])

  const isAdmin = userRole.includes('Admin')
  const isInstructor = userRole.includes('Instructor') && !isAdmin
  const categoryItems: Array<{ label: string; value: string | null }> = [
    { label: 'Tất cả danh mục', value: null },
    ...categoryLookups.map(category => ({ value: category.id, label: category.value }))
  ]
  const courseCategoryItems: Array<{ label: string; value: string | null }> = [
    { label: 'Chọn danh mục', value: null },
    ...categoryLookups.map(category => ({ value: category.id, label: category.value }))
  ]
  const instructorItems: Array<{ label: string; value: string | null }> = [
    { label: 'Chọn giảng viên', value: null },
    ...instructorLookups.map(instructor => ({ value: instructor.id, label: instructor.value }))
  ]

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await courseService.list({
        filter,
        pageSize,
        pageIndex,
        sorting,
        categoryId: categoryFilterId || undefined
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, categoryFilterId, sorting, pageIndex])

  useEffect(() => {
    setPageIndex(0)
  }, [filter, categoryFilterId, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function handlePageChange(nextPageIndex: number) {
    if (nextPageIndex === pageIndex) return
    setLoading(true)
    setPageIndex(nextPageIndex)
  }

  function handleCategoryFilterChange(value: string | null) {
    const nextCategoryFilterId = value ?? ''
    if (nextCategoryFilterId === categoryFilterId) return
    setLoading(true)
    setCategoryFilterId(nextCategoryFilterId)
  }

  async function loadDropdowns() {
    setLoadingDropdowns(true)
    try {
      const [categories, instructors] = await Promise.all([
        lookupService.getCategoryLookups(),
        lookupService.getUserLookups(['Instructor', 'Admin'])
      ])
      setCategoryLookups(categories)
      setInstructorLookups(instructors)
    } finally {
      setLoadingDropdowns(false)
    }
  }

  useEffect(() => {
    loadDropdowns()
  }, [])

  async function openCreate() {
    setEditing(null)
    setForm({ ...emptyForm, instructorId: isInstructor ? (currentUserId ?? '') : '' })
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

  async function handleImageFile(file: File) {
    setUploadingImage(true)
    try {
      const result = await fileService.uploadFile(file)
      if (!result.fileUrl) {
        toast.error('Upload thành công nhưng chưa nhận được liên kết ảnh.')
        return
      }
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{isAdmin ? 'Tất cả khóa học' : 'Khóa học của tôi'}</h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin ? 'Quản lý toàn bộ khóa học trên nền tảng' : 'Quản lý khóa học và nội dung của bạn'}
          </p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo khóa học
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm khóa học theo tên hoặc danh mục..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <Select items={categoryItems} value={categoryFilterId || null} onValueChange={handleCategoryFilterChange}>
          <SelectTrigger className="h-10 min-w-[220px]">
            <SelectValue placeholder="Tất cả danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {categoryItems.map(item => (
                <SelectItem key={item.value ?? 'all-categories'} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

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
          onPageChange: handlePageChange
        }}
      />

      <CourseFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        isEditing={Boolean(editing)}
        form={form}
        isAdmin={isAdmin}
        loadingDropdowns={loadingDropdowns}
        uploadingImage={uploadingImage}
        saving={saving}
        categoryItems={courseCategoryItems}
        instructorItems={instructorItems}
        onFieldChange={f}
        onUploadImage={handleImageFile}
        onSave={handleSave}
      />

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
