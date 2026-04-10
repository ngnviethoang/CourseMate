'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Package, User, Calendar, CreditCard, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { orderService } from '@/lib/admin-service'
import type { AdminOrderDto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const STATUS_MAP: Record<string, { label: string; color: string; icon: any }> = {
  Draft: { label: 'Draft', color: 'bg-gray-100 text-gray-800', icon: Package },
  Pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Loader2 },
  Paid: { label: 'Paid', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  Failed: { label: 'Failed', color: 'bg-red-100 text-red-800', icon: XCircle },
  Refunded: { label: 'Refunded', color: 'bg-orange-100 text-orange-800', icon: Package }
}

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<AdminOrderDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [statusVal, setStatusVal] = useState<string>('Draft')
  const [saving, setSaving] = useState(false)

  const loadData = useCallback(async () => {
    if (!orderId) return
    setLoading(true)
    try {
      const data = await orderService.getById(orderId)
      setOrder(data)
    } catch (err: any) {
      toast.error('Failed to load order details')
      router.push('/management/orders')
    } finally {
      setLoading(false)
    }
  }, [orderId, router])

  useEffect(() => {
    loadData()
  }, [loadData])

  function handleOpenUpdate() {
    if (order) {
      setStatusVal(String(order.status))
      setDialogOpen(true)
    }
  }

  async function handleSaveStatus() {
    if (!order) return
    setSaving(true)
    try {
      await orderService.update(order.id, { id: order.id, status: statusVal })
      toast.success('Order status updated.')
      setDialogOpen(false)
      loadData()
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!order) return null

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP['Draft']
  const StatusIcon = statusInfo.icon

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.push('/management/orders')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Order Details</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            ID: <span className="font-mono">{order.id}</span>
          </p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Badge
            className={`${statusInfo.color} px-3 py-1 flex items-center gap-1.5 shadow-sm text-sm border-transparent`}
          >
            <StatusIcon className="h-4 w-4" />
            {statusInfo.label}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Order Items</CardTitle>
              <CardDescription>Courses included in this order</CardDescription>
            </CardHeader>
            <CardContent>
              {order.items && order.items.length > 0 ? (
                <div className="space-y-4">
                  {order.items.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3 mb-2 sm:mb-0">
                        <div className="bg-primary/10 p-2 rounded-md">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.courseTitle}</p>
                          <p className="text-xs text-muted-foreground font-mono mt-0.5">
                            Course ID: {item.courseId.substring(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="font-semibold text-foreground">{formatCurrency(item.price)}</div>
                    </div>
                  ))}
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center px-2">
                    <span className="font-medium text-muted-foreground">Total Amount</span>
                    <span className="font-bold text-xl text-primary">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-muted-foreground">No items found in this order.</div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Summary & Customer Info */}
        <div className="space-y-6">
          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                Customer Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Name</p>
                <p className="text-sm font-medium">{order.studentName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Email</p>
                <p className="text-sm font-medium">{order.studentEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Student ID</p>
                <p className="text-sm text-muted-foreground font-mono">{order.studentId}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border-border/50">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-muted-foreground" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Date Placed</p>
                  <p className="text-sm">{format(new Date(order.creationTime), 'MMM dd, yyyy HH:mm')}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Package className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase font-semibold">Items Count</p>
                  <p className="text-sm">
                    {order.itemsCount} {order.itemsCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Order Status History Note</p>
                <p className="text-xs text-muted-foreground">
                  Changing status to <strong>Paid</strong> will automatically enroll the student into all courses
                  associated with this order.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
