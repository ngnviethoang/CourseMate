import { api } from './api-client'
import { ExerciseExampleDto, ResultIdDto } from './types'

interface PagedDto<T> {
  items: T[]
  totalCount: number
  pageIndex: number
  pageSize: number
}

export interface ContestDto {
  id: string
  title: string
  description: string
  status: 'Draft' | 'Upcoming' | 'Ongoing' | 'Ended'
  startTime?: string
  endTime?: string
  durationInMinutes: number
  allowedLanguages: string
  memoryLimit: number
  timeLimit: number
  antiCheatLevel: 'None' | 'Basic' | 'Strict'
  maxViolations: number
  creatorId: string
  creatorName?: string
  creationTime: string
  lastModificationTime?: string
  exerciseCount: number
  participantCount: number
  isRegistered?: boolean
  exercises: ContestExerciseDto[]
}

export interface ContestWorkspaceDto {
  id: string
  title: string
  status: 'Draft' | 'Upcoming' | 'Ongoing' | 'Ended'
  startTime?: string
  endTime?: string
  durationInMinutes: number
  joinTime?: string
  antiCheatLevel: 'None' | 'Basic' | 'Strict'
  maxViolations: number
  violationCount: number
  isDisqualified: boolean
  exercises: ContestExerciseDto[]
}

export interface ContestExerciseDto {
  id: string
  exerciseId: string
  title: string
  description: string
  scoreWeight: number
  order: number
  bestScore?: number
  isPassed: boolean
  examples: ExerciseExampleDto[]
  constraints: string[]
  hints: string[]
  defaultCodes: { language: string; starterCode: string }[]
  testCases: {
    id: string
    input: string
    expectedOutput: string
    description: string
    isHidden: boolean
    order: number
  }[]
}

export interface ContestLeaderboardDto {
  contestId: string
  contestTitle: string
  entries: LeaderboardEntryDto[]
}

export interface LeaderboardEntryDto {
  rank: number
  studentId: string
  studentName: string
  totalScore: number
  totalRuntime: number
  lastSubmitTime: string
  isDisqualified: boolean
}

export const contestService = {
  getList: (params: { filter?: string; status?: string; sorting?: string; pageIndex?: number; pageSize?: number }) => {
    const searchParams = new URLSearchParams()
    if (params.filter) searchParams.set('filter', params.filter)
    if (params.status) searchParams.set('status', params.status)
    if (params.sorting) searchParams.set('sorting', params.sorting)
    if (params.pageIndex != null) searchParams.set('pageIndex', String(params.pageIndex))
    if (params.pageSize != null) searchParams.set('pageSize', String(params.pageSize))
    return api.get<PagedDto<ContestDto>>(`/api/contests?${searchParams}`)
  },
  getById: (id: string) => api.get<ContestDto>(`/api/contests/${id}`),
  create: (data: unknown) => api.post<ResultIdDto>('/api/contests', data),
  update: (id: string, data: unknown) => api.put<void>(`/api/contests/${id}`, data),
  addExercise: (id: string, data: unknown) => api.post<ResultIdDto>(`/api/contests/${id}/exercises`, data),
  getExercises: (id: string) => api.get<ContestExerciseDto[]>(`/api/contests/${id}/exercises`),
  removeExercise: (contestId: string, contestExerciseId: string) =>
    api.delete<void>(`/api/contests/${contestId}/exercises/${contestExerciseId}`),

  // Student APIs
  register: (id: string) => api.post(`/api/contests/${id}/register`, {}),
  checkIn: (id: string) => api.post(`/api/contests/${id}/check-in`, {}),
  getWorkspace: (id: string) => api.get<ContestWorkspaceDto>(`/api/contests/${id}/workspace`),
  submitExercise: (id: string, exerciseId: string, payload: unknown) =>
    api.post(`/api/contests/${id}/exercises/${exerciseId}/submit`, payload),
  finish: (id: string) => api.post(`/api/contests/${id}/finish`, {}),
  getLeaderboard: (id: string) => api.get<ContestLeaderboardDto>(`/api/contests/${id}/leaderboard`),

  // Anti-Cheat APIs
  getViolations: (id: string) => api.get<any>(`/api/contests/${id}/violations`),
  disqualifyStudent: (id: string, studentId: string, reason: string) =>
    api.post(`/api/contests/${id}/disqualify/${studentId}`, { reason }),
  reinstateStudent: (id: string, studentId: string) => api.post(`/api/contests/${id}/reinstate/${studentId}`, {})
}
