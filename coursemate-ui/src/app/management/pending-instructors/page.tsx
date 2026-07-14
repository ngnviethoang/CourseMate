'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search, UserCheck, Clock, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { userService } from '@/lib/user-service'
import type { UserDto } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatDate } from '@/lib/utils'

export default function PendingInstructorsPage() {
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const pageSize = 10

  const [allItems, setAllItems] = useState<UserDto[]>([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  const [approveId, setApproveId] = useState<string | null>(null)
  const [approving, setApproving] = useState(false)

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
      setAllItems(res.items)
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

  function handlePageChange(next: number) {
    if (next === pageIndex) return
    setPageIndex(next)
  }

  async function handleApprove() {
    if (!approveId) return
    setApproving(true)
    try {
      await userService.approveInstructor(approveId)
      toast.success('Đã duyệt giảng viên thành công.')
      setApproveId(null)
      load()
    } finally {
      setApproving(false)
    }
  }

  const pendingItems = allItems.filter(u => !u.isApproved)
  const approvedItems = allItems.filter(u => u.isApproved)

  const pendingColumns: Column<UserDto>[] = [
    { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
    {
      key: 'userName',
      header: 'Tên người dùng',
      sortKey: 'userName',
      render: row => row.userName ?? row.email ?? '—'
    },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Số điện thoại' },
    {
      key: 'creationTime',
      header: 'Ngày đăng ký',
      sortKey: 'creationTime',
      render: row => formatDate(row.creationTime)
    },
    {
      key: 'actions' as keyof UserDto,
      header: 'Thao tác',
      render: row => (
        <Button
          size="sm"
          className="gap-1 bg-green-600 hover:bg-green-700 text-white"
          onClick={e => {
            e.stopPropagation()
            setApproveId(row.id)
          }}
        >
          <UserCheck className="h-3.5 w-3.5" />
          Duyệt
        </Button>
      )
    }
  ]

  const approvedColumns: Column<UserDto>[] = [
    { key: 'id', header: 'ID', render: row => <span className="font-mono text-xs">{row.id}</span> },
    {
      key: 'userName',
      header: 'Tên người dùng',
      sortKey: 'userName',
      render: row => row.userName ?? row.email ?? '—'
    },
    { key: 'email', header: 'Email' },
    { key: 'phoneNumber', header: 'Số điện thoại' },
    {
      key: 'isLockedOut',
      header: 'Trạng thái',
      render: row =>
        row.isLockedOut ? (
          <Badge variant="destructive">Đã khóa</Badge>
        ) : (
          <Badge variant="default" className="bg-green-600">
            Hoạt động
          </Badge>
        )
    },
    {
      key: 'creationTime',
      header: 'Ngày duyệt',
      sortKey: 'creationTime',
      render: row => formatDate(row.creationTime)
    }
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Duyệt giảng viên</h1>
        <p className="text-sm text-muted-foreground">
          Xem xét và phê duyệt các tài khoản đăng ký làm giảng viên
        </p>
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

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Chờ duyệt
            {pendingItems.length > 0 && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1 text-xs">
                {pendingItems.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Đã duyệt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-4">
          <DataTable
            columns={pendingColumns}
            data={pendingItems}
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
        </TabsContent>

        <TabsContent value="approved" className="mt-4">
          <DataTable
            columns={approvedColumns}
            data={approvedItems}
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
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!approveId} onOpenChange={open => !open && setApproveId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Duyệt giảng viên?</AlertDialogTitle>
            <AlertDialogDescription>
              Sau khi duyệt, người dùng này sẽ có quyền tạo và quản lý khoá học trên hệ thống.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              className="bg-green-600 hover:bg-green-700"
              onClick={handleApprove}
              disabled={approving}
            >
              {approving ? 'Đang duyệt...' : 'Xác nhận duyệt'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
