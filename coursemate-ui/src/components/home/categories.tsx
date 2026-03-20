'use client'

import { useEffect, useState } from 'react'
import { BarChart3, Briefcase, Camera, ChevronRight, Code2, Globe, Music, Palette, TrendingUp, BookOpen, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { studentService } from '@/lib/student-service'
import { CategoryDto } from '@/lib/types'

// Icon + colour mapping by keyword
const ICON_MAP: Record<string, { icon: typeof Code2; color: string }> = {
  development: { icon: Code2, color: 'bg-indigo-100 text-indigo-600' },
  design: { icon: Palette, color: 'bg-pink-100 text-pink-600' },
  ui: { icon: Palette, color: 'bg-pink-100 text-pink-600' },
  ux: { icon: Palette, color: 'bg-pink-100 text-pink-600' },
  'data science': { icon: BarChart3, color: 'bg-emerald-100 text-emerald-600' },
  data: { icon: BarChart3, color: 'bg-emerald-100 text-emerald-600' },
  business: { icon: Briefcase, color: 'bg-amber-100 text-amber-600' },
  marketing: { icon: TrendingUp, color: 'bg-orange-100 text-orange-600' },
  language: { icon: Globe, color: 'bg-sky-100 text-sky-600' },
  music: { icon: Music, color: 'bg-purple-100 text-purple-600' },
  photo: { icon: Camera, color: 'bg-rose-100 text-rose-600' }
}

function getCategoryMeta(name: string) {
  const lower = name.toLowerCase()
  for (const [key, val] of Object.entries(ICON_MAP)) {
    if (lower.includes(key)) return val
  }
  return { icon: BookOpen, color: 'bg-gray-100 text-gray-600' }
}

function CategorySkeleton() {
  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-xl border bg-card p-3 animate-pulse"
        >
          <div className="h-10 w-10 rounded-lg bg-muted" />
          <div className="h-3 w-14 rounded bg-muted" />
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
      <div className="mb-5 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Browse Categories</h2>
        <Button variant="ghost" size="sm" className="gap-1 text-primary">
          All categories <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {loading ? (
        <CategorySkeleton />
      ) : categories.length === 0 ? (
        <p className="text-sm text-muted-foreground">No categories found.</p>
      ) : (
        <div className="grid grid-cols-4 gap-3 sm:grid-cols-8">
          {categories.map(cat => {
            const { icon: Icon, color } = getCategoryMeta(cat.name)
            return (
              <button
                key={cat.id}
                title={cat.description}
                className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center shadow-xs transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium leading-tight">{cat.name}</span>
              </button>
            )
          })}
        </div>
      )}
    </section>
  )
}
