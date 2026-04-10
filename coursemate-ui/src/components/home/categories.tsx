'use client'

import { useEffect, useState } from 'react'
import {
  BarChart3,
  Briefcase,
  Camera,
  ChevronRight,
  Code2,
  Globe,
  Music,
  Palette,
  TrendingUp,
  BookOpen
} from 'lucide-react'
import { studentService } from '@/lib/student-service'
import { CategoryDto } from '@/lib/types'

// Icon + gradient mapping by keyword
const ICON_MAP: Record<string, { icon: typeof Code2; gradient: string; iconColor: string; shadow: string }> = {
  development: {
    icon: Code2,
    gradient: 'from-indigo-500 to-blue-600',
    iconColor: 'text-white',
    shadow: 'shadow-indigo-200 dark:shadow-indigo-900/40'
  },
  design: {
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    iconColor: 'text-white',
    shadow: 'shadow-pink-200 dark:shadow-pink-900/40'
  },
  ui: {
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    iconColor: 'text-white',
    shadow: 'shadow-pink-200 dark:shadow-pink-900/40'
  },
  ux: {
    icon: Palette,
    gradient: 'from-pink-500 to-rose-500',
    iconColor: 'text-white',
    shadow: 'shadow-pink-200 dark:shadow-pink-900/40'
  },
  'data science': {
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
    iconColor: 'text-white',
    shadow: 'shadow-emerald-200 dark:shadow-emerald-900/40'
  },
  data: {
    icon: BarChart3,
    gradient: 'from-emerald-500 to-teal-600',
    iconColor: 'text-white',
    shadow: 'shadow-emerald-200 dark:shadow-emerald-900/40'
  },
  business: {
    icon: Briefcase,
    gradient: 'from-amber-500 to-orange-500',
    iconColor: 'text-white',
    shadow: 'shadow-amber-200 dark:shadow-amber-900/40'
  },
  marketing: {
    icon: TrendingUp,
    gradient: 'from-orange-500 to-red-500',
    iconColor: 'text-white',
    shadow: 'shadow-orange-200 dark:shadow-orange-900/40'
  },
  language: {
    icon: Globe,
    gradient: 'from-sky-500 to-cyan-500',
    iconColor: 'text-white',
    shadow: 'shadow-sky-200 dark:shadow-sky-900/40'
  },
  music: {
    icon: Music,
    gradient: 'from-violet-500 to-purple-600',
    iconColor: 'text-white',
    shadow: 'shadow-violet-200 dark:shadow-violet-900/40'
  },
  photo: {
    icon: Camera,
    gradient: 'from-rose-500 to-pink-600',
    iconColor: 'text-white',
    shadow: 'shadow-rose-200 dark:shadow-rose-900/40'
  }
}

const FALLBACK = {
  icon: BookOpen,
  gradient: 'from-slate-500 to-gray-600',
  iconColor: 'text-white',
  shadow: 'shadow-slate-200 dark:shadow-slate-900/40'
}

function getCategoryMeta(name: string) {
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return val
  }
  return FALLBACK
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 rounded-2xl border bg-card p-5 animate-pulse">
          <div className="h-14 w-14 rounded-2xl bg-muted" />
          <div className="h-3 w-20 rounded-full bg-muted" />
          <div className="h-2.5 w-14 rounded-full bg-muted/60" />
        </div>
      ))}
    </div>
  )
}

export function Categories() {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    studentService
      .getCategories(25)
      .then(res => setCategories(res.items.filter(c => c.isActive)))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section>
      {/* Header */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-primary">Khám phá</p>
          <h2 className="text-2xl font-bold tracking-tight">Danh mục khoá học</h2>
        </div>
        <button className="group flex items-center gap-1 rounded-full border px-4 py-1.5 text-sm font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary">
          Xem tất cả
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>

      {loading ? (
        <CategorySkeleton />
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Không tìm thấy danh mục.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {categories.map(cat => {
            const { icon: Icon, gradient, shadow } = getCategoryMeta(cat.name)
            return (
              <button
                key={cat.id}
                title={cat.description}
                className="group relative flex flex-col items-center gap-3 rounded-2xl border border-transparent bg-card p-5 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/20 hover:shadow-lg"
              >
                {/* Icon container with gradient */}
                <div
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${gradient} shadow-lg ${shadow} transition-transform duration-300 group-hover:scale-110`}
                >
                  <Icon className="h-7 w-7 text-white" />
                </div>

                {/* Category name */}
                <div>
                  <span className="block text-sm font-semibold leading-tight text-foreground">{cat.name}</span>
                </div>

                {/* Subtle hover glow */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-[0.04]`}
                />
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
