import { api } from './api-client'
import {
  PagedDto,
  CategoryDto,
  CourseDto,
  StudentCourseDetailDto,
  CartDto,
  OrderDto,
  ResultIdDto,
  StudentMyCourseDto,
  StudentLessonDetailDto
} from './types'

export const studentService = {
  // ─── Categories ────────────────────────────────────────────────────────────

  getCategories: async (pageSize = 25): Promise<PagedDto<CategoryDto>> => {
    return api.get<PagedDto<CategoryDto>>(`/api/categories?pageSize=${pageSize}&pageIndex=1`)
  },

  // ─── My Courses (enrolled) ─────────────────────────────────────────────────

  getMyCourse: async (pageIndex = 1, pageSize = 12, filter?: string): Promise<PagedDto<StudentMyCourseDto>> => {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize)
    })
    if (filter) params.set('filter', filter)
    return api.get<PagedDto<StudentMyCourseDto>>(`/api/courses/my?${params}`)
  },

  getLessonById: async (id: string): Promise<StudentLessonDetailDto> => {
    return api.get<StudentLessonDetailDto>(`/api/lessons/${id}`)
  },

  // ─── Courses ───────────────────────────────────────────────────────────────

  getCourses: async (
    pageIndex = 1,
    pageSize = 12,
    filter?: string,
    categoryId?: string
  ): Promise<PagedDto<CourseDto>> => {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize)
    })
    if (filter) params.set('filter', filter)
    if (categoryId) params.set('categoryId', categoryId)
    return api.get<PagedDto<CourseDto>>(`/api/courses?${params}`)
  },

  getCourseById: async (id: string): Promise<StudentCourseDetailDto> => {
    return api.get<StudentCourseDetailDto>(`/api/courses/${id}`)
  },

  getRecommendedCourses: async (pageIndex = 1, pageSize = 12): Promise<PagedDto<CourseDto>> => {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize)
    })
    return api.get<PagedDto<CourseDto>>(`/api/courses/recommended?${params}`)
  },

  // ─── Cart ──────────────────────────────────────────────────────────────────

  getCart: async (): Promise<CartDto> => {
    return api.get<CartDto>('/api/carts')
  },

  addToCart: async (courseId: string): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/carts', { courseId })
  },

  removeFromCart: async (cartItemId: string): Promise<void> => {
    return api.delete<void>(`/api/carts/${cartItemId}`)
  },

  // ─── Enrollment ────────────────────────────────────────────────────────────

  enrollFree: async (courseId: string): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/enrollments/free', { courseId })
  },

  // ─── Orders ────────────────────────────────────────────────────────────────

  getOrders: async (pageIndex = 1, pageSize = 10): Promise<PagedDto<OrderDto>> => {
    return api.get<PagedDto<OrderDto>>(`/api/orders?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  },

  getOrderById: async (id: string): Promise<OrderDto> => {
    return api.get<OrderDto>(`/api/orders/${id}`)
  },

  createOrder: async (): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/orders')
  }
}
