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
  ShieldCheck,
  Loader2,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Building2,
  Wallet
} from 'lucide-react'
import { orderService } from '@/lib/order-service'
import { CartDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Payment Methods ───────────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  {
    id: 'vnpay',
    label: 'VNPay',
    description: 'Thanh toán qua cổng VNPay',
    icon: CreditCard,
    badge: 'Phổ biến',
    badgeColor: 'bg-blue-100 text-blue-700'
  },
  {
    id: 'momo',
    label: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    icon: Smartphone,
    badge: null,
    badgeColor: ''
  },
  {
    id: 'bank',
    label: 'Chuyển khoản ngân hàng',
    description: 'Thanh toán qua tài khoản ngân hàng',
    icon: Building2,
    badge: null,
    badgeColor: ''
  },
  {
    id: 'cod',
    label: 'Thanh toán học phí sau',
    description: 'Thanh toán sau khi đã truy cập khoá học',
    icon: Wallet,
    badge: null,
    badgeColor: ''
  }
]

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CheckoutSkeleton() {
  return (
    <div className="grid md:grid-cols-5 gap-8 animate-pulse">
      <div className="md:col-span-3 space-y-6">
        <div className="h-6 w-40 rounded bg-muted" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 rounded-2xl bg-muted" />
        ))}
      </div>
      <div className="md:col-span-2">
        <div className="rounded-2xl bg-muted h-80" />
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CheckoutPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedMethod, setSelectedMethod] = useState('vnpay')
  const [placing, setPlacing] = useState(false)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await orderService.getCart()
        if (!res || res.items.length === 0) {
          router.replace('/cart')
          return
        }
        setCart(res)
      } catch {
        router.replace('/cart')
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [router])

  const handlePlaceOrder = async () => {
    setPlacing(true)
    try {
      await orderService.create()
      toast.success('🎉 Đặt hàng thành công! Chúc bạn học vui.')
      router.push('/orders')
    } catch {
      // handled by api-client
    } finally {
      setPlacing(false)
    }
  }

  const items = cart?.items ?? []
  const total = cart?.totalPrice ?? 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header strip */}
      <div className="bg-gradient-to-br from-primary/8 via-background to-indigo-50 border-b">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" /> Quay lại giỏ hàng
          </Link>

          {/* Breadcrumb steps */}
          <div className="flex items-center gap-2 text-sm font-medium mt-2">
            <span className="text-muted-foreground">🛒 Giỏ hàng</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-primary font-semibold">💳 Thanh toán</span>
            <ArrowRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">✅ Hoàn tất</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {loading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="grid md:grid-cols-5 gap-8">
            {/* ── Left: Payment method selection ── */}
            <div className="md:col-span-3 space-y-6">
              <div>
                <h2 className="text-lg font-bold">Chọn phương thức thanh toán</h2>
                <p className="text-sm text-muted-foreground mt-0.5">Chọn hình thức thanh toán phù hợp với bạn</p>
              </div>

              <div className="space-y-3">
                {PAYMENT_METHODS.map(method => {
                  const Icon = method.icon
                  const selected = selectedMethod === method.id
                  return (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-150 ${
                        selected
                          ? 'border-primary bg-primary/5 shadow-sm'
                          : 'border-border bg-card hover:border-primary/30 hover:bg-muted/40'
                      }`}
                    >
                      <div
                        className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl transition-colors ${
                          selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{method.label}</span>
                          {method.badge && (
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${method.badgeColor}`}>
                              {method.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{method.description}</p>
                      </div>
                      <div
                        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                          selected ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                        }`}
                      >
                        {selected && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Security note */}
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 border border-emerald-100 p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold text-emerald-800">Giao dịch được bảo mật</p>
                  <p className="text-emerald-700 mt-0.5">
                    Thông tin thanh toán của bạn được mã hoá SSL 256-bit. Chúng tôi không lưu trữ thông tin thẻ của bạn.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Right: Order summary ── */}
            <div className="md:col-span-2">
              <div className="sticky top-20 rounded-2xl border bg-card shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-primary/10 to-indigo-50 px-5 py-4 border-b">
                  <h2 className="font-semibold">Tóm tắt đơn hàng</h2>
                  <p className="text-xs text-muted-foreground mt-0.5">{items.length} khoá học</p>
                </div>

                <div className="p-5 space-y-4">
                  {/* Course list */}
                  <div className="space-y-3 max-h-52 overflow-y-auto pr-1">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 items-start">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.courseImageUrl || 'https://placehold.co/48x36/6366f1/fff?text=K'}
                          alt={item.courseTitle}
                          className="h-10 w-14 rounded-lg object-cover flex-shrink-0"
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

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tạm tính</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Giảm giá</span>
                      <span className="text-emerald-600">{formatCurrency(0)}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="text-xl font-bold text-primary">{formatCurrency(total)}</span>
                  </div>

                  <Button
                    className="w-full h-11 rounded-xl gap-2 font-semibold shadow-sm"
                    onClick={handlePlaceOrder}
                    disabled={placing}
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

                  <div className="text-center">
                    <Badge variant="secondary" className="gap-1 text-[10px]">
                      <ShieldCheck className="h-3 w-3" />
                      Bảo mật SSL 256-bit
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
