import { api } from '@/lib/api-client'
import type { LoginCommand, LoginResponse, RegisterCommand } from '@/lib/types'

const BASE = '/api/auth'

export const authService = {
  login: (body: LoginCommand) => api.post<LoginResponse>(`${BASE}/login`, body),
  register: (body: RegisterCommand) => api.post<void>(`${BASE}/register`, body)
}
