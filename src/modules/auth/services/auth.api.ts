import { api } from '@/shared/services/http'
import type { AuthSession, LoginCredentials } from '../types/auth.types'

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthSession>('/auth/login', credentials, { auth: false }),
  refresh: () => api.post<AuthSession>('/auth/refresh', undefined, { auth: false }),
  logout: () => api.post<void>('/auth/logout', undefined, { auth: false }),
}
