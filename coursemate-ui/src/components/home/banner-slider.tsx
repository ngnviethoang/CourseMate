'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { bannerService, BannerItem } from '@/lib/banner-service'

const AUTOPLAY_INTERVAL = 5000

export function BannerSlider() {
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [current, setCurrent] = useState(0)
  const [mounted, setMounted] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setBanners(bannerService.list())
    setMounted(true)
  }, [])

  const goTo = useCallback((idx: number) => {
    setCurrent(idx)
  }, [])

  const prev = useCallback(() => {
    setCurrent(c => (c === 0 ? banners.length - 1 : c - 1))
  }, [banners.length])

  const next = useCallback(() => {
    setCurrent(c => (c === banners.length - 1 ? 0 : c + 1))
  }, [banners.length])

  useEffect(() => {
    if (banners.length <= 1) return
    timerRef.current = setTimeout(next, AUTOPLAY_INTERVAL)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [current, banners.length, next])

  if (!mounted || banners.length === 0) return null

  const active = banners[current]

  const Wrapper = active.link
    ? ({ children }: { children: React.ReactNode }) => (
        <Link href={active.link} target="_blank" rel="noopener noreferrer" className="block h-full w-full">
          {children}
        </Link>
      )
    : ({ children }: { children: React.ReactNode }) => <div className="block h-full w-full">{children}</div>

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-muted" style={{ aspectRatio: '16/5' }}>
      {banners.map((banner, i) => (
        <div
          key={banner.id}
          className="absolute inset-0 transition-opacity duration-500"
          style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none' }}
        >
          <Wrapper>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={banner.imageUrl}
              alt={banner.title || `Banner ${i + 1}`}
              className="h-full w-full object-cover"
              loading={i === 0 ? 'eager' : 'lazy'}
            />
            {banner.title && (
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-6">
                <p className="text-lg font-semibold text-white drop-shadow">{banner.title}</p>
              </div>
            )}
          </Wrapper>
        </div>
      ))}

      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={e => { e.preventDefault(); prev() }}
            aria-label="Banner trước"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground shadow backdrop-blur-sm transition-colors hover:bg-background cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={e => { e.preventDefault(); next() }}
            aria-label="Banner tiếp theo"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-background/70 text-foreground shadow backdrop-blur-sm transition-colors hover:bg-background cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={e => { e.preventDefault(); goTo(i) }}
                aria-label={`Đến banner ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === current ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
