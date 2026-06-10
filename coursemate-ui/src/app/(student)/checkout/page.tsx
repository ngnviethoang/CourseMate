'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Wallet,
} from 'lucide-react'
import { orderService } from '@/lib/order-service'
import { CartDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Payment Methods ───────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    id: 'payos',
    label: 'PayOS',
    description: 'Thanh toán qua cổng PayOS',
    icon: CreditCard,
    badge: 'Phổ biến',
    badgeColor: 'bg-blue-100 text-blue-700',
    disabled: false
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: Smartphone,
    badge: null,
    badgeColor: '',
    disabled: true
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    description: 'Thanh toán qua tài khoản ngân hàng',
    icon: Building2,
    badge: null,
    badgeColor: '',
    disabled: true
  },
  {
    id: 'cod',
    label: 'Thanh toán học phí sau',
    description: 'Thanh toán sau khi đã truy cập khoá học',
    icon: Wallet,
    badge: null,
    badgeColor: '',
    disabled: true
  }
]

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CheckoutSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 animate-pulse">
      <div className="space-y-4 lg:col-span-3">
        <div className="h-5 w-32 rounded bg-muted" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 rounded-[1.25rem] bg-muted" />
        ))}
      </div>
      <div className="lg:col-span-2">
        <div className="h-72 rounded-[1.25rem] bg-muted" />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState('payos')
  const [placing, setPlacing] = useState(false)

  const [orderId, setOrderId] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const fetchCartAndCreateOrder = async () => {
      try {
        const res = await orderService.getCart()
        if (!active) return
        if (!res || res.items.length === 0) {
          router.replace('/cart')
          return
        }
        setCart(res)

        // Step 1: Tạo luôn order khi vào trang checkout
        const orderRes = await orderService.create({
          cartItemIds: res.items.map(item => item.id)
        })
        setOrderId(orderRes.id)
      } catch {
        if (active) router.replace('/cart')
      } finally {
        if (active) setLoading(false)
      }
    }
    fetchCartAndCreateOrder()
    return () => {
      active = false
    }
  }, [router])

  const handlePlaceOrder = async () => {
    if (!orderId || typeof window === 'undefined') return

    setPlacing(true)
    try {
      const origin = window.location.origin
      const primaryCourseId = items[0]?.courseId ?? ''
      const paymentRes = await orderService.createPaymentUrl({
        orderId,
        returnUrl: `${origin}/payment/success?orderId=${orderId}&courseId=${primaryCourseId}`,
        cancelUrl: `${origin}/payment/cancel?orderId=${orderId}&courseId=${primaryCourseId}`
      })
      if (!paymentRes.checkoutUrl) {
        throw new Error('Missing checkoutUrl')
      }
      window.sessionStorage.setItem(
        'payos_checkout_context',
        JSON.stringify({
          orderId,
          paymentTransactionId: paymentRes.paymentTransactionId,
          courseId: primaryCourseId
        })
      )
      window.location.assign(paymentRes.checkoutUrl)
    } catch (error) {
      console.error('Payment error:', error)
      toast.error('Có lỗi xảy ra trong quá trình thanh toán.')
    } finally {
      setPlacing(false)
    }
  }

  const items = cart?.items ?? []
  const total = cart?.totalPrice ?? 0

  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-4 mt-4 overflow-hidden rounded-[1.5rem] border border-border/80 bg-gradient-to-b from-primary/10 via-primary/5 to-background shadow-sm animate-in fade-in duration-500">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay lại giỏ hàng
          </Link>
          <div className="mt-3">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 shadow-inner">
                  <CreditCard className="h-3.5 w-3.5 text-primary" />
                </div>
                <Badge className="h-6 border-0 bg-primary/10 px-2 text-[11px] text-primary hover:bg-primary/20">
                  Thanh toán
                </Badge>
              </div>
              <h1 className="text-lg font-black tracking-tight text-foreground">Thanh toán của tôi</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5">
        {loading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-5 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="space-y-4 lg:col-span-3">
              <div>
                <h2 className="text-base font-bold">Phương thức thanh toán</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Hiện tại CourseMate hỗ trợ thanh toán trực tuyến qua PayOS.
                </p>
              </div>

              <div className="space-y-2.5">
                {PAYMENT_METHODS.map(method => {
                  const Icon = method.icon
                  const selected = selectedMethod === method.id
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => !method.disabled && setSelectedMethod(method.id)}
                      disabled={method.disabled}
                      className={`flex w-full items-center gap-3 rounded-[1.25rem] border p-3 text-left transition-all duration-150 ${
                        method.disabled
                          ? 'cursor-not-allowed border-border/60 bg-muted/30 opacity-60'
                          : selected
                            ? 'border-primary/40 bg-primary/5 shadow-sm'
                            : 'border-border/80 bg-card hover:bg-muted/30'
                      }`}
                    >
                      <div
                        className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors ${
                          selected && !method.disabled
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{method.label}</span>
                          {method.badge && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${method.badgeColor}`}>
                              {method.badge}
                            </span>
                          )}
                          {method.disabled && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                              Sắp hỗ trợ
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                      </div>
                      <div
                        className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full border transition-colors ${
                          selected && !method.disabled
                            ? 'border-primary bg-primary'
                            : 'border-muted-foreground/30 bg-background'
                        }`}
                      >
                        {selected && !method.disabled && <CheckCircle2 className="h-2.5 w-2.5 text-primary-foreground" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="sticky top-20 overflow-hidden rounded-[1.5rem] border border-border/80 bg-card shadow-sm">
                <div className="border-b border-border/50 bg-gradient-to-r from-primary/10 to-indigo-50/50 px-4 py-3">
                  <h2 className="text-sm font-semibold">Tóm tắt đơn hàng</h2>
                  <p className="mt-0.5 text-xs text-muted-foreground">{items.length} khoá học</p>
                </div>

                <div className="space-y-3 p-4">
                  <div className="max-h-48 space-y-2.5 overflow-y-auto pr-1">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 items-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.courseImageUrl || 'https://placehold.co/48x36/6366f1/fff?text=K'}
                          alt={item.courseTitle}
                          className="h-9 w-12 flex-shrink-0 rounded-md object-cover"
                          onError={e => {
                            ;(e.target as HTMLImageElement).src = 'https://placehold.co/48x36/6366f1/fff?text=K'
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-2 leading-snug">{item.courseTitle}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{item.instructorName}</p>
                        </div>
                        <span className="text-xs font-semibold flex-shrink-0">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giảm giá</span>
                      <span className="text-emerald-600">-0%</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">Tổng cộng</span>
                    <span className="text-lg font-bold text-primary">{formatCurrency(total)}</span>
                  </div>

                  <Button
                    className="h-10 w-full gap-2 rounded-lg text-sm font-semibold shadow-sm"
                    onClick={handlePlaceOrder}
                    disabled={placing || selectedMethod !== 'payos'}
                  >
                    {placing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Đang xử lý…
                      </>
                    ) : (
                      <>
                        Xác nhận đặt hàng
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
