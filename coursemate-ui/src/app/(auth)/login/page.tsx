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

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
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

  const handleGoogleLogin = () => {
    setIsGoogleLoading(true)
    window.location.assign(authService.getGoogleSignInUrl(window.location.origin))
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
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <Link href="/forgot-password" className="text-xs text-primary hover:underline" tabIndex={-1}>
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
                    disabled={isLoading || isGoogleLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground focus:outline-none"
                    aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
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
                variant="outline"
                className="w-full h-11 mt-4 bg-background/80"
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
              <Button
                type="submit"
                id="btn-login"
                className="w-full h-11 relative group overflow-hidden mt-6"
                disabled={isLoading || isGoogleLoading}
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

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Chưa có tài khoản?{' '}
              <Link href="/register" className="font-medium text-primary hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          &copy; {new Date().getFullYear()} CourseMate. Bảo lưu mọi quyền.
        </p>
      </div>
    </div>
  )
}
