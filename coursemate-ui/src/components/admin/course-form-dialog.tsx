'use client'

import { useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { Loader2, Upload } from 'lucide-react'
import type { CreateCourseRequest } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import 'react-quill-new/dist/quill.snow.css'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

interface SelectOption {
  label: string
  value: string | null
}

interface CourseFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  form: CreateCourseRequest
  isAdmin: boolean
  loadingDropdowns: boolean
  uploadingImage: boolean
  saving: boolean
  categoryItems: SelectOption[]
  instructorItems: SelectOption[]
  onFieldChange: (field: keyof CreateCourseRequest, value: unknown) => void
  onUploadImage: (file: File) => void
  onSave: () => void
}

interface CourseFormErrors {
  title?: string
  description?: string
  price?: string
  imageUrl?: string
  categoryId?: string
}

const GUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const EMPTY_GUID = '00000000-0000-0000-0000-000000000000'
const TITLE_MAX_LENGTH = 1024
const DESCRIPTION_MAX_LENGTH = 32768
const IMAGE_URL_MAX_LENGTH = 1024
const PRICE_MAX_VALUE = 2147483647
const EMPTY_QUILL_VALUES = new Set(['', '<p><br></p>', '<p></p>'])

function getRichTextPlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function validateCourseForm(form: CreateCourseRequest): CourseFormErrors {
  const errors: CourseFormErrors = {}
  const title = form.title.trim()
  const description = form.description.trim()
  const descriptionPlainText = getRichTextPlainText(description)
  const imageUrl = form.imageUrl.trim()
  const categoryId = form.categoryId.trim()

  if (!title) {
    errors.title = 'Tiêu đề là bắt buộc.'
  } else if (title.length > TITLE_MAX_LENGTH) {
    errors.title = `Tiêu đề tối đa ${TITLE_MAX_LENGTH} ký tự.`
  }

  if (!descriptionPlainText || EMPTY_QUILL_VALUES.has(description)) {
    errors.description = 'Mô tả là bắt buộc.'
  } else if (description.length > DESCRIPTION_MAX_LENGTH) {
    errors.description = `Mô tả tối đa ${DESCRIPTION_MAX_LENGTH} ký tự.`
  }

  if (!Number.isFinite(form.price) || form.price < 0 || form.price > PRICE_MAX_VALUE) {
    errors.price = 'Giá phải nằm trong khoảng từ 0 đến 2147483647.'
  }

  if (imageUrl.length > IMAGE_URL_MAX_LENGTH) {
    errors.imageUrl = `Link ảnh tối đa ${IMAGE_URL_MAX_LENGTH} ký tự.`
  }

  if (!categoryId) {
    errors.categoryId = 'Danh mục là bắt buộc.'
  } else if (!GUID_REGEX.test(categoryId) || categoryId.toLowerCase() === EMPTY_GUID) {
    errors.categoryId = 'Danh mục không hợp lệ.'
  }

  return errors
}

