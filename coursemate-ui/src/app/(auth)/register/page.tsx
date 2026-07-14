'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  GraduationCap,
  ArrowRight,
  Loader2,
  Lock,
  User,
  Mail,
  BookOpen,
  Briefcase,
  Info,
  Eye,
  EyeOff,
  ArrowLeft
} from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'
import { RegisterCommand, RegisterRole } from '@/lib/types'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<RegisterRole>(RegisterRole.Student)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const payload: RegisterCommand = {
      userName: formData.get('userName') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role
    }

    if (!payload.userName) {
      toast.error('Vui lòng nhập tên đăng nhập.')
      setIsLoading(false)
      return
    }
    if (!payload.email) {
      toast.error('Vui lòng nhập địa chỉ email.')
      setIsLoading(false)
      return
    }
    if (!payload.password) {
      toast.error('Vui lòng nhập mật khẩu.')
      setIsLoading(false)
      return
    }

    try {
      await authService.register(payload)
      if (payload.role === RegisterRole.Instructor) {
        toast.success('Đăng ký giảng viên thành công! Vui lòng kiểm tra email để xác thực tài khoản.', {
          duration: 5000
        })
      } else {
        toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản trước khi đăng nhập.', {
          duration: 5000
        })
      }
      router.push('/login')
    } catch {
      // api-client already shows the error toast
    } finally {
      setIsLoading(false)
    }
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
              <CardTitle className="text-2xl font-bold tracking-tight">Tạo tài khoản CourseMate</CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                Chọn vai trò và hoàn tất thông tin để bắt đầu.
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-5">
            <Tabs value={role} className="w-full" onValueChange={val => setRole(val as RegisterRole)}>
              <TabsList className="grid h-11 w-full grid-cols-2 items-stretch overflow-hidden rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800/70">
                <TabsTrigger
                  value={RegisterRole.Student}
                  className="h-full rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Học viên
                </TabsTrigger>
                <TabsTrigger
                  value={RegisterRole.Instructor}
                  className="h-full rounded-lg px-3 text-xs font-semibold data-[state=active]:shadow-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:outline-none"
                >
                  <Briefcase className="mr-2 h-4 w-4" />
                  Giảng viên
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} className="mt-4 space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="userName">Tên đăng nhập</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="userName"
                      name="userName"
                      placeholder="nguyenvana"
                      className="h-11 border-zinc-200/70 bg-background/70 pl-9 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Địa chỉ email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="example@email.com"
                      className="h-11 border-zinc-200/70 bg-background/70 pl-9 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      className="h-11 border-zinc-200/70 bg-background/70 pl-9 pr-10 transition focus-visible:ring-primary/35 dark:border-zinc-700/70"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
                      aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {role === RegisterRole.Instructor && (
                  <div className="flex items-start gap-2 rounded-lg border border-zinc-200/70 bg-zinc-50/70 p-3 text-xs text-muted-foreground dark:border-zinc-700/70 dark:bg-zinc-900/40">
                    <Info className="h-4 w-4 shrink-0 text-primary" />
                    <p>Tài khoản giảng viên cần được quản trị viên phê duyệt trước khi có thể tạo khóa học.</p>
                  </div>
                )}

                <Button
                  type="submit"
                  id="btn-register"
                  className="h-11 w-full font-semibold shadow-lg shadow-primary/25"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      {role === RegisterRole.Instructor ? 'Đăng ký giảng viên' : 'Tạo tài khoản'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </Tabs>

            <p className="text-center text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Đăng nhập tại đây
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
