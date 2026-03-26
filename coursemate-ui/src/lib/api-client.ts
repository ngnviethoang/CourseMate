import { toast } from 'sonner'

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''

interface ProblemDetails {
  type?: string
  title?: string
  status?: number
  detail?: string
  instance?: string
}

type FetchOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
}

async function apiClient<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options

  let token = ''
  if (typeof window === 'undefined') {
    try {
      const { cookies } = await import('next/headers')
      const cookieStore = await cookies()
      token = cookieStore.get('accessToken')?.value ?? ''
    } catch {
      // ignore
    }
  } else {
    token =
      document.cookie
        .split('; ')
        .find(row => row.startsWith('accessToken='))
        ?.split('=')[1] ?? ''
  }

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const reqHeaders: Record<string, string> = {
    ...(headers as Record<string, string>)
  }

  if (!isFormData && !reqHeaders['Content-Type']) {
    reqHeaders['Content-Type'] = 'application/json'
  }

  if (token) {
    reqHeaders['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...rest,
    headers: reqHeaders,
    body: isFormData ? (body as FormData) : body !== undefined ? JSON.stringify(body) : undefined
  })

  if (!res.ok) {
    let problem: ProblemDetails = {}

    try {
      problem = await res.json()
    } catch {
      // response body is not JSON, ignore
    }

    if (res.status === 403) {
      toast.error(problem.detail ?? 'Access denied.')
    } else if (res.status === 422 || res.status === 400) {
      toast.error(problem.detail ?? problem.title ?? 'Validation error.')
    } else if (res.status === 404) {
      toast.error(problem.detail ?? 'Resource not found.')
    } else if (res.status >= 500) {
      toast.error(problem.detail ?? 'A server error occurred. Please try again.')
    }

    throw problem
  }

  // 204 No Content
  if (res.status === 204) {
    return null as T
  }

  return res.json() as Promise<T>
}

export const api = {
  get: <T>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'GET' }),

  post: <T>(url: string, body?: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'POST', body }),

  put: <T>(url: string, body?: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'PUT', body }),

  patch: <T>(url: string, body?: unknown, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'PATCH', body }),

  delete: <T>(url: string, options?: Omit<FetchOptions, 'method' | 'body'>) =>
    apiClient<T>(url, { ...options, method: 'DELETE' })
}
