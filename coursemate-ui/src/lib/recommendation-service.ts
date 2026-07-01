import { api } from './api-client'
import {
  RecommendationResponseDto,
  RecordFeedbackRequest,
  RecommendationAnalyticsDto,
  StudentRecommendationStatsDto,
  RecommendationAnalyticsSummaryDto
} from './types'

export const recommendationService = {
  // Get personalized recommendations for the current user
  getRecommendations: async (topN = 10) => {
    const res = await api.get<RecommendationResponseDto>(`/api/recommendations?topN=${topN}`)
    return res
  },

  // Record feedback for a recommendation
  recordFeedback: (analyticsId: string, feedback: string) =>
    api.post<void>(`/api/recommendations/${analyticsId}/feedback`, { feedback }),

  // Get my recommendation history
  getMyAnalytics: () => api.get<RecommendationAnalyticsDto[]>('/api/recommendations/my-analytics'),

  // Get my recommendation statistics
  getMyStats: () => api.get<StudentRecommendationStatsDto>('/api/recommendations/my-stats'),

  // Admin: Get analytics summary
  getAnalyticsSummary: (from?: string, to?: string) => {
    const params = new URLSearchParams()
    if (from) params.set('from', from)
    if (to) params.set('to', to)
    const queryString = params.toString()
    return api.get<RecommendationAnalyticsSummaryDto>(
      `/api/recommendations/analytics/summary${queryString ? `?${queryString}` : ''}`
    )
  },

  // Admin: Get top performing courses
  getTopCourses: (top = 10) => api.get<unknown[]>(`/api/recommendations/analytics/top-courses?top=${top}`)
}
