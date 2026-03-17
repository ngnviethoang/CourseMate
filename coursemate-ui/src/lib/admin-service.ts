import { api } from '@/lib/api-client'
import type {
  CategoryDto,
  ChapterDto,
  CourseDto,
  CreateCategoryRequest,
  CreateChapterRequest,
  CreateCourseRequest,
  CreateLessonRequest,
  CreateUserRequest,
  LessonDto,
  PagedDto,
  ResultIdDto,
  UpdateCategoryRequest,
  UpdateChapterRequest,
  UpdateCourseRequest,
  UpdateLessonRequest,
  UpdateUserRequest,
  UserDto
} from '@/lib/types'

const BASE = '/api/admin'

// ─── Category ────────────────────────────────────────────────────────────────

export const categoryService = {
  list: (params?: { filter?: string; pageIndex?: number; pageSize?: number }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    return api.get<PagedDto<CategoryDto>>(`${BASE}/categories?${qs}`)
  },
  getById: (id: string) => api.get<CategoryDto | null>(`${BASE}/categories/${id}`),
  create: (body: CreateCategoryRequest) => api.post<ResultIdDto>(`${BASE}/categories`, body),
  update: (id: string, body: UpdateCategoryRequest) => api.put<void>(`${BASE}/categories/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/categories/${id}`)
}

// ─── Course ──────────────────────────────────────────────────────────────────

export const courseService = {
  list: (params?: { filter?: string; pageIndex?: number; pageSize?: number }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    return api.get<PagedDto<CourseDto>>(`${BASE}/courses?${qs}`)
  },
  getById: (id: string) => api.get<CourseDto | null>(`${BASE}/courses/${id}`),
  create: (body: CreateCourseRequest) => api.post<ResultIdDto>(`${BASE}/courses`, body),
  update: (id: string, body: UpdateCourseRequest) => api.put<void>(`${BASE}/courses/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/courses/${id}`)
}

// ─── Chapter ─────────────────────────────────────────────────────────────────

export const chapterService = {
  list: (params?: { filter?: string; pageIndex?: number; pageSize?: number }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    return api.get<PagedDto<ChapterDto>>(`${BASE}/chapters?${qs}`)
  },
  getById: (id: string) => api.get<ChapterDto | null>(`${BASE}/chapters/${id}`),
  create: (body: CreateChapterRequest) => api.post<ResultIdDto>(`${BASE}/chapters`, body),
  update: (id: string, body: UpdateChapterRequest) => api.put<void>(`${BASE}/chapters/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/chapters/${id}`)
}

// ─── Lesson ──────────────────────────────────────────────────────────────────

export const lessonService = {
  list: (params?: { filter?: string; pageIndex?: number; pageSize?: number }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    return api.get<PagedDto<LessonDto>>(`${BASE}/lessons?${qs}`)
  },
  getById: (id: string) => api.get<LessonDto | null>(`${BASE}/lessons/${id}`),
  create: (body: CreateLessonRequest) => api.post<ResultIdDto>(`${BASE}/lessons`, body),
  update: (id: string, body: UpdateLessonRequest) => api.put<void>(`${BASE}/lessons/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/lessons/${id}`)
}

// ─── User ────────────────────────────────────────────────────────────────────

export const userService = {
  list: (params?: { filter?: string; pageIndex?: number; pageSize?: number }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    return api.get<PagedDto<UserDto>>(`${BASE}/users?${qs}`)
  },
  getById: (id: string) => api.get<UserDto | null>(`${BASE}/users/${id}`),
  create: (body: CreateUserRequest) => api.post<ResultIdDto>(`${BASE}/users`, body),
  update: (id: string, body: UpdateUserRequest) => api.put<void>(`${BASE}/users/${id}`, body),
  delete: (id: string) => api.delete<void>(`${BASE}/users/${id}`)
}
