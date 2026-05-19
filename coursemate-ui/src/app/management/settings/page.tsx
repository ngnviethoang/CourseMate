'use client'

import { useState } from 'react'
import { KeyRound, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { profileService } from '@/lib/auth-service'
import type { ChangePasswordRequest } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SettingsPage() {
  const [form, setForm] = useState<ChangePasswordRequest>({ currentPassword: '', newPassword: '' })
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const passwordMismatch = confirmPassword.length > 0 && form.newPassword !== confirmPassword
  const canSubmit =
    form.currentPassword.length > 0 && form.newPassword.length >= 6 && form.newPassword === confirmPassword

  async function handleSubmit() {
    if (!canSubmit) return
    setSaving(true)
    try {
      await profileService.changePassword(form)
      toast.success('Password changed successfully.')
      setForm({ currentPassword: '', newPassword: '' })
      setConfirmPassword('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to change password.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account security</p>
      </div>

      {/* Change Password Card */}
      <div className="rounded-xl bg-card p-5 shadow-md border-0 space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Change Password</p>
            <p className="text-xs text-muted-foreground">Keep your account secure with a strong password</p>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Current Password</Label>
          <div className="relative">
            <Input
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={e => setForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrent(p => !p)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1">
          <Label>New Password</Label>
          <div className="relative">
            <Input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={e => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Min. 6 characters"
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowNew(p => !p)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.newPassword.length > 0 && form.newPassword.length < 6 && (
            <p className="text-xs text-destructive">Password must be at least 6 characters.</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Confirm New Password</Label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              className={`pr-10 ${passwordMismatch ? '-destructive focus-visible:ring-destructive' : ''}`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(p => !p)}
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground"
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordMismatch && <p className="text-xs text-destructive">Passwords do not match.</p>}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSubmit} disabled={!canSubmit || saving}>
            {saving ? 'Changing…' : 'Change Password'}
          </Button>
        </div>
      </div>
    </div>
  )
}
