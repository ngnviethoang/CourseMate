import { api } from './api-client'
import { PagedDto, CategoryDto, CreateCategoryRequest, UpdateCategoryRequest, ResultIdDto } from './types'

export const categoryService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<CategoryDto>>(`/api/categories?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<CategoryDto | null>(`/api/categories/${id}`),
  create: (body: CreateCategoryRequest) => api.post<ResultIdDto>('/api/categories', body),
  update: (id: string, body: UpdateCategoryRequest) => api.put<void>(`/api/categories/${id}`, body),
  delete: (id: string) => api.delete<void>(`/api/categories/${id}`)
}
