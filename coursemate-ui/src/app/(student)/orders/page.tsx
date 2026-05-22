'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { orderService } from '@/lib/order-service'
import { OrderDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  Pending: { label: 'Chờ thanh toán', variant: 'secondary' },
  Paid: { label: 'Hoàn tất', variant: 'default' },
  Failed: { label: 'Thất bại', variant: 'destructive' },
  Refunded: { label: 'Đã hoàn tiền', variant: 'destructive' },
  Draft: { label: 'Nháp', variant: 'outline' }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<OrderDto | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await orderService.list()
        setOrders(res.items || [])
      } catch {
        toast.error('Không thể tải danh sách đơn hàng.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [])

  const openDetail = async (orderId: string) => {
    setLoadingDetail(true)
    try {
      const detail = await orderService.getById(orderId)
      setSelected(detail)
    } catch {
      // handled by api-client
    } finally {
      setLoadingDetail(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 shadow-md border-0 border-b-0-2 -primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-7 w-7" />
          Lịch sử đơn hàng
        </h1>
        <p className="text-muted-foreground mt-1">Tổng cộng {orders.length} đơn hàng</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ClipboardList className="h-14 w-14 mx-auto mb-4 opacity-40" />
          <p className="text-xl font-medium">Chưa có đơn hàng nào</p>
          <p className="text-sm mt-2">Các đơn mua hoàn tất của bạn sẽ hiển thị tại đây.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = STATUS_MAP[order.status] ?? { label: 'Không xác định', variant: 'outline' }
            return (
              <Card
                key={order.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => openDetail(order.id)}
              >
                <CardContent className="p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-muted-foreground">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <p className="text-lg font-bold text-primary">{formatCurrency(order.totalAmount)}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Chi tiết đơn hàng</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 shadow-md border-0 border-b-0-2 -primary"></div>
            </div>
          ) : (
            selected && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Mã đơn hàng</span>
                  <span className="font-mono">#{selected.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Trạng thái</span>
                  <Badge variant={STATUS_MAP[selected.status]?.variant ?? 'outline'}>
                    {STATUS_MAP[selected.status]?.label ?? 'Không xác định'}
                  </Badge>
                </div>
                <div className="shadow-md border-0 border-t-0 pt-4 space-y-3">
                  {(selected.items ?? []).map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.courseImageUrl || 'https://placehold.co/60x45?text=KhoaHoc'}
                        alt={item.courseTitle}
                        className="w-16 h-12 object-cover rounded-md bg-muted flex-shrink-0"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm line-clamp-1">{item.courseTitle}</p>
                      </div>
                      <span className="text-sm font-semibold flex-shrink-0">{formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="shadow-md border-0 border-t-0 pt-4 flex justify-between font-bold">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{formatCurrency(selected.totalAmount)}</span>
                </div>
              </div>
            )
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
