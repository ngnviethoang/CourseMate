import { api } from './api-client'
import { PagedDto, UpdateOrderRequest, CreateOrderRequest, CartDto, ResultIdDto, OrderDto } from './types'
import { getUserId } from './auth-token.util'

export const orderService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<OrderDto>>(`/api/orders?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<OrderDto | null>(`/api/orders/${id}`),
  update: (id: string, body: UpdateOrderRequest) => api.put<void>(`/api/orders/${id}`, body),
  delete: (id: string) => api.delete<void>(`/api/orders/${id}`),
  create: async (body: CreateOrderRequest): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/orders', body)
  },

  // Cart
  getCart: async (): Promise<CartDto> => {
    const studentId = getUserId()
    return api.get<CartDto>(`/api/carts?studentId=${studentId}`)
  },
  addToCart: async (courseId: string): Promise<ResultIdDto> => {
    const studentId = getUserId()
    return api.post<ResultIdDto>('/api/carts', { courseId, studentId })
  },
  removeFromCart: async (cartItemId: string): Promise<void> => {
    return api.delete<void>(`/api/carts/${cartItemId}`)
  },

  // Enrollment
  enrollFree: async (courseId: string): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/enrollments/free', { courseId })
  },

  // Payment
  createPaymentUrl: async ({
    orderId,
    returnUrl,
    cancelUrl
  }: {
    orderId: string
    returnUrl: string
    cancelUrl: string
  }): Promise<{ checkoutUrl: string; paymentTransactionId: string }> => {
    return api.post<{ checkoutUrl: string; paymentTransactionId: string }>('/api/payments/create-url', {
      orderId,
      returnUrl,
      cancelUrl
    })
  },
  fakePayOsIpn: async (orderId: string, studentId: string, paymentTransactionId: string): Promise<number> => {
    return api.post<number>('/api/payments/fake-payos-ipn', { orderId, studentId, paymentTransactionId })
  }
}
