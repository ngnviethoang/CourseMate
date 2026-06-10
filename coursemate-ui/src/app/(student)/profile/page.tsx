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
      {/* Premium Header */}
      <div className="mx-4 mt-6 rounded-[2rem] border border-border/80 relative bg-gradient-to-b from-primary/10 via-primary/5 to-background overflow-hidden shadow-sm animate-in fade-in duration-500">
        <div className="pointer-events-none absolute top-0 right-0 -translate-y-12 translate-x-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-6 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-inner ring-4 ring-background/60">
              <User className="h-12 w-12" />
            </div>
            <div className="text-center sm:text-left space-y-1">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight">{user.userName}</h1>
              <p className="text-muted-foreground text-sm font-medium flex items-center justify-center sm:justify-start gap-2">
                <Mail className="h-4 w-4" /> {user.email}
              </p>
              <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Học viên đang hoạt động
                </span>
              </div>
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
          <p className="text-xs text-muted-foreground opacity-50">Hồ sơ học viên CourseMate v1.0 • Đã xác thực bảo mật</p>
        </div>
      </div>
    </div>
  )
}
