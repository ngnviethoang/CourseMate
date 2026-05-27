'use client'

import { useMemo, useState } from 'react'
import type { CreateCategoryRequest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

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
    onFormChange(nextForm)
    if (Object.keys(nextErrors).length > 0) return
    onSave()
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) setErrors({})
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Chỉnh sửa danh mục' : 'Tạo danh mục mới'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1">
            <Label htmlFor="cat-name">Tên</Label>
            <Input
              id="cat-name"
              value={form.name}
              onChange={e => updateForm({ ...form, name: e.target.value })}
              aria-invalid={Boolean(errors.name)}
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>
          <div className="space-y-1">
            <Label htmlFor="cat-desc">Mô tả</Label>
            <Textarea
              id="cat-desc"
              className="min-h-24 max-h-48 resize-y overflow-y-auto"
              value={form.description}
              onChange={e => updateForm({ ...form, description: e.target.value })}
              aria-invalid={Boolean(errors.description)}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
          </div>
          <div className="flex items-center gap-3">
            <Switch
              id="cat-active"
              checked={form.isActive}
              onCheckedChange={v => updateForm({ ...form, isActive: v })}
            />
            <Label htmlFor="cat-active">Đang hoạt động</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSaveClick} disabled={saving || hasErrors}>
            {saving ? 'Đang lưu...' : 'Lưu'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
