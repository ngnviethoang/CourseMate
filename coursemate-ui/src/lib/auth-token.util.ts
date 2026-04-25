type JwtPayload = {
  exp?: number
  [key: string]: unknown
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const USER_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

export const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null

  // Try cookie first (more reliable for SSR sync)
  const match = document.cookie.match(/(?:^|;\s*)accessToken=([^;]+)/)
  if (match) return match[1]

  // Fallback to localStorage
  return localStorage.getItem('accessToken')
}

export const saveToken = (token: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('accessToken', token)
  document.cookie = `accessToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`
}

export const removeToken = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem('accessToken')
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
}

export const decodeJwt = (token: string): JwtPayload => {
  try {
    const payloadPart = token.split('.')[1]
    const base64 = payloadPart.replace(/-/g, '+').replace(/_/g, '/')
    const rawPayload = JSON.parse(atob(base64))

    // Normalize claims
    const normalized: JwtPayload = { ...rawPayload }

    if (rawPayload[ROLE_CLAIM]) {
      normalized.role = rawPayload[ROLE_CLAIM]
    }
    if (rawPayload[USER_ID_CLAIM]) {
      normalized.userId = rawPayload[USER_ID_CLAIM]
      normalized.sub = rawPayload[USER_ID_CLAIM]
    }
    if (rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']) {
      normalized.email = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']
    }
    if (rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']) {
      normalized.name = rawPayload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']
    }

    return normalized
  } catch (error) {
    console.error('Failed to decode JWT:', error)
    return {}
  }
}

export const getDecodedToken = (providedToken?: string): JwtPayload | null => {
  const token = providedToken || getAccessToken()
  if (!token) return null
  return decodeJwt(token)
}

export const getRoles = (providedToken?: string): string[] => {
  const payload = getDecodedToken(providedToken)
  if (!payload) return []

  const roles = payload[ROLE_CLAIM] || payload['role']

  if (Array.isArray(roles)) {
    return roles.map(String)
  }

  return roles ? [String(roles)] : []
}

export const getRole = (providedToken?: string): string | null => {
  const roles = getRoles(providedToken)
  return roles.length > 0 ? roles[0] : null
}

export const isTokenExpired = (payload: JwtPayload | null): boolean => {
  if (!payload) return true
  const exp = payload.exp
  if (typeof exp !== 'number') return true
  return exp * 1000 < Date.now()
}

export const getUserId = (providedToken?: string): string | null => {
  const payload = getDecodedToken(providedToken)
  if (!payload) return null
  const userId = payload[USER_ID_CLAIM] || payload['userId'] || payload['sub']
  return userId ? String(userId) : null
}

export const isAuthenticated = (providedToken?: string): boolean => {
  return (providedToken || getAccessToken()) !== null
}
