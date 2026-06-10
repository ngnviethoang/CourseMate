'use client'

import { useEffect, useState, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency, formatDate } from '@/lib/utils'
import { orderService } from '@/lib/order-service'
import { getRoles } from '@/lib/auth-token.util'
import type { OrderDto } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  Draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
  Submitted: { label: 'Chờ xác nhận', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  Completed: { label: 'Đã hoàn thành', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  Cancelled: { label: 'Đã huỷ', color: 'bg-red-100 text-red-800 hover:bg-red-200' }
}

const columns: Column<OrderDto>[] = [
  {
    key: 'id',
    header: 'ID',
    render: row => <span className="text-xs font-mono">{row.id}</span>
  },
  { key: 'title', header: 'Tiêu đề' },
  {
    key: 'studentName',
    header: 'Học viên',
    render: row => row.studentName ?? '—'
  },
  { key: 'studentEmail', header: 'Email' },
  {
    key: 'totalAmount',
    header: 'Tổng tiền',
    render: row => <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
  },
  {
    key: 'status',
    header: 'Trạng thái',
    render: row => {
      const status = STATUS_MAP[String(row.status)] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-800' }
      return <Badge className={`${status.color} border-transparent shadow-none`}>{status.label}</Badge>
    }
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

export default function OrdersPage() {
  const router = useRouter()
  const [items, setItems] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('creationTime_desc')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<OrderDto | null>(null)
  const [statusVal, setStatusVal] = useState<string>('Draft')
  const [saving, setSaving] = useState(false)
  const [userRole, setUserRole] = useState<string[]>([])

  useEffect(() => {
    setUserRole(getRoles())
  }, [])

  const isAdmin = userRole.includes('Admin')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await orderService.list({ filter, pageIndex, pageSize, sorting })
      setItems(res.items)
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, sorting, pageIndex])

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

  function handleView(row: OrderDto) {
    router.push(`/management/orders/${row.id}`)
  }

  function handleEdit(row: OrderDto) {
    setEditing(row)
    setStatusVal(String(row.status))
    setDialogOpen(true)
  }

  async function handleCreateDraft() {
    try {
      const result = await orderService.create({ cartItemIds: [] })
      toast.success('Đã tạo đơn hàng mới.')
      router.push(`/management/orders/${result.id}`)
    } catch {
      toast.error('Không thể tạo đơn hàng mới ở ngữ cảnh hiện tại.')
    }
  }

  async function handleSaveStatus() {
    if (!editing) return
    setSaving(true)
    try {
      await orderService.update(editing.id, { id: editing.id, status: statusVal })
      toast.success('Đã cập nhật trạng thái đơn hàng.')
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(orderId: string) {
    if (!isAdmin) return
    if (!confirm('Bạn có chắc chắn muốn xóa đơn hàng này?')) return

    const isLastItemOnPage = items.length === 1 && pageIndex > 0
    try {
      await orderService.delete(orderId)
      toast.success('Đã xóa đơn hàng.')
      if (isLastItemOnPage) {
        setPageIndex(prev => prev - 1)
      } else {
        load()
      }
    } catch {
      toast.error('Không thể xóa đơn hàng.')
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">
            {isAdmin ? 'Tất cả đơn hàng' : 'Doanh thu khóa học của tôi'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {isAdmin
              ? 'Quản lý việc mua khóa học và ghi danh của học viên'
              : 'Theo dõi doanh thu và ghi danh học viên cho các khóa học của bạn'}
          </p>
        </div>
        <Button onClick={handleCreateDraft} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo mới
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm flex-1 min-w-[220px]">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Tìm theo tên hoặc email học viên..."
            value={filter}
            onChange={e => {
              setFilter(e.target.value)
            }}
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={items}
        loading={loading}
        sorting={sorting}
        onSort={setSorting}
        onView={handleView}
        onEdit={isAdmin ? handleEdit : undefined}
        onDelete={isAdmin ? handleDelete : undefined}
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
            <DialogTitle>Cập nhật trạng thái đơn hàng</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Mã đơn hàng</Label>
              <div className="text-sm font-mono bg-muted p-2 rounded-md">{editing?.id}</div>
            </div>
            <div className="space-y-2">
              <Label>Trạng thái hiện tại</Label>
              <Select value={statusVal} onValueChange={val => val && setStatusVal(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(STATUS_MAP).map(([val, { label }]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              Lưu ý: Chuyển trạng thái sang <strong>Đã hoàn thành</strong> sẽ tự động ghi danh học viên vào các khóa học
              đã mua.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleSaveStatus} disabled={saving}>
              {saving ? 'Đang cập nhật...' : 'Cập nhật trạng thái'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
