'use client'

import { useEffect, useState, useCallback } from 'react'
import { CheckCircle, XCircle, Search } from 'lucide-react'
import { toast } from 'sonner'
// userService calls for pending instructors are stubbed -- see TODO comments below
import type { UserDto } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export default function PendingInstructorsPage() {
  const [items, setItems] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('')
  const [approveId, setApproveId] = useState<string | null>(null)
  const [rejectId, setRejectId] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      // TODO: pending-instructors endpoints have been removed in the resource-based
      // API refactor. Re-add GET/PUT /api/users/pending-instructors endpoints to
      // UserController and add Application handlers before re-enabling this.
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  async function handleApprove() {
    if (!approveId) return
    try {
      // TODO: re-enable when POST /api/users/pending-instructors/{id}/approve is added
      toast.error('API này hiện chưa khả dụng.')
    } catch {
      toast.error('Không thể duyệt giảng viên.')
    } finally {
      setApproveId(null)
    }
  }

  async function handleReject() {
    if (!rejectId) return
    try {
      // TODO: re-enable when POST /api/users/pending-instructors/{id}/reject is added
      toast.error('API này hiện chưa khả dụng.')
    } catch {
      toast.error('Không thể từ chối yêu cầu giảng viên.')
    } finally {
      setRejectId(null)
    }
  }

  const columns: Column<UserDto>[] = [
    { key: 'userName', header: 'Tên đăng nhập' },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Số điện thoại' },
    {
      key: 'id',
      header: 'Thao tác',
      render: row => (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="text-green-600 hover:text-green-700 hover:bg-green-50"
            onClick={() => setApproveId(row.id)}
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            Duyệt
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setRejectId(row.id)}
          >
            <XCircle className="w-4 h-4 mr-1" />
            Từ chối
          </Button>
        </div>
      )
    }
  ]

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Duyệt giảng viên</h1>
          <p className="text-sm text-muted-foreground">Xét duyệt người dùng đăng ký quyền giảng viên</p>
        </div>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Tìm giảng viên chờ duyệt..."
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />
      </div>

      <DataTable columns={columns} data={items} loading={loading} sorting={sorting} onSort={setSorting} />

      <AlertDialog open={!!approveId} onOpenChange={open => !open && setApproveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duyệt giảng viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Người dùng này sẽ được cấp vai trò Giảng viên và có quyền tạo khóa học.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleApprove}
            >
              Duyệt
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!rejectId} onOpenChange={open => !open && setRejectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Từ chối yêu cầu giảng viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Người dùng này sẽ giữ vai trò Học viên và không được cấp quyền Giảng viên.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleReject}
            >
              Từ chối
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
