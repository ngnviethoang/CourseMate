import { api } from './api-client'
import { DashboardDto, RecommendationEffectivenessDto } from './types'

export const dashboardService = {
  getStats: () => api.get<DashboardDto>('/api/dashboard'),
  getRecommendationEffectiveness: () => api.get<RecommendationEffectivenessDto>('/api/dashboard/recommendation-effectiveness')
}
