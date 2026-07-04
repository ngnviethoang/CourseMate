import { api } from './api-client'

export type RecommendationReason = 'Personalized' | 'SimilarContent' | 'BecauseYouTook' | 'SameCategory' | 'Popular'

export interface RecommendedCourseDto {
  id: string
  title: string
  imageUrl: string
  price: number
  categoryId: string
  categoryName: string
  score: number
  reason: RecommendationReason
}

export const recommendationService = {
  getForMe: (limit = 12) => api.get<RecommendedCourseDto[]>(`/api/recommendations/for-me?Limit=${limit}`),
  getTrending: (limit = 12) => api.get<RecommendedCourseDto[]>(`/api/recommendations/trending?Limit=${limit}`),
  getSimilar: (courseId: string, limit = 8) =>
    api.get<RecommendedCourseDto[]>(`/api/courses/${courseId}/similar?Limit=${limit}`)
}
