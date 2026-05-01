import { api } from './api-client'
import { getUserId } from './auth-token.util'
import {
  PagedDto,
  CourseDto,
  CreateCourseRequest,
  UpdateCourseRequest,
  ResultIdDto,
  ChapterDto,
  CreateChapterRequest,
  UpdateChapterRequest,
  LessonDto,
  LessonDetailDto,
  CreateLessonRequest,
  UpdateLessonRequest,
  UpsertLessonVideoRequest,
  UpsertLessonReadingRequest,
  UpsertLessonCodingRequest,
  UpsertLessonQuizRequest,
  UpsertLessonSlideRequest,
  StudentMyCourseDto,
  CourseDetailDto,
  ExerciseDto
} from './types'

export const courseService = {
  // ─── Course ──────────────────────────────────────────────────────────────────
  list: async (params?: {
    filter?: string
    pageIndex?: number
    pageSize?: number
    sorting?: string
    categoryId?: string
  }) => {
    const qs = new URLSearchParams()
    if (params?.filter) qs.set('filter', params.filter)
    if (params?.pageIndex != null) qs.set('pageIndex', String(params.pageIndex + 1))
    if (params?.pageSize != null) qs.set('pageSize', String(params.pageSize))
    if (params?.sorting) qs.set('sorting', params.sorting)
    if (params?.categoryId) qs.set('categoryId', params.categoryId)
    const res = await api.get<PagedDto<CourseDto>>(`/api/courses?${qs}`)
    if (res) res.pageIndex -= 1
    return res
  },
  getById: (id: string) => api.get<CourseDetailDto | null>(`/api/courses/${id}`),
  create: (body: CreateCourseRequest) => api.post<ResultIdDto>('/api/courses', body),
  update: (id: string, body: UpdateCourseRequest) => api.put<void>(`/api/courses/${id}`, body),
  delete: (id: string) => api.delete<void>(`/api/courses/${id}`),

  getMyCourses: async (pageIndex = 1, pageSize = 12, filter?: string): Promise<PagedDto<StudentMyCourseDto>> => {
    const studentId = getUserId()
    const params = new URLSearchParams({ pageIndex: String(pageIndex), pageSize: String(pageSize), studentId: studentId ?? '' })
    if (filter) params.set('filter', filter)
    return api.get<PagedDto<StudentMyCourseDto>>(`/api/courses/my?${params}`)
  },
  getRecommendedCourses: async (pageIndex = 1, pageSize = 12): Promise<PagedDto<CourseDto>> => {
    const params = new URLSearchParams({ pageIndex: String(pageIndex), pageSize: String(pageSize) })
    return api.get<PagedDto<CourseDto>>(`/api/courses/recommended?${params}`)
  },

  // ─── Chapter ─────────────────────────────────────────────────────────────────
  listChapters: async (params?: {
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
  getChapterById: (id: string) => api.get<ChapterDto | null>(`/api/chapters/${id}`),
  createChapter: (body: CreateChapterRequest) => api.post<ResultIdDto>('/api/chapters', body),
  updateChapter: (id: string, body: UpdateChapterRequest) => api.put<void>(`/api/chapters/${id}`, body),
  deleteChapter: (id: string) => api.delete<void>(`/api/chapters/${id}`),

  // ─── Lesson ──────────────────────────────────────────────────────────────────
  listLessons: async (params?: {
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

    const res = await api.get<PagedDto<LessonDto>>(`/api/lessons?${qs}`)
    if (res) {
      res.pageIndex -= 1
    }
    return res
  },
  getLessonById: async (id: string) => {
    return api.get<LessonDto | null>(`/api/lessons/${id}`)
  },
  getLessonDetail: async (id: string) => {
    return api.get<LessonDetailDto | null>(`/api/lessons/${id}/detail`)
  },
  createLesson: (body: CreateLessonRequest) => {
    return api.post<ResultIdDto>('/api/lessons', body)
  },
  updateLesson: (id: string, body: UpdateLessonRequest) => {
    return api.put<void>(`/api/lessons/${id}`, body)
  },
  upsertLessonVideo: (id: string, body: UpsertLessonVideoRequest) => api.put<void>(`/api/lessons/${id}/video`, body),
  upsertLessonReading: (id: string, body: UpsertLessonReadingRequest) => api.put<void>(`/api/lessons/${id}/reading`, body),
  upsertLessonCoding: (id: string, body: UpsertLessonCodingRequest) => api.put<void>(`/api/lessons/${id}/coding`, body),
  upsertLessonQuiz: (id: string, body: UpsertLessonQuizRequest) => api.put<void>(`/api/lessons/${id}/quiz`, body),
  upsertLessonSlide: (id: string, body: UpsertLessonSlideRequest) => api.put<void>(`/api/lessons/${id}/slide`, body),
  deleteLesson: (id: string) => api.delete<void>(`/api/lessons/${id}`),

  searchExercises: async (filter?: string, pageIndex = 1, pageSize = 20) => {
    const qs = new URLSearchParams({ pageIndex: String(pageIndex), pageSize: String(pageSize) })
    if (filter) qs.set('filter', filter)
    return api.get<PagedDto<ExerciseDto>>(`/api/exercises?${qs}`)
  }
}

export const chapterService = {
  list: courseService.listChapters,
  getById: courseService.getChapterById,
  create: courseService.createChapter,
  update: courseService.updateChapter,
  delete: courseService.deleteChapter
}

export const lessonService = {
  list: courseService.listLessons,
  getById: courseService.getLessonById,
  getDetail: courseService.getLessonDetail,
  create: courseService.createLesson,
  update: courseService.updateLesson,
  upsertVideo: courseService.upsertLessonVideo,
  upsertReading: courseService.upsertLessonReading,
  upsertCoding: courseService.upsertLessonCoding,
  upsertQuiz: courseService.upsertLessonQuiz,
  upsertSlide: courseService.upsertLessonSlide,
  delete: courseService.deleteLesson,
  searchExercises: courseService.searchExercises,
  updateProgress: (lessonId: string, isCompleted: boolean, score: number = 0) => 
    api.put<ResultIdDto>(`/api/lessons/${lessonId}/progress`, { lessonId, isCompleted, score })
}
