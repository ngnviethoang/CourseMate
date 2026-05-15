import { api } from './api-client'

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
  examples: any[]
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
  getList: (params: any) => {
    const searchParams = new URLSearchParams(params)
    return api.get<any>(`/api/contests?${searchParams}`)
  },
  getById: (id: string) => api.get<ContestDto>(`/api/contests/${id}`),
  create: (data: any) => api.post<any>('/api/contests', data),
  update: (id: string, data: any) => api.put(`/api/contests/${id}`, data),
  addExercise: (id: string, data: any) => api.post(`/api/contests/${id}/exercises`, data),

  // Student APIs
  register: (id: string) => api.post(`/api/contests/${id}/register`, {}),
  checkIn: (id: string) => api.post(`/api/contests/${id}/check-in`, {}),
  getWorkspace: (id: string) => api.get<ContestWorkspaceDto>(`/api/contests/${id}/workspace`),
  submitExercise: (id: string, exerciseId: string, payload: any) =>
    api.post(`/api/contests/${id}/exercises/${exerciseId}/submit`, payload),
  finish: (id: string) => api.post(`/api/contests/${id}/finish`, {}),
  getLeaderboard: (id: string) => api.get<ContestLeaderboardDto>(`/api/contests/${id}/leaderboard`),

  // Anti-Cheat APIs
  getViolations: (id: string) => api.get<any>(`/api/contests/${id}/violations`),
  disqualifyStudent: (id: string, studentId: string, reason: string) =>
    api.post(`/api/contests/${id}/disqualify/${studentId}`, { reason }),
  reinstateStudent: (id: string, studentId: string) => api.post(`/api/contests/${id}/reinstate/${studentId}`, {})
}
