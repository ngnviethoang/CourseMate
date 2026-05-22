'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { GraduationCap, CheckCircle2, XCircle, Loader2 } from 'lucide-react'
import { authService } from '@/lib/auth-service'

type Status = 'loading' | 'success' | 'error'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId') ?? ''
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<Status>('loading')

  useEffect(() => {
    if (!userId || !token) {
      setStatus('error')
      return
    }

    authService
      .verifyEmail({ userId, token })
      .then(() => setStatus('success'))
      .catch(() => setStatus('error'))
  }, [userId, token])

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
            <p className="font-semibold text-xl text-foreground">Xác thực email thành công! 🎉</p>
            <p className="text-sm text-muted-foreground">
              Tài khoản của bạn đã được kích hoạt. Bạn có thể đăng nhập ngay bây giờ.
            </p>
          </div>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 h-11 px-8 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25"
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
              Liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui lòng đăng ký lại hoặc liên hệ hỗ trợ.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/register"
              className="inline-flex items-center h-10 px-6 rounded-lg border border-border text-sm font-medium hover:bg-muted transition-colors"
            >
              Đăng ký lại
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center h-10 px-6 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
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
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link
            href="/"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/20"
          >
            <GraduationCap className="h-7 w-7" />
          </Link>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">CourseMate</h1>
            <p className="text-sm text-muted-foreground font-medium">Xác thực địa chỉ email</p>
          </div>
        </div>

        <div className="rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 bg-background/60 backdrop-blur-xl p-8">
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
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          &copy; {new Date().getFullYear()} CourseMate. Bảo lưu mọi quyền.
        </p>
      </div>
    </div>
  )
}
