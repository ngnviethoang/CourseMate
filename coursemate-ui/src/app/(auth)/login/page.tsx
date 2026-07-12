'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GraduationCap, ArrowRight, Loader2, Lock, User, Eye, EyeOff, BookOpen, Briefcase, ArrowLeft } from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'
import { Roles } from '@/lib/consts'
import { getRoles, saveToken } from '@/lib/auth-token.util'
import { RegisterRole } from '@/lib/types'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState<RegisterRole>(RegisterRole.Student)

  const nextParam = searchParams?.get('next') ?? ''
  const isSafeNext = (() => {
    if (!nextParam) return false
    try {
      const decoded = decodeURIComponent(nextParam)
      return decoded.startsWith('/') && !decoded.startsWith('//')
    } catch {
      return false
    }
  })()

  useEffect(() => {
    if (typeof window === 'undefined') return
    // If a freshly-redirected user landed here because their token expired, keep them informed
    if (nextParam) {
      toast.message('Phiên đã hết hạn — vui lòng đăng nhập lại để tiếp tục.')
    }
  }, [nextParam])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const userName = formData.get('userName') as string
    const password = formData.get('password') as string

    if (!userName) {
      toast.error('Vui lòng nhập tên đăng nhập hoặc email.')
      return
    }
    if (!password) {
      toast.error('Vui lòng nhập mật khẩu.')
      return
    }

    setIsLoading(true)
    try {
      const res = await authService.login({ userName, password })
      if (res?.accessToken) {
        saveToken(res.accessToken)
        const roles = getRoles(res.accessToken)

        toast.success('Đăng nhập thành công.')

        if (isSafeNext) {
          router.push(decodeURIComponent(nextParam))
        } else if (roles.includes(Roles.Admin) || roles.includes(Roles.Instructor)) {
          router.push('/management')
        } else {
          router.push('/')
        }
      } else {
        toast.error('Phản hồi từ máy chủ không hợp lệ.')
      }
    } catch {
      // api-client already shows the Vietnamese error toast from the server
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    const googleCallbackUrl = `${window.location.origin}/google-callback`
    window.location.assign(authService.getGoogleSignInUrl(googleCallbackUrl, role))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-100 p-4 font-sans dark:bg-zinc-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(14,165,233,0.18),transparent_36%),radial-gradient(circle_at_90%_0%,rgba(56,189,248,0.14),transparent_30%),radial-gradient(circle_at_50%_85%,rgba(245,158,11,0.12),transparent_36%)]" />
      <div className="absolute -left-20 top-20 h-64 w-64 rounded-full border border-sky-300/40 bg-sky-200/20 blur-3xl dark:border-sky-700/30 dark:bg-sky-900/10" />
      <div className="absolute -right-24 bottom-16 h-72 w-72 rounded-full border border-amber-300/30 bg-amber-200/20 blur-3xl dark:border-amber-700/20 dark:bg-amber-900/10" />

      <div className="absolute left-4 top-4 z-20 md:left-8 md:top-8">
        <Button variant="ghost" asChild className="hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Trang chủ
          </Link>
        </Button>
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-lg items-center">
        <Card className="w-full animate-in fade-in zoom-in-95 duration-500 border-zinc-200/70 bg-background/80 shadow-2xl shadow-zinc-900/10 backdrop-blur-xl dark:border-zinc-800/80 dark:shadow-black/30">
          <CardHeader className="space-y-4 pb-3">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 ring-1 ring-primary/20">
              <GraduationCap className="h-7 w-7" />
            </div>
            <div className="space-y-1 text-center">
              <CardTitle className="text-2xl font-bold tracking-tight">Đăng nhập CourseMate</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Tiếp tục hành trình học tập hoặc giảng dạy của bạn.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="space-y-2">
                <Label htmlFor="userName">Tên đăng nhập hoặc email</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="userName"
                    name="userName"
                    placeholder="Tên đăng nhập hoặc email"
                    autoComplete="username"
                    className="h-11 border-zinc-200/70 bg-background/70 pl-9 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 border-zinc-200/70 bg-background/70 pl-9 pr-10 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                id="btn-login"
                className="group h-11 w-full font-semibold shadow-lg shadow-primary/25"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </form>

            <div className="space-y-3 rounded-2xl border border-zinc-200/70 bg-zinc-50/70 p-3 dark:border-zinc-700/70 dark:bg-zinc-900/40">
              <div className="space-y-2">
                <Label>Vai trò khi đăng nhập Google</Label>
                <Tabs value={role} className="w-full" onValueChange={val => setRole(val as RegisterRole)}>
                  <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/70">
                    <TabsTrigger
                      value={RegisterRole.Student}
                      className="rounded-lg py-2 text-xs font-semibold data-[state=active]:shadow-sm"
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Học viên
                    </TabsTrigger>
                    <TabsTrigger
                      value={RegisterRole.Instructor}
                      className="rounded-lg py-2 text-xs font-semibold data-[state=active]:shadow-sm"
                    >
                      <Briefcase className="mr-2 h-4 w-4" />
                      Giảng viên
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-zinc-200/80 bg-background/90 font-semibold hover:bg-zinc-100/80 dark:border-zinc-700/80 dark:hover:bg-zinc-800/80"
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg aria-hidden="true" className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M21.805 10.023H12.24v3.955h5.487c-.237 1.273-.949 2.352-2.023 3.075v2.553h3.273c1.916-1.765 3.028-4.367 3.028-7.444 0-.716-.064-1.404-.18-2.139Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12.24 22c2.736 0 5.03-.907 6.705-2.394l-3.273-2.553c-.907.607-2.068.968-3.432.968-2.637 0-4.872-1.78-5.67-4.174H3.188v2.636A10.126 10.126 0 0 0 12.24 22Z"
                      fill="#34A853"
                    />
                    <path
                      d="M6.57 13.847A6.09 6.09 0 0 1 6.252 12c0-.642.11-1.266.318-1.847V7.517H3.188A10.126 10.126 0 0 0 2.16 12c0 1.63.39 3.173 1.028 4.483l3.382-2.636Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12.24 5.98c1.489 0 2.826.512 3.878 1.517l2.91-2.909C17.266 2.953 14.972 2 12.24 2A10.126 10.126 0 0 0 3.188 7.517l3.382 2.636c.798-2.394 3.033-4.173 5.67-4.173Z"
                      fill="#EA4335"
                    />
                  </svg>
                )}
                Tiếp tục với Google
              </Button>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
