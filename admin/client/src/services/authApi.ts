import { apiRequest } from './apiClient'

export type AuthResponse = {
  success: boolean
  message: string
  data: {
    user: {
      id: string
      name: string
      email: string
      role: string
    }
    accessToken: string
    refreshToken: string
    expiresAt: number
  }
}

export const login = (payload: { email: string; password: string }) => {
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: payload,
  })
}

export const register = (payload: {
  name: string
  email: string
  password: string
  confirmPassword?: string
  role?: string
}) => {
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: payload,
  })
}

export const logout = (refreshToken: string) => {
  return apiRequest('/api/auth/logout', {
    method: 'POST',
    body: { refreshToken },
  })
}
