'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { toast } from 'sonner'
import { userService } from '@/lib/user-service'
import type { UserDto, CreateUserRequest, UpdateUserRequest } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
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
import { formatDate } from '@/lib/utils'

const columns: Column<UserDto>[] = [
  { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
  { key: 'userName', header: 'Tên người dùng', sortKey: 'userName', render: row => row.userName ?? row.email ?? '—' },
  { key: 'email', header: 'Email' },
  { key: 'phoneNumber', header: 'Số điện thoại' },
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

const emptyCreate: CreateUserRequest = { userName: '', email: '', phoneNumber: '', password: '', role: 'Student' }
const emptyUpdate: UpdateUserRequest = { userName: '', email: '', phoneNumber: '' }

export default function UsersPage() {
  const [items, setItems] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [editing, setEditing] = useState<UserDto | null>(null)
  const [createForm, setCreateForm] = useState<CreateUserRequest>(emptyCreate)
  const [updateForm, setUpdateForm] = useState<UpdateUserRequest>(emptyUpdate)
  const [saving, setSaving] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.list({
        filter,
        pageIndex,
        pageSize,
        sorting
      })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, pageIndex, pageSize, sorting])

  useEffect(() => {
    setPageIndex(0)
  }, [filter, sorting])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function handlePageChange(nextPageIndex: number) {
    if (nextPageIndex === pageIndex) return
    setLoading(true)
    setPageIndex(nextPageIndex)
  }

  function openCreate() {
    setEditing(null)
    setCreateForm(emptyCreate)
    setDialogOpen(true)
  }
  function openEdit(row: UserDto) {
    setEditing(row)
    setUpdateForm({ userName: row.userName ?? '', email: row.email ?? '', phoneNumber: row.phoneNumber ?? '' })
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      if (editing) {
        await userService.update(editing.id, updateForm)
        toast.success('Đã cập nhật người dùng.')
      } else {
        await userService.create(createForm)
        toast.success('Đã tạo người dùng.')
      }
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    await userService.delete(deleteId)
    toast.success('Đã xóa người dùng.')
    setDeleteId(null)
    load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Người dùng</h1>
          <p className="text-sm text-muted-foreground">Quản lý người dùng hệ thống</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo người dùng
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm người dùng..."
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
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
          onPageChange: handlePageChange
        }}
      />

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Tên đăng nhập</Label>
              <Input
                value={editing ? updateForm.userName : createForm.userName}
                onChange={e =>
                  editing
                    ? setUpdateForm({ ...updateForm, userName: e.target.value })
                    : setCreateForm({ ...createForm, userName: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={editing ? updateForm.email : createForm.email}
                onChange={e =>
                  editing
                    ? setUpdateForm({ ...updateForm, email: e.target.value })
                    : setCreateForm({ ...createForm, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-1">
              <Label>Số điện thoại</Label>
              <Input
                value={editing ? updateForm.phoneNumber : createForm.phoneNumber}
                onChange={e =>
                  editing
                    ? setUpdateForm({ ...updateForm, phoneNumber: e.target.value })
                    : setCreateForm({ ...createForm, phoneNumber: e.target.value })
                }
              />
            </div>
            {!editing && (
              <>
                <div className="space-y-1">
                  <Label>Mật khẩu</Label>
                  <Input
                    type="password"
                    value={createForm.password}
                    onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label>Vai trò</Label>
                  <Select
                    value={createForm.role ?? 'Student'}
                    onValueChange={val => setCreateForm({ ...createForm, role: val || undefined })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn vai trò" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Student">Học viên</SelectItem>
                      <SelectItem value="Instructor">Giảng viên</SelectItem>
                      <SelectItem value="Admin">Quản trị viên</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa người dùng?</AlertDialogTitle>
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
