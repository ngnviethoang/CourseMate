import { api } from './api-client'
import { PagedDto, UserDto, CreateUserRequest, UpdateUserRequest, ResultIdDto } from './types'

export const userService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<UserDto>>(`/api/users?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<UserDto | null>(`/api/users/${id}`),
  create: (body: CreateUserRequest) => api.post<ResultIdDto>('/api/users', body),
  update: (id: string, body: UpdateUserRequest) => api.put<void>(`/api/users/${id}`, body),
  delete: (id: string) => api.delete<void>(`/api/users/${id}`)
}
