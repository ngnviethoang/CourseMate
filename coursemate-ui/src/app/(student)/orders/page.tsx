'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ClipboardList, ChevronRight } from 'lucide-react'
import { studentService } from '@/lib/student-service'
import { OrderDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

const STATUS_MAP: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  'Pending': { label: 'Pending', variant: 'secondary' },
  'Paid': { label: 'Completed', variant: 'default' },
  'Failed': { label: 'Failed', variant: 'destructive' },
  'Refunded': { label: 'Refunded', variant: 'destructive' },
  'Draft': { label: 'Draft', variant: 'outline' }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<OrderDto | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    studentService
      .getOrders()
      .then(res => {
        setOrders(res.items || [])
        setLoading(false)
      })
      .catch(() => {
        toast.error('Failed to load orders')
        setLoading(false)
      })
  }, [])

  const openDetail = async (orderId: string) => {
    setLoadingDetail(true)
    try {
      const detail = await studentService.getOrderById(orderId)
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <ClipboardList className="h-7 w-7" />
          Order History
        </h1>
        <p className="text-muted-foreground mt-1">{orders.length} total orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <ClipboardList className="h-14 w-14 mx-auto mb-4 opacity-40" />
          <p className="text-xl font-medium">No orders yet</p>
          <p className="text-sm mt-2">Your completed purchases will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = STATUS_MAP[order.status] ?? { label: 'Unknown', variant: 'outline' }
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
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {loadingDetail ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            selected && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Order ID</span>
                  <span className="font-mono">#{selected.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={STATUS_MAP[selected.status]?.variant ?? 'outline'}>
                    {STATUS_MAP[selected.status]?.label ?? 'Unknown'}
                  </Badge>
                </div>
                <div className="border-t pt-4 space-y-3">
                  {(selected.items ?? []).map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.courseImageUrl || 'https://placehold.co/60x45?text=Course'}
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
                <div className="border-t pt-4 flex justify-between font-bold">
                  <span>Total</span>
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
