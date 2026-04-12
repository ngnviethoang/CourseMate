import { api } from '@/lib/api-client'
import type {
  AdminOrderDto,
  CategoryDto,
  ChangePasswordRequest,
  ChapterDto,
  CourseDto,
  CreateCategoryRequest,
  CreateChapterRequest,
  CreateCourseRequest,
  CreateLessonRequest,
  CreateUserRequest,
  DashboardDto,
  LessonDto,
  PagedDto,
  ProfileDto,
  ResultIdDto,
  UpdateCategoryRequest,
  UpdateChapterRequest,
  UpdateCourseRequest,
  UpdateLessonRequest,
  UpdateOrderRequest,
  UpdateProfileRequest,
  UpdateUserRequest,
  UserDto
} from '@/lib/types'

export const getDecodedToken = () => {
  if (typeof window === 'undefined') return null
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('accessToken='))
    ?.split('=')[1]

  if (!token) return null

  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch (e) {
    console.error('Failed to parse token', e)
    return null
  }
}

export const getRole = () => {
  const payload = getDecodedToken()
  if (!payload) return []

  const roleKey = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
  const roles = payload[roleKey]
  return Array.isArray(roles) ? roles : roles ? [roles] : []
}

export const getUserId = () => {
  const payload = getDecodedToken()
  if (!payload) return null
  return payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? null
}

// ─── Dashboard ───────────────────────────────────────────────────────────────

export const dashboardService = {
  getStats: () => api.get<DashboardDto>('/api/dashboard')
}

// ─── Category ────────────────────────────────────────────────────────────────

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

// ─── Order ───────────────────────────────────────────────────────────────────

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
  update: (id: string, body: UpdateOrderRequest) => api.put<void>(`/api/orders/${id}`, body)
}

// ─── Course ──────────────────────────────────────────────────────────────────

export const courseService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<CourseDto>>(`/api/courses?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<CourseDto | null>(`/api/courses/${id}`),
  create: (body: CreateCourseRequest) => api.post<ResultIdDto>('/api/courses', body),
  update: (id: string, body: UpdateCourseRequest) => api.put<void>(`/api/courses/${id}`, body),
  delete: (id: string) => api.delete<void>(`/api/courses/${id}`)
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export const chapterService = {
  list: async (params?: {
    filter?: string
    pageIndex?: number
    pageSize?: number
    sorting?: string
    courseId?: string
  }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    if (params?.courseId) qs.set('courseId', params.courseId)
    const res = await api.get<PagedDto<ChapterDto>>(`/api/chapters?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<ChapterDto | null>(`/api/chapters/${id}`),
  create: (body: CreateChapterRequest) => api.post<ResultIdDto>('/api/chapters', body),
  update: (id: string, body: UpdateChapterRequest) => api.put<void>(`/api/chapters/${id}`, body),
  delete: (id: string) => api.delete<void>(`/api/chapters/${id}`)
}

// ─── Lesson ──────────────────────────────────────────────────────────────────

const LESSON_TYPE_TO_NUMBER: Record<string, number> = { Video: 1, Reading: 2, Coding: 3, Quiz: 4, Slide: 5 }
const NUMBER_TO_LESSON_TYPE: Record<number, string> = { 1: 'Video', 2: 'Reading', 3: 'Coding', 4: 'Quiz', 5: 'Slide' }

export const lessonService = {
  list: async (params?: {
    filter?: string
    pageIndex?: number
    pageSize?: number
    sorting?: string
    chapterId?: string
  }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    if (params?.chapterId) qs.set('chapterId', params.chapterId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await api.get<PagedDto<any>>(`/api/lessons?${qs}`)
    if (res) {
      res.pageIndex -= 1
      if (res.items) {
        res.items = res.items.map(i => ({ ...i, lessonType: NUMBER_TO_LESSON_TYPE[i.lessonType as number] || 'Video' }))
      }
    }
    return res as unknown as PagedDto<LessonDto>
  },
  getById: async (id: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await api.get<any | null>(`/api/lessons/${id}`)
    if (res && res.lessonType !== undefined) {
      res.lessonType = NUMBER_TO_LESSON_TYPE[res.lessonType as number] || 'Video'
    }
    return res as unknown as LessonDto | null
  },
  create: (body: CreateLessonRequest) => {
    const payload = { ...body, lessonType: LESSON_TYPE_TO_NUMBER[body.lessonType] || 1 }
    return api.post<ResultIdDto>('/api/lessons', payload)
  },
  update: (id: string, body: UpdateLessonRequest) => {
    const payload = { ...body, lessonType: LESSON_TYPE_TO_NUMBER[body.lessonType] || 1 }
    return api.put<void>(`/api/lessons/${id}`, payload)
  },
  delete: (id: string) => api.delete<void>(`/api/lessons/${id}`)
}

// ─── User ────────────────────────────────────────────────────────────────────

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

// ─── Profile (current user) ───────────────────────────────────────────────────

export const profileService = {
  getMe: () => api.get<ProfileDto>('/api/auth/profile'),
  updateProfile: (body: UpdateProfileRequest) => api.post<void>('/api/auth/profile', body),
  changePassword: (body: ChangePasswordRequest) => api.post<void>('/api/auth/change-password', body)
}

// ─── AI ───────────────────────────────────────────────────────────────────────

export const aiService = {
  generateLesson: (rawContent?: string, file?: File) => {
    const formData = new FormData()
    if (rawContent) formData.append('rawContent', rawContent)
    if (file) formData.append('file', file)
    return api.post<any>('/api/ai/generate-lesson', formData)
  }
}
