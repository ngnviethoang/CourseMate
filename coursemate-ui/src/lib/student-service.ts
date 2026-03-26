import { api } from './api-client'
import { PagedDto, CategoryDto, CourseDto, StudentCourseDetailDto, CartDto, OrderDto, ResultIdDto, StudentMyCourseDto, StudentLessonDetailDto } from './types'

export const studentService = {
  // ─── Categories ────────────────────────────────────────────────────────────

  getCategories: async (pageSize = 25): Promise<PagedDto<CategoryDto>> => {
    return api.get<PagedDto<CategoryDto>>(`/api/student/categories?pageSize=${pageSize}&pageIndex=1`)
  },

  // profile 
  getMyCourse: async (pageIndex = 1, pageSize = 12, filter?: string): Promise<PagedDto<StudentMyCourseDto>> => {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize)
    })
    if (filter) params.set('filter', filter)
    return api.get<PagedDto<StudentMyCourseDto>>(`/api/student/courses/my?${params}`)
  },
  getLessonById: async (id: string): Promise<StudentLessonDetailDto> => {
    return api.get<StudentLessonDetailDto>(`/api/student/lessons/${id}`)
  },

  // ─── Courses ───────────────────────────────────────────────────────────────

  getCourses: async (pageIndex = 1, pageSize = 12, filter?: string): Promise<PagedDto<CourseDto>> => {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize)
    })
    if (filter) params.set('filter', filter)
    return api.get<PagedDto<CourseDto>>(`/api/student/courses?${params}`)
  },

  getCourseById: async (id: string): Promise<StudentCourseDetailDto> => {
    return api.get<StudentCourseDetailDto>(`/api/student/courses/${id}`)
  },

  getRecommendedCourses: async (pageIndex = 1, pageSize = 12): Promise<PagedDto<CourseDto>> => {
    const params = new URLSearchParams({
      pageIndex: String(pageIndex),
      pageSize: String(pageSize)
    })
    return api.get<PagedDto<CourseDto>>(`/api/student/courses/recommended?${params}`)
  },

  // ─── Cart ──────────────────────────────────────────────────────────────────

  getCart: async (): Promise<CartDto> => {
    return api.get<CartDto>('/api/student/carts')
  },

  addToCart: async (courseId: string): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/student/carts', { courseId })
  },

  removeFromCart: async (cartItemId: string): Promise<void> => {
    return api.delete<void>(`/api/student/carts/${cartItemId}`)
  },

  // ─── Orders ────────────────────────────────────────────────────────────────

  getOrders: async (pageIndex = 1, pageSize = 10): Promise<PagedDto<OrderDto>> => {
    return api.get<PagedDto<OrderDto>>(`/api/student/orders?pageIndex=${pageIndex}&pageSize=${pageSize}`)
  },

  getOrderById: async (id: string): Promise<OrderDto> => {
    return api.get<OrderDto>(`/api/student/orders/${id}`)
  },

  createOrder: async (): Promise<ResultIdDto> => {
    return api.post<ResultIdDto>('/api/student/orders')
  }


}
