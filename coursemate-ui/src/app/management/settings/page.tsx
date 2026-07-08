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
      toast.success('Đổi mật khẩu thành công.')
      setForm({ currentPassword: '', newPassword: '' })
      setConfirmPassword('')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Không thể đổi mật khẩu.'
      toast.error(message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Cài đặt</h1>
        <p className="text-sm text-muted-foreground">Quản lý bảo mật tài khoản</p>
      </div>

      {/* Change Password Card */}
      <div className="rounded-xl bg-card p-5 shadow-md border-0 space-y-4">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <KeyRound className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Đổi mật khẩu</p>
            <p className="text-xs text-muted-foreground">Giữ an toàn tài khoản với mật khẩu mạnh</p>
          </div>
        </div>

        <div className="space-y-1">
          <Label>Mật khẩu hiện tại</Label>
          <div className="relative">
            <Input
              type={showCurrent ? 'text' : 'password'}
              value={form.currentPassword}
              onChange={e => setForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Nhập mật khẩu hiện tại"
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
          <Label>Mật khẩu mới</Label>
          <div className="relative">
            <Input
              type={showNew ? 'text' : 'password'}
              value={form.newPassword}
              onChange={e => setForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Tối thiểu 6 ký tự"
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
            <p className="text-xs text-destructive">Mật khẩu phải có ít nhất 6 ký tự.</p>
          )}
        </div>

        <div className="space-y-1">
          <Label>Xác nhận mật khẩu mới</Label>
          <div className="relative">
            <Input
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Nhập lại mật khẩu mới"
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
          {passwordMismatch && <p className="text-xs text-destructive">Mật khẩu xác nhận không khớp.</p>}
        </div>

        <div className="flex justify-end pt-2">
          <Button onClick={handleSubmit} disabled={!canSubmit || saving}>
            {saving ? 'Đang đổi...' : 'Đổi mật khẩu'}
          </Button>
        </div>
      </div>
    </div>
  )
}