export function CourseFormDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  isAdmin,
  loadingDropdowns,
  uploadingImage,
  saving,
  categoryItems,
  instructorItems,
  onFieldChange,
  onUploadImage,
  onSave
}: CourseFormDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [errors, setErrors] = useState<CourseFormErrors>({})

  function setField<K extends keyof CreateCourseRequest>(field: K, value: CreateCourseRequest[K]) {
    onFieldChange(field, value)
    if (Object.keys(errors).length === 0) return
    const nextForm: CreateCourseRequest = { ...form, [field]: value }
    setErrors(validateCourseForm(nextForm))
  }

  function handleSaveClick() {
    const nextErrors = validateCourseForm(form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSave()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setErrors({})
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="!w-[50vw] max-w-none gap-0 overflow-hidden p-0 sm:!max-w-none">
        <div className="flex max-h-[88vh] min-h-0 flex-col">
          <DialogHeader className="shrink-0 border-b border-border/60 bg-muted/20 px-6 py-5 sm:px-8">
            <DialogTitle className="text-xl font-semibold sm:text-2xl">
              {isEditing ? 'Chỉnh sửa khóa học' : 'Tạo khóa học mới'}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {isEditing ? 'Cập nhật thông tin khóa học bên dưới' : 'Điền thông tin để xuất bản khóa học mới'}
            </p>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5 sm:px-8">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
                <section className="space-y-5 lg:col-span-4">
                  <div className="overflow-hidden rounded-xl border border-border/60 bg-muted/20">
                    <div className="relative aspect-video bg-muted/40">
                      {form.imageUrl ? (
                        <img
                          src={form.imageUrl}
                          alt="Ảnh khóa học"
                          className="h-full w-full object-cover"
                          onError={e => {
                            ;(e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          <Upload className="h-8 w-8 opacity-70" />
                        </div>
                      )}
                      {uploadingImage && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                          <Loader2 className="h-7 w-7 animate-spin text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-3 p-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full gap-2"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                      >
                        <Upload className="h-4 w-4" />
                        {form.imageUrl ? 'Thay đổi ảnh' : 'Tải ảnh lên'}
                      </Button>
                      {errors.imageUrl && <p className="text-xs text-destructive">{errors.imageUrl}</p>}
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) onUploadImage(file)
                      e.target.value = ''
                    }}
                  />
                </section>

                <section className="space-y-5 lg:col-span-8">
                  <div className="space-y-1.5">
                    <Label className="font-semibold">
                      Tiêu đề <span className="text-xs text-destructive">*</span>
                    </Label>
                    <Input
                      placeholder="VD: Khóa học phát triển web toàn diện 2026"
                      value={form.title}
                      onChange={e => setField('title', e.target.value)}
                      aria-invalid={Boolean(errors.title)}
                    />
                    {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
                  </div>

                  <div className={cn('grid gap-4', isAdmin ? 'grid-cols-2' : 'grid-cols-1')}>
                    <div className="space-y-1.5">
                      <Label className="font-semibold">Danh mục</Label>
                      <Select
                        items={categoryItems}
                        value={form.categoryId || null}
                        onValueChange={value => setField('categoryId', value ?? '')}
                      >
                        <SelectTrigger className="h-10 w-full" disabled={loadingDropdowns}>
                          <SelectValue placeholder={loadingDropdowns ? 'Đang tải...' : 'Chọn danh mục'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {categoryItems.map(item => (
                              <SelectItem key={item.value ?? 'empty-category'} value={item.value}>
                                {item.label}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {errors.categoryId && <p className="text-xs text-destructive">{errors.categoryId}</p>}
                    </div>

                    {isAdmin && (
                      <div className="space-y-1.5">
                        <Label className="font-semibold">Giảng viên</Label>
                        <Select
                          items={instructorItems}
                          value={form.instructorId || null}
                          onValueChange={value => setField('instructorId', value ?? '')}
                        >
                          <SelectTrigger className="h-10 w-full" disabled={loadingDropdowns}>
                            <SelectValue placeholder={loadingDropdowns ? 'Đang tải...' : 'Chọn giảng viên'} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {instructorItems.map(item => (
                                <SelectItem key={item.value ?? 'empty-instructor'} value={item.value}>
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="font-semibold">Giá</Label>
                      <div className="relative">
                        <Input
                          type="number"
                          min={0}
                          step={1000}
                          placeholder="0"
                          value={form.price}
                          onChange={e => setField('price', Number(e.target.value))}
                          className="pr-14"
                          aria-invalid={Boolean(errors.price)}
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-muted-foreground">
                          VNĐ
                        </span>
                      </div>
                      {errors.price && <p className="text-xs text-destructive">{errors.price}</p>}
                      {form.price === 0 && <p className="text-xs text-muted-foreground">Khóa học này sẽ miễn phí</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="font-semibold">Trạng thái khóa học</Label>
                      <div className="flex h-10 items-center justify-between rounded-md border border-border/60 bg-card px-3">
                        <span className="text-sm text-muted-foreground">
                          {form.isPublished ? 'Xuất bản' : 'Bản nháp'}
                        </span>
                        <Switch
                          checked={form.isPublished}
                          onCheckedChange={value => onFieldChange('isPublished', value)}
                        />
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <section className="space-y-1.5">
                <Label className="font-semibold">Mô tả</Label>
                <div className="overflow-hidden rounded-md border border-input bg-background [&_.ql-container]:min-h-[360px] [&_.ql-container]:border-0 [&_.ql-editor]:min-h-[320px] [&_.ql-toolbar]:border-0 [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-border/60">
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={value => setField('description', value)}
                    placeholder="Học viên sẽ học được gì trong khóa học này?"
                  />
                </div>
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </section>
            </div>
          </div>

          <div className="flex shrink-0 justify-end gap-3 border-t border-border/60 bg-background px-6 py-4 sm:px-8">
            <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={saving}>
              Hủy
            </Button>
            <Button onClick={handleSaveClick} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang lưu...
                </span>
              ) : isEditing ? (
                'Cập nhật khóa học'
              ) : (
                'Tạo khóa học'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
