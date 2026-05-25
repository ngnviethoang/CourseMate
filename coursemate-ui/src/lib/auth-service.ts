import { api } from '@/lib/api-client'
import type {
  LoginCommand,
  LoginResponse,
  ProfileDto,
  RegisterCommand,
  UpdateProfileRequest,
  ChangePasswordRequest,
  VerifyEmailRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RegisterRole
} from '@/lib/types'

const BASE = '/api/auth'
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/$/, '')

export const authService = {
  login: (body: LoginCommand): Promise<LoginResponse> => api.post<LoginResponse>(`${BASE}/login`, body),

  getGoogleSignInUrl: (redirectUrl: string, role: RegisterRole): string => {
    const params = new URLSearchParams({ RedirectUrl: redirectUrl, Role: role })
    return `${API_BASE_URL}${BASE}/signin-google?${params.toString()}`
  },

  register: (body: RegisterCommand): Promise<void> => api.post<void>(`${BASE}/register`, body),

  verifyEmail: (body: VerifyEmailRequest): Promise<void> => api.post<void>(`${BASE}/verify-email`, body),

  forgotPassword: (body: ForgotPasswordRequest): Promise<void> => api.post<void>(`${BASE}/forgot-password`, body),

  resetPassword: (body: ResetPasswordRequest): Promise<void> => api.post<void>(`${BASE}/reset-password`, body)
}

export const profileService = {
  getMe: (): Promise<ProfileDto> => api.get<ProfileDto>(`${BASE}/profile`),

  updateProfile: (data: UpdateProfileRequest): Promise<void> => api.post<void>(`${BASE}/profile`, data),

  changePassword: (data: ChangePasswordRequest): Promise<void> => api.post<void>(`${BASE}/change-password`, data)
}
