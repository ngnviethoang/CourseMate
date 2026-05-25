'use client'

import Link from 'next/link'
import { Suspense, useEffect, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { GraduationCap, Loader2 } from 'lucide-react'
import { saveToken } from '@/lib/auth-token.util'

function GoogleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const handledRef = useRef(false)

  useEffect(() => {
    if (handledRef.current) return
    handledRef.current = true

    const hash = typeof window !== 'undefined' ? window.location.hash.replace(/^#/, '') : ''
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('accessToken') ?? searchParams.get('accessToken')
    if (!accessToken) {
      router.replace('/login')
      return
    }

    saveToken(accessToken)
    router.replace('/')
  }, [router, searchParams])

  return (
    <div className="flex flex-col items-center gap-4 py-10 text-center animate-in fade-in duration-500">
      <Loader2 className="h-12 w-12 text-primary animate-spin" />
      <p className="text-sm text-muted-foreground">Đang hoàn tất đăng nhập Google...</p>
    </div>
  )
}

export default function GoogleCallbackPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 relative overflow-hidden font-sans">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex flex-col items-center mb-8 gap-3">
          <Link
            href="/"
            className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-primary/20"
          >
            <GraduationCap className="h-7 w-7" />
          </Link>
          <div className="text-center space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">CourseMate</h1>
            <p className="text-sm text-muted-foreground font-medium">Đăng nhập với Google</p>
          </div>
        </div>

        <div className="rounded-2xl shadow-2xl shadow-black/5 dark:shadow-black/20 bg-background/60 backdrop-blur-xl p-8">
          <Suspense
            fallback={
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 className="h-10 w-10 text-primary animate-spin" />
                <p className="text-sm text-muted-foreground">Đang tải...</p>
              </div>
            }
          >
            <GoogleCallbackContent />
          </Suspense>
        </div>

        <p className="text-center text-xs text-muted-foreground/60 mt-8">
          &copy; {new Date().getFullYear()} CourseMate. Bảo lưu mọi quyền.
        </p>
      </div>
    </div>
  )
}
