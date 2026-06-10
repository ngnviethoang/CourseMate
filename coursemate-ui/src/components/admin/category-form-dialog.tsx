'use client'

import { useMemo, useState } from 'react'
import { Tag, FileText, CheckCircle2, XCircle, Loader2, Sparkles, FolderOpen } from 'lucide-react'
import type { CreateCategoryRequest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface CategoryFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  isEditing: boolean
  form: CreateCategoryRequest
  onFormChange: (nextForm: CreateCategoryRequest) => void
  saving: boolean
  onSave: () => void
}

interface CategoryFormErrors {
  name?: string
  description?: string
}

function validateCategoryForm(form: CreateCategoryRequest): CategoryFormErrors {
  const errors: CategoryFormErrors = {}
  const name = form.name.trim()
  const description = form.description.trim()

  if (!name) {
    errors.name = 'Tên danh mục là bắt buộc.'
  } else if (name.length < 2) {
    errors.name = 'Tên danh mục phải có ít nhất 2 ký tự.'
  } else if (name.length > 120) {
    errors.name = 'Tên danh mục tối đa 120 ký tự.'
  }

  if (!description) {
    errors.description = 'Mô tả là bắt buộc.'
  } else if (description.length > 1000) {
    errors.description = 'Mô tả tối đa 1000 ký tự.'
  }

  return errors
}

export function CategoryFormDialog({
  open,
  onOpenChange,
  isEditing,
  form,
  onFormChange,
  saving,
  onSave
}: CategoryFormDialogProps) {
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [touched, setTouched] = useState<{ name?: boolean; description?: boolean }>({})
  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors])

  function updateForm(nextForm: CreateCategoryRequest) {
    onFormChange(nextForm)
    setErrors(validateCategoryForm(nextForm))
  }

  function handleSaveClick() {
    const nextForm: CreateCategoryRequest = {
      ...form,
      name: form.name.trim(),
      description: form.description.trim()
    }
    const nextErrors = validateCategoryForm(nextForm)
    setErrors(nextErrors)
    setTouched({ name: true, description: true })
    onFormChange(nextForm)
    if (Object.keys(nextErrors).length > 0) return
    onSave()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setErrors({})
      setTouched({})
    }
    onOpenChange(nextOpen)
  }

  const nameLen = form.name.length
  const descLen = form.description.length

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="p-0 overflow-hidden max-w-lg border-0 shadow-2xl">
        {/* ── Gradient header ── */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/90 via-primary to-blue-600 px-6 pt-6 pb-8">
          {/* decorative circles */}
          <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-4 h-24 w-24 rounded-full bg-white/5 blur-xl" />

          <DialogHeader className="relative z-10 space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm ring-1 ring-white/30">
                {isEditing ? (
                  <FolderOpen className="h-5 w-5 text-white" />
                ) : (
                  <Sparkles className="h-5 w-5 text-white" />
                )}
              </div>
              <DialogTitle className="text-xl font-bold text-white">
                {isEditing ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}
              </DialogTitle>
            </div>
            <p className="text-sm text-white/70 pl-[52px]">
              {isEditing ? 'Cập nhật thông tin cho danh mục này' : 'Điền thông tin để thêm danh mục khóa học mới'}
            </p>
          </DialogHeader>
        </div>

        {/* ── Form body ── */}
        <div className="bg-card px-6 py-5 space-y-5">
          {/* Name field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="cat-name" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Tag className="h-3.5 w-3.5 text-primary" />
                Tên danh mục
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <span
                className={cn(
                  'text-xs tabular-nums transition-colors',
                  nameLen > 100 ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {nameLen}/120
              </span>
            </div>
            <div className="relative">
              <Input
                id="cat-name"
                placeholder="Ví dụ: Lập trình Web, Thiết kế đồ họa..."
                value={form.name}
                onChange={e => updateForm({ ...form, name: e.target.value })}
                onBlur={() => setTouched(t => ({ ...t, name: true }))}
                aria-invalid={Boolean(touched.name && errors.name)}
                className={cn(
                  'pr-9 transition-all focus-visible:ring-primary/50',
                  touched.name && errors.name
                    ? 'border-destructive focus-visible:ring-destructive/40'
                    : touched.name && !errors.name
                      ? 'border-green-500 focus-visible:ring-green-500/40'
                      : ''
                )}
              />
              {touched.name && (
                <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2">
                  {errors.name ? (
                    <XCircle className="h-4 w-4 text-destructive" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  )}
                </div>
              )}
            </div>
            {touched.name && errors.name && (
              <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-150">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="cat-desc" className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <FileText className="h-3.5 w-3.5 text-primary" />
                Mô tả
                <span className="text-destructive ml-0.5">*</span>
              </Label>
              <span
                className={cn(
                  'text-xs tabular-nums transition-colors',
                  descLen > 900 ? 'text-destructive' : 'text-muted-foreground'
                )}
              >
                {descLen}/1000
              </span>
            </div>
            <Textarea
              id="cat-desc"
              placeholder="Mô tả ngắn gọn về nội dung của danh mục này..."
              className={cn(
                'min-h-28 max-h-48 resize-y overflow-y-auto transition-all focus-visible:ring-primary/50',
                touched.description && errors.description
                  ? 'border-destructive focus-visible:ring-destructive/40'
                  : touched.description && !errors.description
                    ? 'border-green-500 focus-visible:ring-green-500/40'
                    : ''
              )}
              value={form.description}
              onChange={e => updateForm({ ...form, description: e.target.value })}
              onBlur={() => setTouched(t => ({ ...t, description: true }))}
              aria-invalid={Boolean(touched.description && errors.description)}
            />
            {touched.description && errors.description && (
              <p className="flex items-center gap-1 text-xs text-destructive animate-in fade-in slide-in-from-top-1 duration-150">
                {errors.description}
              </p>
            )}
          </div>

          {/* Active toggle */}
          <div className="flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3">
            <div className="space-y-0.5">
              <p className="text-sm font-semibold">Trạng thái hoạt động</p>
              <p className="text-xs text-muted-foreground">
                {form.isActive ? 'Danh mục đang hiển thị cho người dùng' : 'Danh mục đang bị ẩn khỏi hệ thống'}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  form.isActive ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'
                )}
              >
                {form.isActive ? 'Bật' : 'Tắt'}
              </span>
              <Switch
                id="cat-active"
                checked={form.isActive}
                onCheckedChange={v => updateForm({ ...form, isActive: v })}
              />
            </div>
          </div>

          {/* Footer buttons */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 h-10" onClick={() => handleOpenChange(false)} disabled={saving}>
              Hủy
            </Button>
            <Button
              className="flex-1 h-10 gap-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 shadow-md shadow-primary/25 transition-all"
              onClick={handleSaveClick}
              disabled={saving || (Object.keys(touched).length > 0 && hasErrors)}
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Đang lưu...
                </>
              ) : isEditing ? (
                'Cập nhật'
              ) : (
                'Tạo danh mục'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
