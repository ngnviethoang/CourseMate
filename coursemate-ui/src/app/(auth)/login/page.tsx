'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { GraduationCap, ArrowRight, Loader2, Lock, User, Eye, EyeOff } from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'
import { Roles } from '@/lib/consts'
import { decodeJwt, saveToken } from '@/lib/auth-token.util'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
        const roles = res.roles ?? []

        // Multi-role: save the no-role token and go to select-role
        if (roles.length > 1) {
          saveToken(res.accessToken)
          router.push('/select-role')
          return
        }

        // Single role: token already has the role embedded
        saveToken(res.accessToken)
        const payload = decodeJwt(res.accessToken)
        const role = payload.role as string

        toast.success('Đăng nhập thành công.')

        if (role === Roles.Student) {
          router.push('/')
        } else if (role === Roles.Admin || role === Roles.Instructor) {
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
            <p className="text-sm text-muted-foreground font-medium">Đăng nhập vào tài khoản của bạn</p>
          </div>
        </div>

        <Card className="shadow-2xl shadow-black/5 dark:shadow-black/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Đăng nhập</CardTitle>
            <CardDescription className="text-sm">Nhập thông tin đăng nhập để tiếp tục.</CardDescription>
          </CardHeader>
          <CardContent>
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
                    className="pl-9 bg-background/50 focus-visible:ring-primary/30 transition-shadow"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-primary hover:underline"
                    tabIndex={-1}
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
                    className="pl-9 pr-10 bg-background/50 focus-visible:ring-primary/30 transition-shadow"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                id="btn-login"
                className="w-full h-11 relative group overflow-hidden mt-6"
                disabled={isLoading}
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-all" />
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

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background/60 px-2 text-muted-foreground">Hoặc</span>
              </div>
            </div>

            <Button
              type="button"
              id="btn-google-login"
              variant="outline"
              className="w-full h-11 gap-3 font-medium bg-background/50 hover:bg-muted/50 transition-all"
              onClick={() => {
                window.location.href = `${API_BASE_URL}/api/auth/google-login`
              }}
              disabled={isLoading}
            >
              <GoogleIcon className="h-5 w-5" />
              Đăng nhập bằng Google
            </Button>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          &copy; {new Date().getFullYear()} CourseMate. All rights reserved.
        </p>
      </div>
    </div>
  )
}
