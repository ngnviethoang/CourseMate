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

const BASE = '/api/admin'

// ─── Category ────────────────────────────────────────────────────────────────

export const categoryService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<CategoryDto>>(`${BASE}/categories?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<CategoryDto | null>(`${BASE}/categories/${id}`),
  create: (body: CreateCategoryRequest) => api.post<ResultIdDto>(`${BASE}/categories`, body),
  update: (id: string, body: UpdateCategoryRequest) => api.put<void>(`${BASE}/categories/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/categories/${id}`)
}

// ---- order 
export const orderService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<AdminOrderDto>>(`${BASE}/orders?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<AdminOrderDto | null>(`${BASE}/orders/${id}`),
  update: (id: string, body: UpdateOrderRequest) => api.put<void>(`${BASE}/orders/${id}`, body)
}

// ─── Course ──────────────────────────────────────────────────────────────────

export const courseService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<CourseDto>>(`${BASE}/courses?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<CourseDto | null>(`${BASE}/courses/${id}`),
  create: (body: CreateCourseRequest) => api.post<ResultIdDto>(`${BASE}/courses`, body),
  update: (id: string, body: UpdateCourseRequest) => api.put<void>(`${BASE}/courses/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/courses/${id}`)
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export const chapterService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string; courseId?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    if (params?.courseId) qs.set('courseId', params.courseId)
    const res = await api.get<PagedDto<ChapterDto>>(`${BASE}/chapters?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<ChapterDto | null>(`${BASE}/chapters/${id}`),
  create: (body: CreateChapterRequest) => api.post<ResultIdDto>(`${BASE}/chapters`, body),
  update: (id: string, body: UpdateChapterRequest) => api.put<void>(`${BASE}/chapters/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/chapters/${id}`)
}

// ─── Lesson ──────────────────────────────────────────────────────────────────

const LESSON_TYPE_TO_NUMBER: Record<string, number> = { Video: 1, Reading: 2, Coding: 3, Quiz: 4 }
const NUMBER_TO_LESSON_TYPE: Record<number, string> = { 1: 'Video', 2: 'Reading', 3: 'Coding', 4: 'Quiz' }

export const lessonService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string; chapterId?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    if (params?.chapterId) qs.set('chapterId', params.chapterId)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const res = await api.get<PagedDto<any>>(`${BASE}/lessons?${qs}`)
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
    const res = await api.get<any | null>(`${BASE}/lessons/${id}`)
    if (res && res.lessonType !== undefined) {
      res.lessonType = NUMBER_TO_LESSON_TYPE[res.lessonType as number] || 'Video'
    }
    return res as unknown as LessonDto | null
  },
  create: (body: CreateLessonRequest) => {
    const payload = { ...body, lessonType: LESSON_TYPE_TO_NUMBER[body.lessonType] || 1 }
    return api.post<ResultIdDto>(`${BASE}/lessons`, payload)
  },
  update: (id: string, body: UpdateLessonRequest) => {
    const payload = { ...body, lessonType: LESSON_TYPE_TO_NUMBER[body.lessonType] || 1 }
    return api.put<void>(`${BASE}/lessons/${id}`, payload)
  },
  delete: (id: string) => api.delete<void>(`${BASE}/lessons/${id}`)
}

// ─── User ────────────────────────────────────────────────────────────────────

export const userService = {
  list: async (params?: { filter?: string; pageIndex?: number; pageSize?: number; sorting?: string }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    const res = await api.get<PagedDto<UserDto>>(`${BASE}/users?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<UserDto | null>(`${BASE}/users/${id}`),
  create: (body: CreateUserRequest) => api.post<ResultIdDto>(`${BASE}/users`, body),
  update: (id: string, body: UpdateUserRequest) => api.put<void>(`${BASE}/users/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/users/${id}`)
}

// ─── Profile (current user) ───────────────────────────────────────────────────

export const profileService = {
  getMe: () => api.get<ProfileDto>('/api/auth/me'),
  updateProfile: (body: UpdateProfileRequest) => api.put<void>('/api/auth/profile', body),
  changePassword: (body: ChangePasswordRequest) => api.post<void>('/api/auth/change-password', body)
}
