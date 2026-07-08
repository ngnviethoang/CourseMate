'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GraduationCap, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth-service'

type Status = 'loading' | 'success' | 'error'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''
  const token = searchParams.get('token') ?? ''
  const hasValidLink = Boolean(userId && token)
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!hasValidLink) return

    authService
      .verifyEmail({ userId, token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [hasValidLink, token, userId])

  if (!hasValidLink) {
    return (
      <div className="flex flex-col items-center gap-6 py-8 text-center animate-in fade-in duration-500">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
        </div>
        <div className="space-y-2">
          <p className="font-semibold text-xl text-foreground">Liên kết không hợp lệ</p>
          <p className="text-sm text-muted-foreground">
            Thiếu thông tin xác thực email. Vui lòng kiểm tra lại email đã nhận.
          </p>
        </div>
        <Link
          href="/register"
          className="inline-flex items-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          Đăng ký lại
        </Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-6 py-8 text-center animate-in fade-in duration-500">
      {status === 'loading' && (
        <>
          <Loader2 className="h-14 w-14 text-primary animate-spin" />
          <div className="space-y-2">
            <p className="font-semibold text-lg text-foreground">Đang xác thực email...</p>
            <p className="text-sm text-muted-foreground">Vui lòng chờ trong giây lát.</p>
          </div>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
            <CheckCircle2 className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-xl text-foreground">Xác thực email thành công!</p>
            <p className="text-sm text-muted-foreground">
              Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center h-11 px-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
          >
            Đăng nhập ngay
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
            <XCircle className="h-10 w-10 text-red-500 dark:text-red-400" />
          </div>
          <div className="space-y-2">
            <p className="font-semibold text-xl text-foreground">Xác thực thất bại</p>
            <p className="text-sm text-muted-foreground">
              Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="inline-flex items-center h-10 px-6 rounded-lg border border-zinc-200/70 text-sm font-semibold hover:bg-zinc-100 transition-colors dark:border-zinc-700/70 dark:hover:bg-zinc-800/70"
            >
              Đăng ký lại
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Đăng nhập
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 p-4 font-sans dark:bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.18),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(245,158,11,0.12),transparent_36%)]" />
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full border border-sky-300/40 bg-sky-200/20 blur-3xl dark:border-sky-700/30 dark:bg-sky-900/10" />
      <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full border border-amber-300/30 bg-amber-200/20 blur-3xl dark:border-amber-700/20 dark:bg-amber-900/10" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-lg items-center">
        <Card className="w-full animate-in fade-in zoom-in-95 duration-500 border-zinc-200/70 bg-background/80 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800/80 dark:shadow-black/30">
          <CardHeader className="space-y-4 pb-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/20">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Xác thực địa chỉ email</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Chúng tôi đang kiểm tra liên kết xác thực tài khoản của bạn.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            <Suspense
              fallback={
                <div className="flex flex-col items-center gap-4 py-8">
                  <Loader2 className="h-10 w-10 text-primary animate-spin" />
                  <p className="text-sm text-muted-foreground">Đang tải...</p>
                </div>
              }
            >
              <VerifyEmailContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
