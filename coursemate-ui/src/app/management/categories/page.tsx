'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { categoryService } from '@/lib/admin-service'
import type { CategoryDto, CreateCategoryRequest } from '@/lib/types'
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

const columns: Column<CategoryDto>[] = [
  { key: 'name', header: 'Name', sortKey: 'name' },
  { key: 'description', header: 'Description' },
  {
    key: 'isActive',
    header: 'Status',
    render: row => (
      <Badge variant={row.isActive ? 'default' : 'secondary'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>
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

const emptyForm: CreateCategoryRequest = { name: '', description: '', isActive: true }

export default function CategoriesPage() {
  const [items, setItems] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime')
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize] = useState(10)
  const [totalCount, setTotalCount] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<CategoryDto | null>(null)
  const [form, setForm] = useState<CreateCategoryRequest>(emptyForm)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await categoryService.list({ filter, pageIndex, pageSize, sorting })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, pageIndex, pageSize, sorting])

  // Reset về trang đầu khi filter hoặc sorting thay đổi
  useEffect(() => {
    setPageIndex(0)
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

  function openEdit(row: CategoryDto) {
    setEditing(row)
    setForm({ name: row.name, description: row.description, isActive: row.isActive })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await categoryService.update(editing.id, form)
        toast.success('Category updated.')
      } else {
        await categoryService.create(form)
        toast.success('Category created.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await categoryService.delete(deleteId)
    toast.success('Category deleted.')
    setDeleteId(null)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage course categories</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> New Category
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search categories…"
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
        pagination={{
          pageIndex,
          pageSize,
          totalCount,
          onPageChange: setPageIndex
        }}
      />

      {/* Edit / Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Category' : 'New Category'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label htmlFor="cat-name">Name</Label>
              <Input id="cat-name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="cat-desc">Description</Label>
              <Input
                id="cat-desc"
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                id="cat-active"
                checked={form.isActive}
                onCheckedChange={v => setForm({ ...form, isActive: v })}
              />
              <Label htmlFor="cat-active">Active</Label>
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
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
