'use client'

import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { favoritesService, type FavoriteCourseDto } from '@/lib/favorites-service'
import { toast } from 'sonner'

interface FavoritesContextValue {
  favorites: FavoriteCourseDto[]
  isLoaded: boolean
  toggle: (courseId: string) => Promise<void>
  isFavorited: (courseId: string) => boolean
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteCourseDto[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!document.cookie.includes('accessToken=')) return

    favoritesService.getMyFavorites().then(res => {
      setFavorites(res ?? [])
      setIsLoaded(true)
    }).catch(() => {
      setIsLoaded(true)
    })
  }, [])

  const toggle = useCallback(async (courseId: string) => {
    const current = favorites.find(f => f.courseId === courseId)
    const willBeFavorite = !current

    setFavorites(prev => {
      if (willBeFavorite) {
        return [...prev, { courseId, id: courseId, title: '', imageUrl: '', price: 0, categoryName: '', instructorName: '', addedAt: new Date().toISOString() } as FavoriteCourseDto]
      }
      return prev.filter(f => f.courseId !== courseId)
    })

    try {
      await favoritesService.toggle(courseId, willBeFavorite)
      if (willBeFavorite) {
        toast.success('Đã thêm vào danh sách yêu thích')
      } else {
        toast.success('Đã xóa khỏi danh sách yêu thích')
      }
    } catch {
      setFavorites(prev => {
        if (current) {
          return [...prev, current]
        }
        return prev.filter(f => f.courseId !== courseId)
      })
      toast.error('Không thể cập nhật. Vui lòng thử lại.')
    }
  }, [favorites])

  const isFavorited = useCallback((courseId: string) => {
    return favorites.some(f => f.courseId === courseId)
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, isLoaded, toggle, isFavorited }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext)
  if (!ctx) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>')
  }
  return ctx
}
