'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, Home, RotateCcw, XCircle } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-background pb-10">
      <div className="mx-auto max-w-6xl px-6 mt-5">
        <div className="rounded-xl border border-border bg-card px-6 py-8 space-y-3">
          <Link
            href="/cart"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Quay lại giỏ hàng
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-4 w-4 text-destructive" />
              </div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">Giao dịch đã hủy</h1>
                <Badge className="h-5 border-0 bg-destructive/10 text-destructive text-[10px] px-1.5">
                  Thanh toán thất bại
                </Badge>
              </div>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">Không có khoản nào bị trừ từ tài khoản của bạn.</p>
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
