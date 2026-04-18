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

export const authService = {
  login: (body: LoginCommand) => api.post<LoginResponse>(`${BASE}/login`, body),
  register: (body: RegisterCommand) => api.post<void>(`${BASE}/register`, body)
}

export const profileService = {
  getMe: (): Promise<ProfileDto> => api.get<ProfileDto>(`${BASE}/profile`),
  updateProfile: (data: UpdateProfileRequest): Promise<void> => api.post<void>(`${BASE}/profile`, data),
  changePassword: (data: ChangePasswordRequest): Promise<void> => api.post<void>(`${BASE}/change-password`, data)
}
