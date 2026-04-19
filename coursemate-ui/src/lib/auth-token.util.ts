type JwtPayload = {
  exp?: number
  [key: string]: unknown
}

const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
const USER_ID_CLAIM = 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'

const getAccessToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const decodeJwt = (token: string): JwtPayload => {
  try {
    const payload = token.split('.')[1]
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch (error) {
    console.error(error)
    return {}
  }
}

export const getDecodedToken = (): JwtPayload | null => {
  const token = getAccessToken()
  if (!token) return null
  return decodeJwt(token)
}

export const getRoles = (): string[] => {
  const payload = getDecodedToken()
  if (!payload) return []

  const roles = payload[ROLE_CLAIM]

  if (Array.isArray(roles)) {
    return roles.map(String)
  }

  return roles ? [String(roles)] : []
}

export const getRole = (): string | null => {
  const roles = getRoles()
  return roles.length > 0 ? roles[0] : null
}

export const isTokenExpired = (payload: JwtPayload | null): boolean => {
  if (!payload) return true
  const exp = payload.exp
  if (typeof exp !== 'number') return true
  return exp * 1000 < Date.now()
}

export const getUserId = (): string | null => {
  const payload = getDecodedToken()
  if (!payload) return null
  const userId = payload[USER_ID_CLAIM]
  return userId ? String(userId) : null
}

export const isAuthenticated = (): boolean => {
  return getAccessToken() !== null
}
