import { api } from './api-client'
import type {
  ExerciseDto,
  ExerciseDetailDto,
  CreateExerciseRequest,
  UpdateExerciseRequest,
  PagedDto,
  ResultIdDto
} from './types'

export const exerciseService = {
  getList: (params: {
    pageIndex?: number
    pageSize?: number
    filter?: string
    difficulty?: string
    category?: string
    sorting?: string
  }) => api.get<PagedDto<ExerciseDto>>('/api/exercises', { params }),

  getById: (id: string) => api.get<ExerciseDetailDto>(`/api/exercises/${id}`),

  getStudentExerciseById: (id: string) => api.get<ExerciseDetailDto>(`/api/exercises/${id}/student`),

  getSubmissions: (id: string) => api.get<unknown[]>(`/api/exercises/${id}/submissions`),

  create: (data: CreateExerciseRequest) => api.post<ResultIdDto>('/api/exercises', data),

  update: (data: UpdateExerciseRequest) => api.put(`/api/exercises/${data.id}`, data),

  delete: (id: string) => api.delete(`/api/exercises/${id}`),

  // Test Cases
  addTestCase: (exerciseId: string, data: unknown) =>
    api.post<unknown>(`/api/exercises/${exerciseId}/test-cases`, data),

  updateTestCase: (exerciseId: string, tcId: string, data: unknown) =>
    api.put(`/api/exercises/${exerciseId}/test-cases/${tcId}`, data),

  deleteTestCase: (exerciseId: string, tcId: string) => api.delete(`/api/exercises/${exerciseId}/test-cases/${tcId}`),

  // Default Codes
  upsertDefaultCode: (exerciseId: string, data: { language: string; starterCode: string }) =>
    api.post(`/api/exercises/${exerciseId}/default-codes`, data),

  // Submissions
  submitExercise: (exerciseId: string, data: unknown) =>
    api.post<unknown>(`/api/exercises/${exerciseId}/submissions`, data)
}
