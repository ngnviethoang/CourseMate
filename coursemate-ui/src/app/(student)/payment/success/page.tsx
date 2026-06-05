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
      if (typeof window === 'undefined') {
        return
      }

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
        <div className="mx-4 mt-4 overflow-hidden rounded-[1.5rem] border border-border/80 bg-gradient-to-b from-blue-500/12 via-blue-500/5 to-background shadow-sm">
          <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5">
            <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-blue-500/20 bg-blue-500/10 shadow-inner">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
              </div>
              <Badge className="h-6 border-0 bg-blue-500/10 px-2 text-[11px] text-blue-700 hover:bg-blue-500/20">
                Thanh toán thành công
              </Badge>
            </div>
              <h1 className="text-lg font-black tracking-tight text-foreground">Thanh toán của tôi</h1>
              <p className="text-sm text-muted-foreground">
                Hệ thống đang cập nhật đơn hàng và sẽ chuyển bạn vào trang khóa học ngay sau đó.
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5">
          <div className="rounded-[1.5rem] border border-border/80 bg-card p-5 shadow-sm">
            <div className="flex min-h-[220px] flex-col items-center justify-center gap-4 rounded-[1.25rem] border border-dashed border-blue-500/20 bg-blue-500/5 p-6 text-center">
              <Loader2 className="h-9 w-9 animate-spin text-primary" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">Đang xác nhận giao dịch</p>
                <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát, hệ thống sẽ tự chuyển bạn tới khóa học.</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  )
}
