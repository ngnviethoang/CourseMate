'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ClipboardList,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Calendar,
  CreditCard,
  Package,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Loader2,
  ShoppingBag,
  ArrowRight
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { orderService } from '@/lib/order-service'
import { OrderDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<
  string,
  { label: string; icon: React.ElementType; bg: string; text: string; border: string }
> = {
  Draft: {
    label: 'Nháp',
    icon: FileText,
    bg: 'bg-gray-100 dark:bg-gray-800/40',
    text: 'text-gray-600 dark:text-gray-400',
    border: 'border-gray-200 dark:border-gray-700'
  },
  Submitted: {
    label: 'Chờ xác nhận',
    icon: Clock,
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800'
  },
  Completed: {
    label: 'Hoàn thành',
    icon: CheckCircle2,
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    text: 'text-emerald-700 dark:text-emerald-400',
    border: 'border-emerald-200 dark:border-emerald-800'
  },
  Cancelled: {
    label: 'Đã huỷ',
    icon: XCircle,
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800'
  }
}

const FALLBACK_STATUS = {
  label: 'Không xác định',
  icon: FileText,
  bg: 'bg-gray-100',
  text: 'text-gray-500',
  border: 'border-gray-200'
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function OrderSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map(i => (
        <div key={i} className="rounded-2xl border border-border/50 bg-card p-5 animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded-full" />
              <div className="h-3 w-24 bg-muted rounded-full" />
            </div>
            <div className="h-7 w-24 bg-muted rounded-full" />
          </div>
          <div className="flex gap-3">
            <div className="h-14 w-20 bg-muted rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-muted rounded-full" />
              <div className="h-3 w-1/2 bg-muted rounded-full" />
            </div>
            <div className="h-4 w-16 bg-muted rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Order Card ───────────────────────────────────────────────────────────────

function OrderCard({ order }: { order: OrderDto }) {
  const [expanded, setExpanded] = useState(false)
  const [detail, setDetail] = useState<OrderDto | null>(null)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const statusCfg = STATUS_CONFIG[String(order.status)] ?? FALLBACK_STATUS
  const StatusIcon = statusCfg.icon
  const isCompleted = String(order.status) === 'Completed'

  const handleToggle = async () => {
    if (!expanded && !detail) {
      setLoadingDetail(true)
      try {
        const data = await orderService.getById(order.id)
        setDetail(data)
      } catch {
        // handled by api-client
      } finally {
        setLoadingDetail(false)
      }
    }
    setExpanded(prev => !prev)
  }

  const items = detail?.items ?? order.items ?? []

  return (
    <div
      className={`rounded-2xl border bg-card overflow-hidden transition-shadow duration-200 ${
        expanded ? 'shadow-lg border-primary/20' : 'shadow-sm border-border/60 hover:shadow-md'
      }`}
    >
      {/* ── Header ── */}
      <button onClick={handleToggle} className="w-full text-left px-5 py-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          {/* Status icon circle */}
          <div
            className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${statusCfg.bg} ${statusCfg.border}`}
          >
            <StatusIcon className={`h-4 w-4 ${statusCfg.text}`} />
          </div>

          <div className="min-w-0">
            {/* Order ID + date */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm text-foreground">Đơn #{order.id.slice(0, 8).toUpperCase()}</span>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${statusCfg.bg} ${statusCfg.text}`}
              >
                <StatusIcon className="h-3 w-3" />
                {statusCfg.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {format(new Date(order.creationTime), 'd MMM yyyy, HH:mm', { locale: vi })}
              {order.lastModificationTime && (
                <span className="ml-1">
                  · Cập nhật {format(new Date(order.lastModificationTime), 'd MMM yyyy', { locale: vi })}
                </span>
              )}
            </p>

            {/* Item count preview */}
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <Package className="h-3 w-3" />
              {order.itemsCount != null ? order.itemsCount : items.length || '...'} khoá học
            </p>
          </div>
        </div>

        {/* Right: total + chevron */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Tổng tiền</p>
            <p className="text-base font-black text-primary">{formatCurrency(order.totalAmount)}</p>
          </div>
          <div className="text-muted-foreground">
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>
        </div>
      </button>

      {/* ── Expanded detail ── */}
      {expanded && (
        <div className="border-t border-border/50">
          {loadingDetail ? (
            <div className="flex items-center justify-center py-8 gap-2 text-muted-foreground text-sm">
              <Loader2 className="h-4 w-4 animate-spin" />
              Đang tải chi tiết...
            </div>
          ) : (
            <div className="px-5 py-4 space-y-4">
              {/* Course items */}
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Khoá học trong đơn
                </p>

                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">Không có sản phẩm</p>
                ) : (
                  <div className="space-y-2">
                    {items.map(item => (
                      <Link
                        key={item.id}
                        href={isCompleted ? `/learning/${item.courseId}` : `/courses/${item.courseId}`}
                        className="flex items-center gap-3 rounded-xl p-3 bg-muted/30 hover:bg-muted/60 transition-colors group"
                        onClick={e => e.stopPropagation()}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.courseImageUrl || `https://placehold.co/80x56/6366f1/ffffff?text=KH`}
                          alt={item.courseTitle}
                          className="h-14 w-20 object-cover rounded-lg flex-shrink-0 bg-muted"
                          onError={e => {
                            ;(e.target as HTMLImageElement).src = 'https://placehold.co/80x56/6366f1/ffffff?text=KH'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                            {item.courseTitle}
                          </p>
                          {isCompleted && (
                            <span className="text-[10px] font-medium text-emerald-600 flex items-center gap-1 mt-0.5">
                              <CheckCircle2 className="h-3 w-3" />
                              Nhấn để vào học
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-sm font-bold">{formatCurrency(item.price)}</span>
                          {isCompleted && (
                            <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Summary */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3.5 w-3.5" />
                    Phương thức: <span className="font-medium text-foreground ml-1">PayOS</span>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Mã đầy đủ: <span className="font-mono text-[11px] select-all">{order.id}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Tổng thanh toán</p>
                  <p className="text-xl font-black text-primary">{formatCurrency(order.totalAmount)}</p>
                </div>
              </div>

              {/* CTA for completed */}
              {isCompleted && items.length > 0 && (
                <Link
                  href={`/learning/${items[0].courseId}`}
                  onClick={e => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 w-full rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-700 hover:text-white font-semibold text-sm py-2.5 transition-all duration-200"
                >
                  <BookOpen className="h-4 w-4" />
                  Bắt đầu học ngay
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderDto[]>([])
  const [loading, setLoading] = useState(true)
  const [totalSpent, setTotalSpent] = useState(0)

  const fetchOrders = useCallback(async () => {
    try {
      const res = await orderService.list({ pageSize: 50, sorting: 'creationTime_desc' })
      const all = res.items || []
      setOrders(all)
      setTotalSpent(all.filter(o => String(o.status) === 'Completed').reduce((sum, o) => sum + o.totalAmount, 0))
    } catch {
      toast.error('Không thể tải danh sách đơn hàng.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const completedCount = orders.filter(o => String(o.status) === 'Completed').length
  const pendingCount = orders.filter(o => String(o.status) === 'Submitted').length

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-4xl px-6 mt-5">
        <div className="rounded-xl border border-border bg-card px-6 py-8 space-y-4">
          <div>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">Lịch sử đơn hàng</h1>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              {loading ? 'Đang tải...' : `${orders.length} đơn hàng`}
            </p>
          </div>
          {!loading && orders.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <span className="text-xs font-bold text-emerald-700">{completedCount}</span>
                <span className="text-xs text-muted-foreground">hoàn thành</span>
              </div>
              {pendingCount > 0 && (
                <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                  <span className="text-xs font-bold text-amber-700">{pendingCount}</span>
                  <span className="text-xs text-muted-foreground">chờ xác nhận</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 rounded-lg border border-border bg-muted/40 px-3 py-2">
                <span className="text-xs font-bold text-primary">{formatCurrency(totalSpent)}</span>
                <span className="text-xs text-muted-foreground">đã chi</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Content ── */}
      <div className="mx-auto max-w-4xl px-4 sm:px-5 py-6">
        {loading ? (
          <OrderSkeleton />
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 rounded-[2rem] border border-dashed border-border bg-card/50">
            <div className="h-20 w-20 rounded-full bg-muted/60 flex items-center justify-center">
              <ClipboardList className="h-9 w-9 text-muted-foreground/50" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xl font-bold text-foreground">Chưa có đơn hàng</p>
              <p className="text-sm text-muted-foreground">Các đơn mua khoá học của bạn sẽ xuất hiện tại đây.</p>
            </div>
            <Link
              href="/"
              className="mt-2 flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all"
            >
              <BookOpen className="h-4 w-4" />
              Khám phá khoá học
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Status filter pills */}
            <div className="flex gap-2 flex-wrap pb-1">
              {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
                const count = orders.filter(o => String(o.status) === key).length
                if (count === 0) return null
                const Icon = cfg.icon
                return (
                  <span
                    key={key}
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                  >
                    <Icon className="h-3 w-3" />
                    {cfg.label} · {count}
                  </span>
                )
              })}
            </div>

            {/* Order cards */}
            {orders.map((order, idx) => (
              <div
                key={order.id}
                style={{ animationDelay: `${Math.min(idx * 50, 400)}ms` }}
                className="animate-in fade-in slide-in-from-bottom-2 fill-mode-backwards duration-500"
              >
                <OrderCard order={order} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
