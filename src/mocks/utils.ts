import { delay, HttpResponse } from 'msw'
import type { Permission } from '@/modules/auth'
import { env } from '@/shared/config/env'
import { CSRF_COOKIE, CSRF_HEADER } from '@/shared/services/http'
import { findUserById, toAuthUser } from './db'
import { verifyAccessToken } from './tokens'

export const apiUrl = (path: string) => `${env.VITE_API_BASE_URL}${path}`

export const networkDelay = () => delay(import.meta.env.MODE === 'test' ? 0 : 300)

export const errorResponse = (status: number, message: string) =>
  HttpResponse.json({ message }, { status })

export function authenticate(request: Request, permission?: Permission) {
  const token = request.headers.get('Authorization')?.replace(/^Bearer /, '')
  const userId = token ? verifyAccessToken(token) : null
  const user = userId ? findUserById(userId) : undefined
  if (!user) return { error: errorResponse(401, 'Not authenticated') }

  const authUser = toAuthUser(user)
  if (permission && !authUser.permissions.includes(permission)) {
    return { error: errorResponse(403, 'Forbidden') }
  }
  return { user: authUser }
}

export function hasValidCsrf(request: Request, cookies: Record<string, string>) {
  const cookie = cookies[CSRF_COOKIE]
  return Boolean(cookie) && request.headers.get(CSRF_HEADER) === cookie
}
