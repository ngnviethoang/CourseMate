import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
  errorCode?: string
  errorCodeValue?: number
  [key: string]: unknown
}

import { getAccessToken } from '@/lib/auth-token.util'
import { BUSINESS_ERROR_MESSAGE_MAP } from '@/lib/business-error-messages'

const resolveProblemMessage = (problem: ProblemDetails, fallback: string): string =>
  (problem.errorCode && BUSINESS_ERROR_MESSAGE_MAP[problem.errorCode]) ?? problem.detail ?? problem.title ?? fallback

const axiosInstance = axios.create({
  baseURL: BASE_URL
})

axiosInstance.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (BASE_URL?.includes('ngrok-free.dev')) {
    config.headers['ngrok-skip-browser-warning'] = 'true'
  }

  return config
})

axiosInstance.interceptors.response.use(
  response => response.data,
  (error: AxiosError<ProblemDetails>) => {
    const problem: ProblemDetails = error.response?.data || {}
    const status = error.response?.status
    if (status === 403) {
      toast.error(resolveProblemMessage(problem, 'Truy cập bị từ chối.'))
    } else if (status === 422 || status === 400) {
      toast.error(resolveProblemMessage(problem, 'Lỗi xác thực dữ liệu.'))
    } else if (status === 404) {
      toast.error(resolveProblemMessage(problem, 'Không tìm thấy tài nguyên.'))
    } else if (status && status >= 500) {
      toast.error(resolveProblemMessage(problem, 'Đã xảy ra lỗi máy chủ. Vui lòng thử lại.'))
    }

    return Promise.reject(problem)
  }
)

type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>

export const api = {
  get: <T>(url: string, options?: ApiOptions): Promise<T> => axiosInstance.get<unknown, T>(url, options),

  post: <T>(url: string, body?: unknown, options?: ApiOptions): Promise<T> =>
    axiosInstance.post<unknown, T>(url, body, options),

  put: <T>(url: string, body?: unknown, options?: ApiOptions): Promise<T> =>
    axiosInstance.put<unknown, T>(url, body, options),

  patch: <T>(url: string, body?: unknown, options?: ApiOptions): Promise<T> =>
    axiosInstance.patch<unknown, T>(url, body, options),

  delete: <T>(url: string, options?: ApiOptions): Promise<T> => axiosInstance.delete<unknown, T>(url, options)
}
