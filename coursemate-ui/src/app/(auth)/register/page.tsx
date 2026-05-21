'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
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
  EyeOff
} from 'lucide-react'
import { authService } from '@/lib/auth-service'
import { toast } from 'sonner'
import type { RegisterCommand } from '@/lib/types'

export default function RegisterPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<'Student' | 'Instructor'>('Student')
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
      if (payload.role === 'Instructor') {
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

  const FormFields = () => (
    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-2">
        <Label htmlFor="userName">Tên đăng nhập</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            id="userName"
            name="userName"
            placeholder="nguyenvana"
            className="pl-9 bg-background/50 focus-visible:ring-primary/30"
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
            className="pl-9 bg-background/50 focus-visible:ring-primary/30"
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
            className="pl-9 pr-10 bg-background/50 focus-visible:ring-primary/30"
            required
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
        id="btn-register"
        className="w-full h-11 relative group overflow-hidden mt-6"
        disabled={isLoading}
      >
        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] transition-all" />
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            {role === 'Instructor' ? 'Đăng ký giảng viên' : 'Tạo tài khoản'}
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
          </>
        )}
      </Button>

      {role === 'Instructor' && (
        <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/30 p-3 rounded-md mt-4">
          <Info className="w-4 h-4 shrink-0 text-primary" />
          <p>
            Tài khoản giảng viên cần được quản trị viên phê duyệt trước khi có thể bắt đầu tạo khóa học. Bạn sẽ nhận
            được thông báo sau khi được duyệt.
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Tham gia CourseMate</h1>
            <p className="text-sm text-muted-foreground font-medium">Bắt đầu học hoặc dạy ngay hôm nay</p>
          </div>
        </div>

        <Card className="shadow-2xl shadow-black/5 dark:shadow-black/20 bg-background/60 backdrop-blur-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-semibold">Tạo tài khoản</CardTitle>
            <CardDescription className="text-sm">Chọn vai trò và nhập thông tin để đăng ký.</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="Student"
              className="w-full"
              onValueChange={val => setRole(val as 'Student' | 'Instructor')}
            >
              <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 rounded-lg">
                <TabsTrigger value="Student" className="rounded-md transition-all data-[state=active]:shadow-sm">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Học sinh
                </TabsTrigger>
                <TabsTrigger value="Instructor" className="rounded-md transition-all data-[state=active]:shadow-sm">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Giảng viên
                </TabsTrigger>
              </TabsList>

              <form onSubmit={handleSubmit} noValidate>
                <FormFields />
              </form>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col items-center border-t pt-6 pb-6">
            <div className="text-sm text-muted-foreground">
              Đã có tài khoản?{' '}
              <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                Đăng nhập tại đây
              </Link>
            </div>
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          Khi đăng ký, bạn đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật của chúng tôi.
        </p>
      </div>
    </div>
  )
}
