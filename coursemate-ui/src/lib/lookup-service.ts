import { api } from '@/lib/api-client'
import type { LookupItemDto } from '@/lib/types'

export const lookupService = {
  getCategoryLookups: () => api.get<LookupItemDto[]>('/api/lookups/categories'),
  getUserLookups: (roles?: string[]) => {
    const qs = new URLSearchParams()
    roles?.forEach(role => qs.append('roles', role))
    const suffix = qs.toString() ? `?${qs.toString()}` : ''
    return api.get<LookupItemDto[]>(`/api/lookups/users${suffix}`)
  }
}
