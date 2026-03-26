import { api } from '@/lib/api-client'
import type { LoginCommand, LoginResponse, ProfileDto, RegisterCommand } from '@/lib/types'

const BASE = '/api/auth'

export const authService = {
  login: (body: LoginCommand) => api.post<LoginResponse>(`${BASE}/login`, body),
  register: (body: RegisterCommand) => api.post<void>(`${BASE}/register`, body),
  updateProfile: (data: any): Promise<void> => api.post<void>(`${BASE}/profile`, data),
  getProfile: (): Promise<ProfileDto> => api.get<ProfileDto>(`${BASE}/profile`),
  changePassword: (data: any): Promise<void> => api.post<void>(`${BASE}/change-password`, data)
}
