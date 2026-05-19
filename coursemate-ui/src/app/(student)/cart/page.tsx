'use client'

import { orderService } from '@/lib/order-service'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { ShoppingCart, Trash2, ArrowRight, BookOpen, Sparkles, Loader2, Tag } from 'lucide-react'
import { CartDto } from '@/lib/types'
import { toast } from 'sonner'
import { formatCurrency } from '@/lib/utils'

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function CartSkeleton() {
 return (
 <div className="grid md:grid-cols-3 gap-8 animate-pulse">
 <div className="md:col-span-2 space-y-4">
 {[1, 2].map(i => (
 <div key={i} className="flex gap-4 rounded-2xl bg-card p-4 shadow-md border-0">
 <div className="h-28 w-44 flex-shrink-0 rounded-xl bg-muted" />
 <div className="flex-1 space-y-3 py-1">
 <div className="h-4 w-3/4 rounded bg-muted" />
 <div className="h-3 w-1/2 rounded bg-muted" />
 <div className="h-4 w-1/4 rounded bg-muted" />
 </div>
 </div>
 ))}
 </div>
 <div className="md:col-span-1">
 <div className="rounded-2xl bg-card p-6 shadow-md border-0 space-y-4">
 <div className="h-5 w-1/2 rounded bg-muted" />
 <div className="h-3 w-full rounded bg-muted" />
 <div className="h-3 w-full rounded bg-muted" />
 <div className="h-10 w-full rounded-xl bg-muted" />
 </div>
 </div>
 </div>
 )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyCart() {
 const router = useRouter()
 return (
 <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
 <div className="relative">
 <div className="flex h-28 w-28 items-center justify-center rounded-full bg-primary/10">
 <ShoppingCart className="h-12 w-12 text-primary" />
 </div>
 <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full bg-muted -2 -background text-xs font-bold">
 0
 </div>
 </div>
 <div>
 <h2 className="text-2xl font-bold">Giỏ hàng trống</h2>
 <p className="mt-2 text-muted-foreground max-w-sm">
 Bạn chưa thêm khoá học nào vào giỏ hàng. Hãy khám phá hàng nghìn khoá học chất lượng!
 </p>
 </div>
 <Button size="lg" className="rounded-full gap-2 px-8" onClick={() => router.push('/')}>
 <BookOpen className="h-4 w-4" />
 Khám phá khoá học
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

 const fetchCart = async () => {
 setLoading(true)
 try {
 const res = await orderService.getCart()
 setCart(res)
 } catch {
 } finally {
 setLoading(false)
 }
 }

 useEffect(() => {
 fetchCart()
 }, [])

 const handleRemove = async (cartItemId: string) => {
 setRemovingId(cartItemId)
 try {
 await orderService.removeFromCart(cartItemId)
 toast.success('Đã xoá khoá học khỏi giỏ hàng.')
 fetchCart()
 } catch {
 // handled by api-client
 } finally {
 setRemovingId(null)
 }
 }

 const items = cart?.items ?? []

 return (
 <div className="min-h-screen bg-background">
 {/* Gradient header strip */}
 <div className="bg-gradient-to-br from-primary/8 via-background to-indigo-50 shadow-md border-0 border-b-0">
 <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
 <div className="flex items-center gap-3">
 <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
 <ShoppingCart className="h-5 w-5" />
 </div>
 <div>
 <h1 className="text-2xl font-bold tracking-tight">Giỏ hàng của tôi</h1>
 {!loading && (
 <p className="text-sm text-muted-foreground">
 {items.length > 0 ? `${items.length} khoá học đang chờ bạn` : 'Chưa có khoá học nào'}
 </p>
 )}
 </div>
 </div>
 </div>
 </div>

 <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
 {loading ? (
 <CartSkeleton />
 ) : items.length === 0 ? (
 <EmptyCart />
 ) : (
 <div className="grid md:grid-cols-3 gap-8">
 {/* ── Course list ── */}
 <div className="md:col-span-2 space-y-4">
 {items.map(item => (
 <div
 key={item.id}
 className="group flex flex-col sm:flex-row gap-4 rounded-2xl bg-card p-4 shadow-md border-0 shadow-xs transition-shadow hover:shadow-md"
 >
 <Link href={`/courses/${item.courseId}`} className="flex-shrink-0">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img
 src={item.courseImageUrl || `https://placehold.co/200x140/6366f1/ffffff?text=Khoá+học`}
 alt={item.courseTitle}
 className="h-32 w-full sm:w-44 rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
 onError={e => {
 ;(e.target as HTMLImageElement).src = 'https://placehold.co/200x140/6366f1/ffffff?text=Khoá+học'
 }}
 />
 </Link>

 <div className="flex flex-1 flex-col justify-between">
 <div>
 <Link href={`/courses/${item.courseId}`}>
 <h3 className="font-semibold leading-snug line-clamp-2 hover:text-primary transition-colors">
 {item.courseTitle}
 </h3>
 </Link>
 <p className="mt-1 text-sm text-muted-foreground">{item.instructorName}</p>
 <Badge variant="secondary" className="mt-2 text-xs gap-1">
 <Tag className="h-3 w-3" /> Khoá học trực tuyến
 </Badge>
 </div>

 <div className="mt-4 flex items-center justify-between">
 <span className="text-xl font-bold text-primary">{formatCurrency(item.price)}</span>
 <Button
 variant="ghost"
 size="sm"
 className="text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 rounded-full"
 onClick={() => handleRemove(item.id)}
 disabled={removingId === item.id}
 >
 {removingId === item.id ? (
 <Loader2 className="h-4 w-4 animate-spin" />
 ) : (
 <Trash2 className="h-4 w-4" />
 )}
 Xoá
 </Button>
 </div>
 </div>
 </div>
 ))}
 </div>

 {/* ── Order Summary ── */}
 <div className="md:col-span-1">
 <div className="sticky top-20 rounded-2xl bg-card shadow-md border-0 shadow-md border-0 overflow-hidden">
 {/* Summary header */}
 <div className="bg-gradient-to-r from-primary/10 to-indigo-50 px-6 py-4 shadow-md border-0 border-b-0">
 <div className="flex items-center gap-2">
 <Sparkles className="h-4 w-4 text-primary" />
 <h2 className="font-semibold">Tổng đơn hàng</h2>
 </div>
 </div>

 <div className="p-6 space-y-4">
 {/* Item breakdown */}
 <div className="space-y-2.5">
 {items.map(item => (
 <div key={item.id} className="flex items-start justify-between gap-2 text-sm">
 <span className="text-muted-foreground line-clamp-2 flex-1 leading-snug">
 {item.courseTitle}
 </span>
 <span className="font-medium flex-shrink-0">{formatCurrency(item.price)}</span>
 </div>
 ))}
 </div>

 <Separator />

 <div className="flex items-center justify-between">
 <span className="text-sm text-muted-foreground">Tạm tính</span>
 <span className="font-medium">{formatCurrency(cart?.totalPrice ?? 0)}</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-muted-foreground">Giảm giá</span>
 <span className="text-emerald-600 font-medium">{formatCurrency(0)}</span>
 </div>

 <Separator />

 <div className="flex items-center justify-between">
 <span className="font-bold text-lg">Tổng cộng</span>
 <span className="text-xl font-bold text-primary">{formatCurrency(cart?.totalPrice ?? 0)}</span>
 </div>

 <Button
 className="w-full h-11 rounded-xl gap-2 text-base font-semibold shadow-sm mt-2"
 onClick={() => router.push('/checkout')}
 >
 Tiến hành thanh toán
 <ArrowRight className="h-4 w-4" />
 </Button>

 <p className="text-center text-xs text-muted-foreground">🔒 Thanh toán an toàn & bảo mật</p>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>
 </div>
 )
}
