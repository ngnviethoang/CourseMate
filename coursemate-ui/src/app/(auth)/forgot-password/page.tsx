'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, ArrowRight, Loader2, Mail, CheckCircle2 } from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const email = formData.get('email') as string

    if (!email) {
      toast.error('Vui lòng nhập địa chỉ email.')
      return
    }

    setIsLoading(true)
    try {
      await authService.forgotPassword({ email })
      setSent(true)
    } catch {
      // api-client shows error toast
    } finally {
      setIsLoading(false)
    }
  }

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
              <CardTitle className="text-2xl font-bold tracking-tight">Quên mật khẩu</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Nhập email để nhận liên kết đặt lại mật khẩu.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent>
            {sent ? (
              <div className="flex flex-col items-center gap-4 py-6 text-center animate-in fade-in duration-500">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                  <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">Email đã được gửi!</p>
                  <p className="text-sm text-muted-foreground">
                    Kiểm tra hộp thư và nhấn vào liên kết đặt lại mật khẩu. Liên kết hết hạn sau 1 giờ.
                  </p>
                </div>
                <Link href="/login" className="text-sm font-semibold text-primary hover:underline">
                  Quay lại đăng nhập
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">Địa chỉ email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      autoComplete="email"
                      className="h-11 border-zinc-200/70 bg-background/70 pl-9 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  id="btn-forgot-password"
                  className="h-11 w-full font-semibold shadow-lg shadow-primary/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Gửi liên kết đặt lại
                      <ArrowRight className="ml-2 h-4 w-4" />
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
      </div>
    </div>
  )
}
