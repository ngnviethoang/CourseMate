'use client'
import { categoryService } from '@/lib/category-service'
import { useEffect, useState, useRef } from 'react'
import { ChevronDown, Filter } from 'lucide-react'
import { CategoryDto } from '@/lib/types'

interface CategoryDropdownProps {
  value: string
  onChange: (categoryId: string) => void
}

export function CategoryDropdown({ value, onChange }: CategoryDropdownProps) {
  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await categoryService.list({ hasCourse: true, pageSize: 25 })
        setCategories(res.items.filter(c => c.isActive))
      } catch {
        setCategories([])
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedCategory = categories.find(c => c.id === value)

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="group flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-200 hover:border-primary/40 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary/30"
      >
        <Filter className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
        <span className={selectedCategory ? 'text-foreground' : 'text-muted-foreground'}>
          {loading ? 'Đang tải...' : selectedCategory ? selectedCategory.name : 'Tất cả danh mục'}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown */}
      {open && !loading && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[240px] max-h-[320px] overflow-y-auto rounded-xl border border-border bg-popover shadow-xl animate-in fade-in-0 zoom-in-95 duration-150">
          <div className="p-1.5">
            {/* All option */}
            <button
              onClick={() => {
                onChange('')
                setOpen(false)
              }}
              className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                !value ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground hover:bg-accent'
              }`}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-slate-400 to-gray-500 text-white text-xs font-bold shadow-sm">
                TC
              </span>
              <span>Tất cả danh mục</span>
            </button>

            {/* Category items */}
            {categories.map((cat, idx) => {
              const isSelected = cat.id === value
              const gradients = [
                'from-indigo-500 to-blue-600',
                'from-pink-500 to-rose-500',
                'from-emerald-500 to-teal-600',
                'from-amber-500 to-orange-500',
                'from-violet-500 to-purple-600',
                'from-sky-500 to-cyan-500',
                'from-fuchsia-400 to-pink-600',
                'from-lime-500 to-green-600'
              ]
              const gradient = gradients[idx % gradients.length]

              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    onChange(cat.id)
                    setOpen(false)
                  }}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isSelected ? 'bg-primary/10 font-semibold text-primary' : 'text-foreground hover:bg-accent'
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${gradient} text-white text-xs font-bold shadow-sm`}
                  >
                    {cat.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="truncate">{cat.name}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
