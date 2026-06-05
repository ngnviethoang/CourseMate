'use client'

import { orderService } from '@/lib/order-service'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, ArrowRight, BookOpen, Sparkles, Loader2, Tag, Trophy } from 'lucide-react'
import { CartDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse mt-6">
      <div className="lg:col-span-2 space-y-4">
        {[1, 2].map(i => (
          <div
            key={i}
            className="flex flex-col sm:flex-row gap-4 rounded-[2rem] bg-card p-4 shadow-sm border border-border/50"
          >
            <div className="h-32 sm:w-48 flex-shrink-0 rounded-2xl bg-muted" />
            <div className="flex-1 space-y-3 py-2">
              <div className="h-5 w-3/4 rounded bg-muted" />
              <div className="h-4 w-1/2 rounded bg-muted" />
              <div className="h-6 w-1/4 rounded bg-muted mt-4" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1">
        <div className="rounded-[2rem] bg-card p-6 shadow-sm border border-border/50 space-y-4">
          <div className="h-6 w-1/2 rounded bg-muted" />
          <Separator className="my-4" />
          <div className="h-4 w-full rounded bg-muted" />
          <div className="h-4 w-full rounded bg-muted" />
          <Separator className="my-4" />
          <div className="h-6 w-full rounded bg-muted" />
          <div className="h-11 w-full rounded-xl bg-muted mt-4" />
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyCart() {
  const router = useRouter()
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 mt-6 bg-card border border-dashed rounded-[2rem] shadow-sm">
      <div className="relative mb-6">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted/50 text-muted-foreground">
          <ShoppingCart className="h-10 w-10" />
        </div>
      </div>
      <div className="text-center max-w-md space-y-3">
        <h2 className="text-2xl font-bold text-foreground">Giỏ hàng trống</h2>
        <p className="text-muted-foreground">
          Bạn chưa thêm khoá học nào vào giỏ hàng. Hãy khám phá hàng nghìn khoá học chất lượng để nâng tầm kiến thức!
        </p>
      </div>
      <Button
        size="lg"
        className="mt-8 rounded-full h-14 px-8 text-base shadow-lg shadow-primary/25"
        onClick={() => router.push('/')}
      >
        <BookOpen className="h-5 w-5 mr-2" />
        Khám phá khoá học ngay
      </Button>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CartPage() {
  const router = useRouter()
  const [cart, setCart] = useState<CartDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [removingId, setRemovingId] = useState<string | null>(null)

  const fetchCart = async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }
    try {
      const res = await orderService.getCart()
      setCart(res)
    } catch {
      setCart(null)
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }

  useEffect(() => {
    fetchCart()
  }, [])

  const handleRemove = async (cartItemId: string) => {
    if (!cart || removingId) {
      return
    }

    const previousCart = cart
    const nextItems = cart.items.filter(item => item.id !== cartItemId)
    const nextTotalPrice = nextItems.reduce((total, item) => total + item.price, 0)

    setRemovingId(cartItemId)
    setCart({
      ...cart,
      items: nextItems,
      totalPrice: nextTotalPrice
    })

    try {
      await orderService.removeFromCart(cartItemId)
      toast.success('Đã xoá khoá học khỏi giỏ hàng.')
    } catch {
      setCart(previousCart)
      // handled by api-client
    } finally {
      setRemovingId(null)
    }
  }

  const items = cart?.items ?? []

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Premium Header Container */}
      <div className="mx-4 mt-6 rounded-[2rem] border border-border/80 relative bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden shadow-sm">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-4 sm:px-5 lg:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3 text-foreground">
                <div className="h-8 w-8 bg-primary/10 rounded-xl flex items-center justify-center shadow-inner border border-primary/20">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                </div>
                Giỏ hàng của tôi
              </h1>
              <p className="text-muted-foreground text-sm ml-[44px] max-w-xl">
                {!loading &&
                  (items.length > 0
                    ? `Bạn có ${items.length} khoá học đang chờ thanh toán.`
                    : 'Hãy bắt đầu hành trình bằng việc thêm khoá học yêu thích.')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-5 lg:px-6">
        {loading ? (
          <CartSkeleton />
        ) : items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
            {/* ── Course list ── */}
            <div className="lg:col-span-2 flex flex-col">
              {items.map(item => (
                <div
                  key={item.id}
                  className="group flex flex-col sm:flex-row gap-4 py-4 border-b border-border/40 last:border-0 transition-colors hover:bg-muted/20 px-2 sm:px-4 rounded-xl"
                >
                  <Link href={`/courses/${item.courseId}`} className="flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.courseImageUrl || `https://placehold.co/200x140/6366f1/ffffff?text=Khoá+học`}
                      alt={item.courseTitle}
                      className="h-32 sm:h-24 w-full sm:w-36 rounded-xl object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => {
                        ;(e.target as HTMLImageElement).src = 'https://placehold.co/200x140/6366f1/ffffff?text=Khoá+học'
                      }}
                    />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between py-0.5">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <Link href={`/courses/${item.courseId}`}>
                          <h3 className="text-base font-bold leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                            {item.courseTitle}
                          </h3>
                        </Link>
                        <p className="mt-1 text-sm font-medium text-muted-foreground flex items-center gap-2">
                          <span className="flex h-5 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary px-2">
                            Giảng viên
                          </span>
                          {item.instructorName}
                        </p>
                        <Badge
                          variant="secondary"
                          className="mt-2 text-[10px] font-bold uppercase tracking-wider bg-muted/50 border-none gap-1.5 px-2 py-1"
                        >
                          <Tag className="h-3 w-3" /> Khoá học trực tuyến
                        </Badge>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-lg font-black text-primary">{formatCurrency(item.price)}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 gap-1.5 rounded-full transition-colors h-8"
                          onClick={() => handleRemove(item.id)}
                          disabled={removingId === item.id}
                        >
                          {removingId === item.id ? (
                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                          <span className="text-xs font-bold">Xoá</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Order Summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-[2rem] bg-card shadow-sm border border-border/80 overflow-hidden flex flex-col">
                {/* Summary header */}
                <div className="bg-gradient-to-r from-primary/10 to-indigo-50/50 px-5 py-4 border-b border-border/50">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-foreground tracking-tight">Tổng đơn hàng</h2>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  {/* Item breakdown */}
                  <div className="space-y-2">
                    {items.map(item => (
                      <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                        <span className="text-muted-foreground line-clamp-2 flex-1 leading-snug font-medium">
                          {item.courseTitle}
                        </span>
                        <span className="font-bold flex-shrink-0 text-foreground">{formatCurrency(item.price)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Tạm tính</span>
                      <span className="font-bold">{formatCurrency(cart?.totalPrice ?? 0)}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Giảm giá</span>
                      <span className="text-emerald-600 font-bold">-0%</span>
                    </div>
                  </div>

                  <Separator className="bg-border/60" />

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-black text-base text-foreground">Tổng cộng</span>
                    <span className="text-xl font-black text-primary">{formatCurrency(cart?.totalPrice ?? 0)}</span>
                  </div>

                  <Button
                    className="w-full h-10 rounded-lg gap-2 text-sm font-bold shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all mt-2"
                    onClick={() => router.push('/checkout')}
                  >
                    Tiến hành thanh toán
                    <ArrowRight className="h-4 w-4" />
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
