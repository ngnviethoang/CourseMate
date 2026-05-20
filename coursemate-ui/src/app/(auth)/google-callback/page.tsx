'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { saveToken, decodeJwt } from '@/lib/auth-token.util'
import { toast } from 'sonner'
import { Roles } from '@/lib/consts'
import { GraduationCap, Loader2, AlertCircle } from 'lucide-react'
import Link from 'next/link'

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = searchParams.get('token')
    const rolesParam = searchParams.get('roles')
    const errorParam = searchParams.get('error')

    if (errorParam) {
      setError(errorParam)
      return
    }

    if (!token) {
      setError('Đăng nhập bằng Google không thành công.')
      return
    }

    // Save the token immediately
    saveToken(token)

    const roles = rolesParam ? rolesParam.split(',').filter(Boolean) : []

    // Multi-role: redirect to select-role
    if (roles.length > 1) {
      router.replace('/select-role')
      return
    }

    // Single role: decode and redirect based on role
    const payload = decodeJwt(token)
    const role = payload.role as string

    toast.success('Đăng nhập thành công.')

    if (role === Roles.Student) {
      router.replace('/')
    } else if (role === Roles.Admin || role === Roles.Instructor) {
      router.replace('/management')
    } else {
      router.replace('/')
    }
  }, [searchParams, router])

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden font-sans">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="flex flex-col items-center mb-8 gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive shadow-lg ring-1 ring-destructive/20">
              <AlertCircle className="h-7 w-7" />
            </div>
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">Đăng nhập thất bại</h1>
              <p className="text-sm text-muted-foreground font-medium">{error}</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
            >
              Quay lại đăng nhập
            </Link>
          </div>

          <p className="text-center text-xs text-muted-foreground/60 mt-8">
            &copy; {new Date().getFullYear()} CourseMate. All rights reserved.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 font-sans">
      <div className="flex flex-col items-center gap-4 animate-in fade-in duration-300">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/20">
          <GraduationCap className="h-7 w-7" />
        </div>
        <Loader2 className="h-8 w-8 text-primary animate-spin" />
        <p className="text-sm text-muted-foreground font-medium">Đang đăng nhập...</p>
      </div>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  )
}
