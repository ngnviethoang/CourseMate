import { api } from '@/lib/api-client'
import type {
  LoginCommand,
  LoginResponse,
  ProfileDto,
  RegisterCommand,
  UpdateProfileRequest,
  ChangePasswordRequest
} from '@/lib/types'

const BASE = '/api/auth'

export const authService = {
  login: (body: LoginCommand): Promise<LoginResponse> => api.post<LoginResponse>(`${BASE}/login`, body),

  register: (body: RegisterCommand): Promise<void> => api.post<void>(`${BASE}/register`, body)
}

export const profileService = {
  getMe: (): Promise<ProfileDto> => api.get<ProfileDto>(`${BASE}/profile`),

  updateProfile: (data: UpdateProfileRequest): Promise<void> => api.post<void>(`${BASE}/profile`, data),

  changePassword: (data: ChangePasswordRequest): Promise<void> => api.post<void>(`${BASE}/change-password`, data)
}
