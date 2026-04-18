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
    profileService
      .getMe()
      .then(p => {
        setProfile(p)
        setForm({ userName: p.userName, email: p.email ?? '', phoneNumber: p.phoneNumber ?? '' })
      })
      .catch(() => toast.error('Failed to load profile.'))
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    try {
      await profileService.updateProfile(form)
      toast.success('Profile updated successfully.')
      setProfile(prev => (prev ? { ...prev, ...form } : prev))
    } catch {
      toast.error('Failed to update profile.')
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
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-muted-foreground">Manage your account information</p>
      </div>

      {/* Avatar + Roles */}
      <div className="flex items-center gap-4 rounded-xl border bg-card p-5 shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold shadow-inner">
          {profile?.userName?.slice(0, 2).toUpperCase() ?? 'U'}
        </div>
        <div>
          <p className="font-semibold text-lg">{profile?.userName}</p>
          <p className="text-sm text-muted-foreground">{profile?.email ?? 'No email'}</p>
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
      <div className="rounded-xl border bg-card p-5 shadow-sm space-y-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Edit Information</p>

        <div className="space-y-1">
          <Label className="flex items-center gap-2">
            <User className="h-3.5 w-3.5 text-muted-foreground" />
            Username
          </Label>
          <Input
            value={form.userName}
            onChange={e => setForm(prev => ({ ...prev, userName: e.target.value }))}
            placeholder="Username"
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
            Phone Number
          </Label>
          <Input
            value={form.phoneNumber ?? ''}
            onChange={e => setForm(prev => ({ ...prev, phoneNumber: e.target.value }))}
            placeholder="+84 xxx xxx xxx"
          />
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  )
}
