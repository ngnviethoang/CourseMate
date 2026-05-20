'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authService } from '@/lib/auth-service'
import { Roles, RoleLabels } from '@/lib/consts'
import { decodeJwt, getAccessToken, getRoles, saveToken } from '@/lib/auth-token.util'
import { toast } from 'sonner'
import { GraduationCap, BookOpen, Briefcase, ShieldCheck, Loader2, ArrowRight } from 'lucide-react'

const RoleIcons: Record<string, React.ReactNode> = {
  [Roles.Student]: <BookOpen className="h-8 w-8" />,
  [Roles.Instructor]: <Briefcase className="h-8 w-8" />,
  [Roles.Admin]: <ShieldCheck className="h-8 w-8" />
}

const RoleDescriptions: Record<string, string> = {
  [Roles.Student]: 'Khám phá và học tập các khóa học',
  [Roles.Instructor]: 'Tạo và quản lý khóa học của bạn',
  [Roles.Admin]: 'Quản trị toàn bộ hệ thống'
}

export default function SelectRolePage() {
  const router = useRouter()
  const [roles, setRoles] = useState<string[]>([])
  const [loadingRole, setLoadingRole] = useState<string | null>(null)

  useEffect(() => {
    const token = getAccessToken()
    if (!token) {
      router.replace('/login')
      return
    }
    const userRoles = getRoles(token)
    if (userRoles.length <= 1) {
      // Single role — shouldn't be here, redirect back
      router.replace('/')
      return
    }
    setRoles(userRoles)
  }, [router])

  const handleSelectRole = async (role: string) => {
    setLoadingRole(role)
    try {
      const res = await authService.selectRole({ role })
      saveToken(res.accessToken)
      const payload = decodeJwt(res.accessToken)
      const selectedRole = payload.role as string

      toast.success(`Đăng nhập thành công với vai trò ${RoleLabels[role as Roles] ?? role}.`)

      if (selectedRole === Roles.Student) {
        router.push('/')
      } else if (selectedRole === Roles.Admin || selectedRole === Roles.Instructor) {
        router.push('/management')
      } else {
        router.push('/')
      }
    } catch {
      // api-client shows error toast
    } finally {
      setLoadingRole(null)
    }
  }

  if (roles.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-primary/8 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in-95 duration-500">
        {/* Header */}
        <div className="flex flex-col items-center mb-10 gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/20">
            <GraduationCap className="h-7 w-7" />
          </div>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Chọn vai trò</h1>
            <p className="text-sm text-muted-foreground font-medium">
              Tài khoản của bạn có nhiều vai trò. Hãy chọn vai trò bạn muốn sử dụng.
            </p>
          </div>
        </div>

        {/* Role cards */}
        <div className="grid gap-4">
          {roles.map(role => (
            <button
              key={role}
              id={`btn-role-${role.toLowerCase()}`}
              onClick={() => handleSelectRole(role)}
              disabled={loadingRole !== null}
              className="
                group flex items-center gap-5 w-full p-5 rounded-2xl border border-border/60
                bg-background/60 backdrop-blur-xl text-left
                hover:border-primary/50 hover:bg-primary/5 hover:shadow-lg hover:shadow-primary/10
                active:scale-[0.98]
                transition-all duration-200
                disabled:opacity-60 disabled:pointer-events-none
              "
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-200">
                {loadingRole === role ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  RoleIcons[role] ?? <BookOpen className="h-8 w-8" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-base">
                  {RoleLabels[role as Roles] ?? role}
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  {RoleDescriptions[role] ?? 'Tiếp tục với vai trò này'}
                </p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200 shrink-0" />
            </button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-10">
          &copy; {new Date().getFullYear()} CourseMate. All rights reserved.
        </p>
      </div>
    </div>
  )
}
