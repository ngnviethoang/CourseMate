import { api } from './api-client'
import { getUserId } from './auth-token.util'

export interface FavoriteCourseDto {
  id: string
  courseId: string
  title: string
  imageUrl: string
  price: number
  categoryName: string
  instructorName: string
  addedAt: string
}

export const favoritesService = {
  getMyFavorites: (limit = 50) =>
    api.get<FavoriteCourseDto[]>(`/api/favorites?Limit=${limit}`),

  toggle: (courseId: string, isFavorite: boolean) =>
    api.post<boolean>('/api/favorites', { courseId, isFavorite }),

  isFavorited: (courseId: string, favorites: FavoriteCourseDto[]): boolean => {
    if (!favorites || favorites.length === 0) return false
    return favorites.some(f => f.courseId === courseId)
  }
}
