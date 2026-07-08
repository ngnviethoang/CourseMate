'use client'

import { useEffect, useState } from 'react'
import { User, Mail, Phone, Shield, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { profileService } from '@/lib/auth-service'
import type { ProfileDto, UpdateProfileRequest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<UpdateProfileRequest>({ userName: '', email: '', phoneNumber: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const p = await profileService.getMe()
        setProfile(p)
        setForm({ userName: p.userName, email: p.email ?? '', phoneNumber: p.phoneNumber ?? '' })
      } catch {
        toast.error('Không thể tải hồ sơ.')
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await profileService.updateProfile(form)
      toast.success('Cập nhật hồ sơ thành công.')
      setProfile(prev => (prev ? { ...prev, ...form } : prev))
    } catch {
      toast.error('Không thể cập nhật hồ sơ.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Hồ sơ</h1>
        <p className="text-sm text-muted-foreground">Quản lý thông tin tài khoản</p>
      </div>

      {/* Avatar + Roles */}
      <div className="flex items-center gap-4 rounded-xl bg-card p-5 shadow-md border-0">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-inner">
          {profile?.userName?.slice(0, 2).toUpperCase() ?? 'U'}
        </div>
        <div>
          <p className="font-semibold text-lg">{profile?.userName}</p>
          <p className="text-sm text-muted-foreground">{profile?.email ?? 'Chưa có email'}</p>
          <div className="flex gap-1.5 mt-1.5 flex-wrap">
            {profile?.roles.map(r => (
              <Badge key={r} variant="outline" className="text-xs capitalize gap-1">
                <Shield className="h-2.5 w-2.5" />
                {r}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="rounded-xl bg-card p-5 shadow-md border-0 space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Chỉnh sửa thông tin</p>

        <div className="space-y-1">
          <Label className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Tên đăng nhập
          </Label>
          <Input
            value={form.userName}
            onChange={e => setForm(prev => ({ ...prev, userName: e.target.value }))}
            placeholder="Tên đăng nhập"
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-muted-foreground" />
            Email
          </Label>
          <Input
            type="email"
            value={form.email ?? ''}
            onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-1">
          <Label className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground" />
            Số điện thoại
          </Label>
          <Input
            value={form.phoneNumber ?? ''}
            onChange={e => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="+84 xxx xxx xxx"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </div>
    </div>
  )
}
