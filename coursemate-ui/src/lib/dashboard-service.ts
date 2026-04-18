import { api } from './api-client'
import { DashboardDto } from './types'

export const dashboardService = {
  getStats: () => api.get<DashboardDto>('/api/dashboard')
}
