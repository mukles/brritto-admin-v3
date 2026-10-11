import { http, HttpResponse } from 'msw'
import { CSRF_COOKIE } from '@/shared/services/http'
import { findUserByEmail, findUserById, toAuthUser, DEMO_PASSWORD } from '../db'
import {
  ACCESS_TOKEN_TTL_S,
  issueAccessToken,
  issueRefreshToken,
  REFRESH_TOKEN_TTL_S,
  revokeRefreshToken,
  rotateRefreshToken,
} from '../tokens'
import { apiUrl, errorResponse, hasValidCsrf, networkDelay } from '../utils'

const REFRESH_COOKIE = 'refresh_token'

function sessionCookies(refreshToken: string): [string, string][] {
  return [
    [
      'Set-Cookie',
      `${REFRESH_COOKIE}=${refreshToken}; Path=/; Max-Age=${REFRESH_TOKEN_TTL_S}; SameSite=Strict`,
    ],
    [
      'Set-Cookie',
      `${CSRF_COOKIE}=${crypto.randomUUID()}; Path=/; Max-Age=${REFRESH_TOKEN_TTL_S}; SameSite=Strict`,
    ],
  ]
}

const clearedCookies: [string, string][] = [
  ['Set-Cookie', `${REFRESH_COOKIE}=; Path=/; Max-Age=0`],
  ['Set-Cookie', `${CSRF_COOKIE}=; Path=/; Max-Age=0`],
]

function sessionResponse(userId: string, refreshToken: string) {
  const user = findUserById(userId)
  if (!user) return errorResponse(401, 'Session expired')
  return HttpResponse.json(
    {
      accessToken: issueAccessToken(user.id),
      expiresIn: ACCESS_TOKEN_TTL_S,
      user: toAuthUser(user),
    },
    { headers: sessionCookies(refreshToken) },
  )
}

export const authHandlers = [
  http.post(apiUrl('/auth/login'), async ({ request }) => {
    await networkDelay()
    const body = (await request.json().catch(() => null)) as {
      email?: unknown
      password?: unknown
    } | null
    const user = findUserByEmail(body?.email)
    if (!user || body?.password !== DEMO_PASSWORD) {
      return errorResponse(401, 'Invalid email or password')
    }
    return sessionResponse(user.id, issueRefreshToken(user.id))
  }),

  http.post(apiUrl('/auth/refresh'), async ({ request, cookies }) => {
    await networkDelay()
    if (cookies[REFRESH_COOKIE] && !hasValidCsrf(request, cookies)) {
      return errorResponse(403, 'Invalid CSRF token')
    }
    const rotated = rotateRefreshToken(cookies[REFRESH_COOKIE])
    if (!rotated) {
      return HttpResponse.json(
        { message: 'Session expired' },
        { status: 401, headers: clearedCookies },
      )
    }
    return sessionResponse(rotated.userId, rotated.refreshToken)
  }),

  http.post(apiUrl('/auth/logout'), async ({ request, cookies }) => {
    await networkDelay()
    if (!hasValidCsrf(request, cookies)) {
      return errorResponse(403, 'Invalid CSRF token')
    }
    revokeRefreshToken(cookies[REFRESH_COOKIE])
    return new HttpResponse(null, { status: 204, headers: clearedCookies })
  }),
]
