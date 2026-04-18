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
    profileService
      .getMe()
      .then(res => setUser(res))
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cpForm.newPassword !== cpForm.confirmPassword) {
      return toast.error('New passwords do not match.')
    }
    if (cpForm.newPassword.length < 6) {
      return toast.error('Password must be at least 6 characters.')
    }

    setCpLoading(true)
    try {
      await profileService.changePassword({ currentPassword: cpForm.oldPassword, newPassword: cpForm.newPassword })
      toast.success('Password changed successfully!')
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
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user) {
    return <div className="text-center py-20 text-muted-foreground">User not found.</div>
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row items-center gap-6 pb-8 border-b">
        <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-background shadow-xl ring-1 ring-primary/20">
          <User className="h-12 w-12" />
        </div>
        <div className="text-center md:text-left space-y-1">
          <h1 className="text-3xl font-black tracking-tight">{user.userName}</h1>
          <p className="text-muted-foreground font-medium flex items-center justify-center md:justify-start gap-2">
            <Mail className="h-4 w-4" /> {user.email}
          </p>
          <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
            <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" /> Active Student
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Account Details */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-card to-muted/30 overflow-hidden group">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="h-5 w-5 text-primary" /> Account Information
            </CardTitle>
            <CardDescription>Managed account details and security settings.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-1 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">User ID</Label>
              <p className="font-mono text-xs truncate opacity-70">{user.id}</p>
            </div>
            <div className="space-y-1 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Username</Label>
              <p className="text-sm font-semibold">{user.userName}</p>
            </div>
            <div className="space-y-1 p-3 rounded-xl bg-muted/50 group-hover:bg-muted transition-colors">
              <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Role</Label>
              <p className="text-sm font-semibold capitalize">{user.roles?.[0] || 'Student'}</p>
            </div>
          </CardContent>
          <CardFooter className="pt-2">
            <p className="text-xs text-muted-foreground italic">Registered since {new Date().toLocaleDateString()}</p>
          </CardFooter>
        </Card>

        {/* Security & Password */}
        <Card className="border-none shadow-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Key className="h-24 w-24 rotate-12" />
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-white">
              <Lock className="h-5 w-5 text-amber-400" /> Security
            </CardTitle>
            <CardDescription className="text-slate-400">
              Protect your account by managing your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4 pb-8">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-4 shadow-inner">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-300">Password</span>
                <span className="text-xs font-mono text-slate-500">••••••••••••</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                It's a good idea to use a strong password that you're not using elsewhere.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Dialog open={cpDialogOpen} onOpenChange={setCpDialogOpen}>
              <DialogTrigger>
                <div className="w-full bg-white text-slate-900 hover:bg-slate-200 font-bold h-11 inline-flex items-center justify-center rounded-lg">
                  Change Password
                </div>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleChangePassword}>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5 text-primary" /> Change Password
                    </DialogTitle>
                    <DialogDescription>
                      Enter your current password and your new password to update your account security.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-6">
                    <div className="space-y-2">
                      <Label htmlFor="old">Current Password</Label>
                      <Input
                        id="old"
                        type="password"
                        required
                        value={cpForm.oldPassword}
                        onChange={e => setCpForm(p => ({ ...p, oldPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new">New Password</Label>
                      <Input
                        id="new"
                        type="password"
                        required
                        value={cpForm.newPassword}
                        onChange={e => setCpForm(p => ({ ...p, newPassword: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm">Confirm New Password</Label>
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
                      Update Password
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>

      <div className="pt-12 flex items-center justify-center">
        <p className="text-xs text-muted-foreground opacity-50">CourseMate Student Profile v1.0 • Security Verified</p>
      </div>
    </div>
  )
}
