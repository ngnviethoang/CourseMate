'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search, CheckCircle, XCircle, Lock, Unlock } from 'lucide-react'
import { toast } from 'sonner'
import { userService } from '@/lib/user-service'
import type { UserDto, CreateUserRequest } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

const emptyCreate: CreateUserRequest = { userName: '', email: '', phoneNumber: '', password: '', role: 'Instructor' }

export default function InstructorsPage() {
  const [items, setItems] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10
  const [dialogOpen, setDialogOpen] = useState(false)
  const [createForm, setCreateForm] = useState<CreateUserRequest>(emptyCreate)
  const [saving, setSaving] = useState(false)

  const columns: Column<UserDto>[] = [
    { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
    { key: 'userName', header: 'Tên người dùng', sortKey: 'userName', render: row => row.userName ?? row.email ?? '—' },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Số điện thoại' },
    {
      key: 'isApproved',
      header: 'Trạng thái duyệt',
      render: row => row.isApproved ? <Badge variant="default" className="bg-green-600"><CheckCircle className="h-3 w-3 mr-1"/> Đã duyệt</Badge> : <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1"/> Chờ duyệt</Badge>
    },
    {
      key: 'isLockedOut',
      header: 'Trạng thái khóa',
      render: row => row.isLockedOut ? <Badge variant="destructive"><Lock className="h-3 w-3 mr-1"/> Đã khóa</Badge> : <Badge variant="outline"><Unlock className="h-3 w-3 mr-1"/> Hoạt động</Badge>
    },
    {
      key: 'creationTime',
      header: 'Ngày tạo',
      sortKey: 'creationTime',
      render: row => formatDate(row.creationTime)
    },
    {
      key: 'actions',
      header: 'Hành động',
      render: row => (
        <div className="flex gap-2">
          {!row.isApproved && (
            <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-50" onClick={() => handleApprove(row.id)}>
              Duyệt
            </Button>
          )}
          <Button size="sm" variant="outline" className={row.isLockedOut ? "text-blue-600" : "text-red-600"} onClick={() => handleToggleLock(row.id)}>
            {row.isLockedOut ? "Mở khóa" : "Khóa"}
          </Button>
        </div>
      )
    }
  ]

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await userService.list({
        filter,
        pageIndex,
        pageSize,
        sorting,
        role: 'Instructor'
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
    setCreateForm(emptyCreate)
    setDialogOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    try {
      await userService.create(createForm)
      toast.success('Đã tạo giảng viên. Tài khoản này đã được duyệt tự động.')
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleApprove(id: string) {
    try {
      await userService.approveInstructor(id)
      toast.success('Đã duyệt tài khoản giảng viên.')
      load()
    } catch (e) {
      toast.error('Lỗi khi duyệt tài khoản.')
    }
  }

  async function handleToggleLock(id: string) {
    try {
      await userService.toggleLock(id)
      toast.success('Đã thay đổi trạng thái khóa.')
      load()
    } catch (e) {
      toast.error('Lỗi khi thay đổi trạng thái khóa.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Giảng viên</h1>
          <p className="text-sm text-muted-foreground">Quản lý và duyệt tài khoản giảng viên</p>
        </div>
        <Button onClick={openCreate} className="gap-2">
          <Plus className="h-4 w-4" /> Tạo giảng viên
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm giảng viên..."
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
            <DialogTitle>Đăng ký hộ giảng viên</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label>Tên đăng nhập</Label>
              <Input
                value={createForm.userName}
                onChange={e => setCreateForm({ ...createForm, userName: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Email</Label>
              <Input
                type="email"
                value={createForm.email}
                onChange={e => setCreateForm({ ...createForm, email: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Số điện thoại</Label>
              <Input
                value={createForm.phoneNumber}
                onChange={e => setCreateForm({ ...createForm, phoneNumber: e.target.value })}
              />
            </div>
            <div className="space-y-1">
              <Label>Mật khẩu</Label>
              <Input
                type="password"
                value={createForm.password}
                onChange={e => setCreateForm({ ...createForm, password: e.target.value })}
              />
            </div>
            <p className="text-sm text-muted-foreground mt-2">Lưu ý: Giảng viên do Admin tạo sẽ được hệ thống duyệt tự động.</p>
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
    </div>
  )
}
