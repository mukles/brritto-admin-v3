import { toast } from 'sonner'
import { configureApiAuth } from '@/shared/services/http'
import { useAuthStore } from '../stores/auth.store'
import type { AuthSession, AuthUser, LoginCredentials } from '../types/auth.types'
import { authApi } from './auth.api'

const REFRESH_LEEWAY_MS = 60_000

let refreshTimer: ReturnType<typeof setTimeout> | undefined
let inflightRefresh: Promise<boolean> | null = null
let signedOut = false

function startSession(session: AuthSession) {
  signedOut = false
  useAuthStore.getState().setSession(session)
  clearTimeout(refreshTimer)
  const delay = Math.max(session.expiresIn * 1000 - REFRESH_LEEWAY_MS, 0)
  refreshTimer = setTimeout(() => void refreshSession(), delay)
}

function endSession() {
  clearTimeout(refreshTimer)
  useAuthStore.getState().clearSession()
}

export function refreshSession(): Promise<boolean> {
  inflightRefresh ??= authApi
    .refresh()
    .then((session) => {
      startSession(session)
      return true
    })
    .catch(() => {
      endSession()
      return false
    })
    .finally(() => {
      inflightRefresh = null
    })
  return inflightRefresh
}

export async function login(credentials: LoginCredentials): Promise<AuthUser> {
  const session = await authApi.login(credentials)
  startSession(session)
  return session.user
}

export async function logout() {
  signedOut = true
  try {
    await authApi.logout()
  } finally {
    endSession()
  }
}

export function initAuth() {
  configureApiAuth({
    getAccessToken: () => useAuthStore.getState().accessToken,
    refreshSession,
    onSessionExpired: () => {
      endSession()
      if (!signedOut)
        toast.error('Your session expired. Please sign in again.', { id: 'session-expired' })
    },
  })
  return refreshSession()
}
