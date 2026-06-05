'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Home, XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="flex min-h-[calc(100dvh-180px)] items-center justify-center px-4">
      <div className="relative w-full max-w-lg overflow-hidden rounded-[1.75rem] border-2 border-red-500/30 bg-card shadow-sm">
        <div className="relative p-8 sm:p-10">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-red-500/20 bg-red-500/10 text-red-600 shadow-inner">
            <XCircle className="h-10 w-10" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-red-600">Payment Cancelled</p>
            <h1 className="mt-3 text-2xl font-black tracking-tight text-foreground sm:text-3xl">Thanh toán đã hủy</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Giao dịch chưa được hoàn tất. Bạn có thể quay về trang chủ và thực hiện lại khi sẵn sàng.
            </p>
          </div>

          <div className="mt-8">
            <Button asChild className="h-11 w-full rounded-xl text-sm font-semibold shadow-sm">
              <Link href="/">
                <Home className="h-4 w-4" />
                Về trang chủ
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
