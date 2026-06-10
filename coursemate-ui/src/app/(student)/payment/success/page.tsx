'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Badge } from '@/components/ui/badge'
import { getUserId } from '@/lib/auth-token.util'
import { orderService } from '@/lib/order-service'
import { CheckCircle2, Loader2 } from 'lucide-react'

type PaymentContext = {
  orderId: string
  paymentTransactionId: string
  courseId: string
}

export default function PaymentSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const finalizePayment = async () => {
      if (typeof window === 'undefined') return

      const storedContext = window.sessionStorage.getItem('payos_checkout_context')
      const paymentCode = searchParams.get('code')

      if (paymentCode !== '00') {
        window.sessionStorage.removeItem('payos_checkout_context')
        router.replace('/payment/cancel')
        return
      }

      if (!storedContext) {
        router.replace('/payment/cancel')
        return
      }

      const parsedContext = JSON.parse(storedContext) as PaymentContext
      const orderId = searchParams.get('orderId') || parsedContext.orderId
      const courseId = searchParams.get('courseId') || parsedContext.courseId
      const studentId = getUserId()

      if (!orderId || !parsedContext.paymentTransactionId || !studentId) {
        window.sessionStorage.removeItem('payos_checkout_context')
        router.replace('/payment/cancel')
        return
      }

      try {
        await orderService.fakePayOsIpn(orderId, studentId, parsedContext.paymentTransactionId)
        window.sessionStorage.removeItem('payos_checkout_context')
        router.replace(courseId ? `/courses/${courseId}` : '/my-courses')
      } catch {
        window.sessionStorage.removeItem('payos_checkout_context')
        router.replace('/payment/cancel')
      }
    }

    finalizePayment()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Premium Header — green/success variant */}
      <div className="mx-4 mt-4 overflow-hidden rounded-[1.5rem] border border-emerald-500/30 relative bg-gradient-to-b from-emerald-500/10 via-emerald-500/5 to-background shadow-sm animate-in fade-in duration-500">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5">
          <div className="mt-1">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 shadow-inner">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <Badge className="h-6 border-0 bg-emerald-500/10 px-2 text-[11px] text-emerald-700 hover:bg-emerald-500/20">
                Thanh toán thành công
              </Badge>
            </div>
            <h1 className="mt-1.5 text-lg font-black tracking-tight text-foreground">Xác nhận thanh toán</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Hệ thống đang cập nhật đơn hàng và sẽ chuyển bạn vào trang khóa học ngay sau đó.
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-5">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 overflow-hidden rounded-[1.5rem] border border-border/80 bg-card shadow-sm">
          <div className="flex min-h-[260px] flex-col items-center justify-center gap-5 p-8 text-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
              </div>
            </div>
            <div className="space-y-1.5">
              <p className="text-base font-semibold text-foreground">Đang xác nhận giao dịch</p>
              <p className="text-sm text-muted-foreground">
                Vui lòng chờ trong giây lát, hệ thống sẽ tự chuyển bạn tới khóa học.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
