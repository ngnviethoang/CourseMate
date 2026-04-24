'use client'

import { useEffect, useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { orderService } from '@/lib/order-service'
import { getRole } from '@/lib/auth-token.util'
import type { AdminOrderDto } from '@/lib/types'
import { DataTable, type Column } from '@/components/admin/data-table'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  Draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800 hover:bg-gray-200' },
  Pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' },
  Paid: { label: 'Paid', color: 'bg-green-100 text-green-800 hover:bg-green-200' },
  Failed: { label: 'Failed', color: 'bg-red-100 text-red-800 hover:bg-red-200' },
  Refunded: { label: 'Refunded', color: 'bg-orange-100 text-orange-800 hover:bg-orange-200' }
}

const columns: Column<AdminOrderDto>[] = [
  {
    key: 'id',
    header: 'Order ID',
    render: row => <span className="text-xs font-mono">{row.id.substring(0, 8)}...</span>
  },
  { key: 'studentName', header: 'Student' },
  { key: 'studentEmail', header: 'Email' },
  {
    key: 'totalAmount',
    header: 'Total',
    render: row => <span className="font-medium">{formatCurrency(row.totalAmount)}</span>
  },
  {
    key: 'status',
    header: 'Status',
    render: row => {
      const status = STATUS_MAP[row.status] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' }
      return <Badge className={`${status.color} border-transparent shadow-none`}>{status.label}</Badge>
    }
  },
  {
    key: 'creationTime',
    header: 'Date',
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
    setUserRole(getRole())
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
      toast.success('Order status updated.')
      setDialogOpen(false)
      load()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-10 max-w-[1600px] mx-auto pb-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-bold tracking-tight">{isAdmin ? 'All Orders' : 'My Course Sales'}</h1>
        <p className="text-lg text-muted-foreground">
          {isAdmin
            ? 'Manage student course purchases and enrollments'
            : 'Monitor sales and student enrollments for your courses'}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-11 h-12 text-base rounded-xl border-muted-foreground/20 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            placeholder="Search by student name or email..."
            value={filter}
            onChange={e => {
              setFilter(e.target.value)
              setPageIndex(0)
            }}
          />
        </div>
      </div>

      <div className="rounded-2xl border bg-card shadow-xl shadow-foreground/5 overflow-hidden">
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
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Order ID</Label>
              <div className="text-sm font-mono bg-muted p-2 rounded-md">{editing?.id}</div>
            </div>
            <div className="space-y-2">
              <Label>Current Status</Label>
              <Select value={statusVal} onValueChange={val => val && setStatusVal(val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
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
              Note: Updating order status to <strong>Paid</strong> will automatically enroll the student into the
              purchased courses.
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} disabled={saving}>
              {saving ? 'Updating...' : 'Update Status'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
