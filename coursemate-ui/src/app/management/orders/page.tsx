'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { orderService } from '@/lib/order-service'
import { getRoles } from '@/lib/auth-token.util'
import type { AdminOrderDto } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  Draft: { label: 'Nháp', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
  Pending: { label: 'Chờ thanh toán', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  Paid: { label: 'Đã thanh toán', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  Failed: { label: 'Thất bại', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  Refunded: { label: 'Đã hoàn tiền', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' }
}

const columns: Column<AdminOrderDto>[] = [
  {
    key: 'id',
    header: 'Mã đơn hàng',
    render: row => <span className="text-xs font-mono">{row.id.substring(0, 8)}...</span>
  },
  { key: 'studentName', header: 'Học viên' },
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
      const status = STATUS_MAP[row.status] || { label: 'Không xác định', color: 'bg-gray-100 text-gray-800' }
      return <Badge className={`${status.color} border-transparent shadow-none`}>{status.label}</Badge>
    }
  },
  {
    key: 'creationTime',
    header: 'Ngày tạo',
    render: row => new Date(row.creationTime).toLocaleDateString()
  }
]

export default function OrdersPage() {
  const router = useRouter()
  const [items, setItems] = useState<AdminOrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [sorting, setSorting] = useState('')
  const [pageIndex, setPageIndex] = useState(0)
  const [totalCount, setTotalCount] = useState(0)
  const pageSize = 10

  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<AdminOrderDto | null>(null)
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
      setItems(res.items as unknown as AdminOrderDto[])
      setTotalCount(res.totalCount)
    } finally {
      setLoading(false)
    }
  }, [filter, sorting, pageIndex])

  useEffect(() => {
    const t = setTimeout(load, 300)
    return () => clearTimeout(t)
  }, [load])

  function handleView(row: AdminOrderDto) {
    router.push(`/management/orders/${row.id}`)
  }

  function handleEdit(row: AdminOrderDto) {
    setEditing(row)
    setStatusVal(String(row.status))
    setDialogOpen(true)
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

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">
          {isAdmin ? 'Tất cả đơn hàng' : 'Doanh thu khóa học của tôi'}
        </h1>
        <p className="text-lg text-muted-foreground">
          {isAdmin
            ? 'Quản lý việc mua khóa học và ghi danh của học viên'
            : 'Theo dõi doanh thu và ghi danh học viên cho các khóa học của bạn'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-11 h-12 text-base rounded-xl -muted-foreground/20 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="Tìm theo tên hoặc email học viên..."
            value={filter}
            onChange={e => {
              setFilter(e.target.value)
              setPageIndex(0)
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl bg-card shadow-md border-0 shadow-xl shadow-foreground/5 overflow-hidden">
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          sorting={sorting}
          onSort={setSorting}
          onView={handleView}
          onEdit={isAdmin ? handleEdit : undefined}
          pagination={{
            pageIndex,
            pageSize,
            totalCount,
            onPageChange: setPageIndex
          }}
        />
      </div>

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
              Lưu ý: Chuyển trạng thái sang <strong>Đã thanh toán</strong> sẽ tự động ghi danh học viên vào các khóa học
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
