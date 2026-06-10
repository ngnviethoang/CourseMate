'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Home, RotateCcw, XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background pb-10">
      {/* Premium Header — red/error variant */}
      <div className="mx-4 mt-4 overflow-hidden rounded-[1.5rem] border border-red-500/30 relative bg-gradient-to-b from-red-500/10 via-red-500/5 to-background shadow-sm animate-in fade-in duration-500">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-red-500/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-5">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay lại giỏ hàng
          </Link>
          <div className="mt-3">
            <div className="flex items-center gap-1.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 shadow-inner">
                <XCircle className="h-3.5 w-3.5 text-red-600" />
              </div>
              <Badge className="h-6 border-0 bg-red-500/10 px-2 text-[11px] text-red-700 hover:bg-red-500/20">
                Thanh toán thất bại
              </Badge>
            </div>
            <h1 className="mt-1.5 text-lg font-black tracking-tight text-foreground">Giao dịch đã hủy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-lg px-4 py-8 sm:px-5">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 overflow-hidden rounded-[1.5rem] border border-red-500/20 bg-card shadow-sm">
          <div className="p-8 sm:p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[1.5rem] border border-red-500/20 bg-red-500/10 text-red-600 shadow-inner">
              <XCircle className="h-10 w-10" />
            </div>

            <div className="mt-6 space-y-2">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-red-600">Payment Cancelled</p>
              <h2 className="text-2xl font-black tracking-tight text-foreground">Thanh toán đã hủy</h2>
              <p className="text-sm leading-6 text-muted-foreground">
                Giao dịch chưa được hoàn tất. Không có khoản nào bị trừ từ tài khoản của bạn.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="outline" className="flex-1 h-11 rounded-xl text-sm font-semibold">
                <Link href="/">
                  <Home className="h-4 w-4" />
                  Về trang chủ
                </Link>
              </Button>
              <Button asChild className="flex-1 h-11 rounded-xl text-sm font-semibold shadow-sm">
                <Link href="/cart">
                  <RotateCcw className="h-4 w-4" />
                  Thử lại
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
