import { env } from '../config/env'
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '../utils/authStorage'

export type ApiError = {
  message: string
  status?: number
  data?: unknown
}

type RequestOptions = {
  method?: string
  body?: unknown
  auth?: boolean
  headers?: Record<string, string>
  retry?: boolean
}

const buildUrl = (path: string) => {
  if (path.startsWith('http')) return path
  return `${env.apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const url = buildUrl(path)
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  }

  const accessToken = getAccessToken()
  if (options.auth && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const bodyIsFormData =
    typeof FormData !== 'undefined' && options.body instanceof FormData

  if (options.body && !bodyIsFormData) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body
      ? bodyIsFormData
        ? (options.body as BodyInit)
        : JSON.stringify(options.body)
      : undefined,
  })

  if (response.status === 401 && options.auth && !options.retry) {
    const refreshToken = getRefreshToken()
    if (refreshToken) {
      try {
        const refreshed = await apiRequest<{ data: { accessToken: string; refreshToken: string } }>(
          '/api/auth/refresh',
          {
            method: 'POST',
            body: { refreshToken },
            retry: true,
          },
        )
        setTokens(refreshed.data.accessToken, refreshed.data.refreshToken)
        return apiRequest<T>(path, { ...options, retry: true })
      } catch {
        clearTokens()
      }
    }
  }

  if (!response.ok) {
    let errorData: unknown = undefined
    try {
      errorData = await response.json()
    } catch {
      // ignore
    }
    const message =
      (errorData as { message?: string })?.message ||
      `Request failed with status ${response.status}`
    const error: ApiError = { message, status: response.status, data: errorData }
    throw error
  }

  if (response.status === 204) {
    return {} as T
  }

  return (await response.json()) as T
}
