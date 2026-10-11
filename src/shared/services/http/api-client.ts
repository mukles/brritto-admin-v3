import { env } from '@/shared/config/env'
import { getCookie } from '@/shared/utils/cookies'
import { ApiError } from './api-error'

export const CSRF_COOKIE = 'csrf_token'
export const CSRF_HEADER = 'X-CSRF-Token'

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS'])

export type ApiAuthHooks = {
  getAccessToken: () => string | null
  refreshSession: () => Promise<boolean>
  onSessionExpired: () => void
}

let authHooks: ApiAuthHooks | null = null

export function configureApiAuth(hooks: ApiAuthHooks | null) {
  authHooks = hooks
}

export type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown
  auth?: boolean
}

export async function apiRequest<T>(
  path: string,
  { auth = true, ...init }: RequestOptions = {},
): Promise<T> {
  let response = await send(path, init, auth)

  if (response.status === 401 && auth && authHooks) {
    const refreshed = await authHooks.refreshSession()
    if (!refreshed) {
      authHooks.onSessionExpired()
      throw await toApiError(response)
    }
    response = await send(path, init, auth)
  }

  if (!response.ok) throw await toApiError(response)
  if (response.status === 204) return undefined as T
  return (await response.json()) as T
}

function send(
  path: string,
  { body, headers: initHeaders, method = 'GET', ...init }: RequestOptions,
  auth: boolean,
) {
  const headers = new Headers(initHeaders)
  headers.set('Accept', 'application/json')
  if (body !== undefined) headers.set('Content-Type', 'application/json')

  if (auth) {
    const token = authHooks?.getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  if (!SAFE_METHODS.has(method.toUpperCase())) {
    const csrfToken = getCookie(CSRF_COOKIE)
    if (csrfToken) headers.set(CSRF_HEADER, csrfToken)
  }

  const url = new URL(`${env.VITE_API_BASE_URL}${path}`, window.location.origin)
  return fetch(url, {
    ...init,
    method,
    headers,
    credentials: 'include',
    body: body === undefined ? undefined : JSON.stringify(body),
  })
}

async function toApiError(response: Response) {
  const data: unknown = await response.json().catch(() => null)
  const message =
    data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
      ? data.message
      : response.statusText || 'Request failed'
  return new ApiError(response.status, message, data)
}

type MethodOptions = Omit<RequestOptions, 'method' | 'body'>

export const api = {
  get: <T>(path: string, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: unknown, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body?: unknown, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body?: unknown, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: MethodOptions) =>
    apiRequest<T>(path, { ...options, method: 'DELETE' }),
}
