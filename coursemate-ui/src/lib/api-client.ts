import axios, { AxiosError, AxiosRequestConfig } from 'axios'
import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
}

const axiosInstance = axios.create({
  baseURL: BASE_URL
})

axiosInstance.interceptors.request.use(async config => {
  let token = ''
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      token = cookieStore.get('accessToken')?.value ?? ''
    } catch (error) {
      console.warn('Cannot access cookies on server:', error)
    }
  } else {
    token =
      document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1] ?? ''
  }

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  if (BASE_URL?.includes('ngrok-free.dev')) {
    config.headers['ngrok-skip-browser-warning'] = 'true'
  }

  return config
})

axiosInstance.interceptors.response.use(
  response => {
    if (response.status === 204) {
      return null
    }
    return response.data
  },
  (error: AxiosError<ProblemDetails>) => {
    let problem: ProblemDetails = error.response?.data || {}

    const status = error.response?.status

    if (status === 403) {
      toast.error(problem.detail ?? 'Access denied.')
    } else if (status === 422 || status === 400) {
      toast.error(problem.detail ?? problem.title ?? 'Validation error.')
    } else if (status === 404) {
      toast.error(problem.detail ?? 'Resource not found.')
    } else if (status && status >= 500) {
      toast.error(problem.detail ?? 'A server error occurred. Please try again.')
    }

    return Promise.reject(problem)
  }
)

type ApiOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>

export const api = {
  get: <T>(url: string, options?: ApiOptions): Promise<T> => axiosInstance.get<any, T>(url, options),

  post: <T>(url: string, body?: unknown, options?: ApiOptions): Promise<T> =>
    axiosInstance.post<any, T>(url, body, options),

  put: <T>(url: string, body?: unknown, options?: ApiOptions): Promise<T> =>
    axiosInstance.put<any, T>(url, body, options),

  patch: <T>(url: string, body?: unknown, options?: ApiOptions): Promise<T> =>
    axiosInstance.patch<any, T>(url, body, options),

  delete: <T>(url: string, options?: ApiOptions): Promise<T> => axiosInstance.delete<any, T>(url, options)
}
