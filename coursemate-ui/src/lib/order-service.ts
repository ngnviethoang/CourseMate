import { api } from './api-client'
import { PagedDto, AdminOrderDto, UpdateOrderRequest, CartDto, ResultIdDto, OrderDto } from './types'

export const orderService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<AdminOrderDto>>(`/api/orders?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<AdminOrderDto | null>(`/api/orders/${id}`),
  update: (id: string, body: UpdateOrderRequest) => api.put<void>(`/api/orders/${id}`, body),
  create: async (): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/orders')
  },

  // Cart
  getCart: async (): Promise<CartDto> => {
    return api.get<CartDto>('/api/carts')
  },
  addToCart: async (courseId: string): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/carts', { courseId })
  },
  removeFromCart: async (cartItemId: string): Promise<void> => {
    return api.delete<void>(`/api/carts/${cartItemId}`)
  },

  // Enrollment
  enrollFree: async (courseId: string): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/enrollments/free', { courseId })
  }
}
