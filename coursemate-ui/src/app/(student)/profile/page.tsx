'use client'

import { useEffect, useState } from 'react'
import { profileService } from '@/lib/auth-service'
import { ProfileDto } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Loader2, User, Mail, Shield, Key, Lock, CheckCircle2 } from 'lucide-react'

export default function StudentProfilePage() {
  const [user, setUser] = useState<ProfileDto | null>(null)
  const [loading, setLoading] = useState(true)

  // Change Password State
  const [cpDialogOpen, setCpDialogOpen] = useState(false)
  const [cpLoading, setCpLoading] = useState(false)
  const [cpForm, setCpForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await profileService.getMe()
        setUser(res)
      } catch {
        toast.error('Không thể tải hồ sơ.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cpForm.newPassword !== cpForm.confirmPassword) {
      return toast.error('Mật khẩu mới không khớp.')
    }
    if (cpForm.newPassword.length < 6) {
      return toast.error('Mật khẩu phải có ít nhất 6 ký tự.')
    }

    setCpLoading(true)
    try {
      await profileService.changePassword({ currentPassword: cpForm.oldPassword, newPassword: cpForm.newPassword })
      toast.success('Đổi mật khẩu thành công!')
      setCpDialogOpen(false)
      setCpForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch {
      // Error handled by api-client
    } finally {
      setCpLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
          <Loader2 className="h-8 w-8 animate-spin text-primary relative z-10" />
        </div>
      </div>
    )
  }

  if (!user) {
    return <div className="text-center py-20 text-muted-foreground">Không tìm thấy người dùng.</div>
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="mx-auto max-w-4xl px-6 mt-5">
        <div className="rounded-xl border border-border bg-card px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{user.userName}</h1>
              <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800">
                <CheckCircle2 className="h-3 w-3" /> Học viên đang hoạt động
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Account Details */}
          <Card className="border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md group animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Shield className="h-5 w-5 text-primary" /> Thông tin tài khoản
              </CardTitle>
              <CardDescription>Quản lý thông tin tài khoản và cài đặt bảo mật.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
              <div className="space-y-1 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Mã người dùng</Label>
                <p className="font-mono text-xs truncate opacity-70">{user.id}</p>
              </div>
              <div className="space-y-1 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Tên đăng nhập</Label>
                <p className="text-sm font-semibold">{user.userName}</p>
              </div>
              <div className="space-y-1 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
                <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Vai trò</Label>
                <p className="text-sm font-semibold capitalize">{user.roles?.[0] || 'Học viên'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Security & Password */}
          <Card
            className="border border-border/60 shadow-sm transition-all duration-300 hover:shadow-md overflow-hidden relative animate-in fade-in slide-in-from-bottom-4 duration-500"
            style={{ animationDelay: '100ms' }}
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Key className="h-24 w-24 rotate-12 text-foreground" />
            </div>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="h-5 w-5 text-amber-500" /> Bảo mật
              </CardTitle>
              <CardDescription>Bảo vệ tài khoản bằng cách quản lý mật khẩu.</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 pb-8">
              <div className="p-4 rounded-xl bg-muted/50 border border-border/50 space-y-4 shadow-inner">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Mật khẩu</span>
                  <span className="text-xs font-mono text-muted-foreground">••••••••••••</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Bạn nên dùng mật khẩu mạnh và không trùng với mật khẩu ở dịch vụ khác.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Dialog open={cpDialogOpen} onOpenChange={setCpDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full font-bold h-11 shadow-sm hover:-translate-y-0.5 transition-all">
                    Đổi mật khẩu
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[425px]">
                  <form onSubmit={handleChangePassword}>
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-primary" /> Đổi mật khẩu
                      </DialogTitle>
                      <DialogDescription>
                        Nhập mật khẩu hiện tại và mật khẩu mới để cập nhật bảo mật tài khoản.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-6">
                      <div className="space-y-2">
                        <Label htmlFor="old">Mật khẩu hiện tại</Label>
                        <Input
                          id="old"
                          type="password"
                          required
                          value={cpForm.oldPassword}
                          onChange={e => setCpForm(p => ({ ...p, oldPassword: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new">Mật khẩu mới</Label>
                        <Input
                          id="new"
                          type="password"
                          required
                          value={cpForm.newPassword}
                          onChange={e => setCpForm(p => ({ ...p, newPassword: e.target.value }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirm">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirm"
                          type="password"
                          required
                          value={cpForm.confirmPassword}
                          onChange={e => setCpForm(p => ({ ...p, confirmPassword: e.target.value }))}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit" disabled={cpLoading} className="w-full h-11 font-bold">
                        {cpLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Cập nhật mật khẩu
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        </div>

        <div className="flex items-center justify-center">
          <p className="text-xs text-muted-foreground opacity-50">
            Hồ sơ học viên CourseMate v1.0 • Đã xác thực bảo mật
          </p>
        </div>
      </div>
    </div>
  )
}
