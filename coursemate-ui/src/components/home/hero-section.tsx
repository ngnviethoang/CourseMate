import { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, Clock, Search, Star, TrendingUp, Users, Award } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

interface HeroSectionProps {
  searchQuery?: string
  onSearch?: (query: string) => void
}

const STATS = [
  { icon: BookOpen, value: '10,000+', label: 'Khoá học' },
  { icon: Users, value: '500K+', label: 'Học viên' },
  { icon: Award, value: '200+', label: 'Giảng viên' },
  { icon: TrendingUp, value: '95%', label: 'Tỉ lệ hài lòng' }
]

export function HeroSection({ searchQuery = '', onSearch }: HeroSectionProps) {
  const [localSearch, setLocalSearch] = useState(searchQuery)

  // Sync with prop if changed from outside
  useEffect(() => {
    setLocalSearch(searchQuery)
  }, [searchQuery])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localSearch !== searchQuery) {
        onSearch?.(localSearch)
      }
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [localSearch, onSearch, searchQuery])

  return (
    <section className="relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-700" />

      {/* Animated blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 h-72 w-72 rounded-full bg-pink-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 right-1/3 h-48 w-48 rounded-full bg-cyan-400/15 blur-2xl" />

      {/* Dot pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm ring-1 ring-white/20">
            <Star className="h-3 w-3 fill-amber-300 text-amber-300" />
            Nền tảng học trực tuyến hàng đầu
          </div>

          {/* Headline */}
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            Nâng cao kỹ năng,{' '}
            <span className="relative">
              <span className="relative z-10 text-amber-300">mở rộng tương lai</span>
              <svg
                className="absolute -bottom-1 left-0 w-full"
                viewBox="0 0 200 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 5C50 1 150 1 199 5" stroke="#FDE68A" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
            Học tập từ các chuyên gia hàng đầu. Học mọi lúc, mọi nơi theo tốc độ của bạn.
          </p>

          {/* Search bar */}
          <div className="mt-8 flex gap-2 rounded-2xl bg-white/10 p-1.5 backdrop-blur-md ring-1 ring-white/20 sm:gap-0">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/60" />
              <Input
                placeholder="Tìm khoá học, chủ đề, giảng viên…"
                className="h-12 border-0 bg-transparent pl-11 text-white placeholder:text-white/60 focus-visible:ring-0 focus-visible:ring-offset-0"
                value={localSearch}
                onChange={e => setLocalSearch(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSearch?.(localSearch)}
              />
            </div>
            <Button
              className="h-12 rounded-xl bg-amber-400 px-6 text-sm font-semibold text-amber-900 shadow-lg hover:bg-amber-300 transition-colors"
              onClick={() => onSearch?.(localSearch)}
            >
              Tìm kiếm
            </Button>
          </div>

          {/* Popular tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-blue-200">Phổ biến:</span>
            {['Python', 'Web Dev', 'React', 'UI/UX', 'Data Science'].map(tag => (
              <button
                key={tag}
                onClick={() => onSearch?.(tag)}
                className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {STATS.map(({ icon: Icon, value, label }) => (
            <div
              key={label}
              className="flex items-center justify-center gap-3 rounded-xl bg-white/10 p-3 backdrop-blur-sm ring-1 ring-white/15 transition-transform hover:-translate-y-0.5"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Icon className="h-4 w-4 text-white" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-sm font-bold text-white leading-tight">{value}</span>
                <span className="text-[10px] text-blue-200 leading-tight">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
