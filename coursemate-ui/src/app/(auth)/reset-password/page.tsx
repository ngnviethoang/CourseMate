'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, ArrowRight, Loader2, Lock, Eye, EyeOff, CheckCircle2, XCircle } from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') ?? ''
  const token = searchParams.get('token') ?? ''

  const [isLoading, setIsLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const hasValidLink = Boolean(email && token)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string

    if (!newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới.')
      return
    }
    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự.')
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error('Mật khẩu xác nhận không khớp.')
      return
    }

    if (!email || !token) {
      toast.error('Liên kết đặt lại mật khẩu không hợp lệ.')
      return
    }

    setIsLoading(true)
    try {
      await authService.resetPassword({ email, token, newPassword })
      setDone(true)
      setTimeout(() => router.push('/login'), 3000)
    } catch {
      // api-client shows error toast
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full animate-in fade-in zoom-in-95 duration-500 border-zinc-200/70 bg-background/80 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800/80 dark:shadow-black/30">
      <CardHeader className="space-y-4 pb-3">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/20">
          <GraduationCap className="h-7 w-7" />
        </div>
        <div className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Thiết lập mật khẩu mới</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Nhập mật khẩu mới để hoàn tất quá trình đặt lại.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        {done ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center animate-in fade-in duration-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
              <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Đặt lại mật khẩu thành công!</p>
              <p className="text-sm text-muted-foreground">Bạn sẽ được chuyển về trang đăng nhập trong giây lát.</p>
            </div>
          </div>
        ) : !hasValidLink ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center animate-in fade-in duration-500">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <XCircle className="h-8 w-8 text-red-500 dark:text-red-400" />
            </div>
            <div className="space-y-2">
              <p className="font-semibold text-foreground">Liên kết không hợp lệ</p>
              <p className="text-sm text-muted-foreground">
                Liên kết đặt lại mật khẩu đã sai hoặc thiếu thông tin. Vui lòng yêu cầu lại.
              </p>
            </div>
            <div className="flex w-full gap-3 pt-1">
              <Button asChild variant="outline" className="w-1/2">
                <Link href="/login">Đăng nhập</Link>
              </Button>
              <Button asChild className="w-1/2">
                <Link href="/forgot-password">Yêu cầu lại</Link>
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Mật khẩu mới</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-11 border-zinc-200/70 bg-background/70 pl-9 pr-10 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground transition hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="h-11 border-zinc-200/70 bg-background/70 pl-9 pr-10 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-muted-foreground transition hover:text-foreground focus:outline-none"
                  aria-label={showConfirm ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                >
                  {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <p className="rounded-lg border border-zinc-200/70 bg-zinc-50/70 px-3 py-2 text-xs text-muted-foreground dark:border-zinc-700/70 dark:bg-zinc-900/40">
              Mật khẩu nên có ít nhất 6 ký tự và kết hợp chữ, số để tăng bảo mật.
            </p>

            <Button
              type="submit"
              id="btn-reset-password"
              className="group h-11 w-full font-semibold shadow-lg shadow-primary/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <>
                  Xác nhận đặt lại mật khẩu
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Quay lại đăng nhập
              </Link>
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 p-4 font-sans dark:bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.18),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(245,158,11,0.12),transparent_36%)]" />
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full border border-sky-300/40 bg-sky-200/20 blur-3xl dark:border-sky-700/30 dark:bg-sky-900/10" />
      <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full border border-amber-300/30 bg-amber-200/20 blur-3xl dark:border-amber-700/20 dark:bg-amber-900/10" />

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-lg items-center">
        <Suspense fallback={<div className="text-center text-muted-foreground">Đang tải...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  )
}
