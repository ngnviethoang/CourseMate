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
      <div className="mx-auto max-w-6xl px-6 mt-5">
        <div className="rounded-xl border border-border bg-card px-6 py-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            </div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Xác nhận thanh toán</h1>
              <Badge className="h-5 border-0 bg-emerald-100 text-emerald-700 text-[10px] px-1.5 dark:bg-emerald-900/40 dark:text-emerald-400">
                Thành công
              </Badge>
            </div>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Hệ thống đang cập nhật đơn hàng và sẽ chuyển bạn vào trang khóa học ngay sau đó.
          </p>
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
