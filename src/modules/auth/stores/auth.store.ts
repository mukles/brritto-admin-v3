import { create } from 'zustand'
import type { AuthSession, AuthUser } from '../types/auth.types'

export type AuthStatus = 'pending' | 'authenticated' | 'unauthenticated'

export type AuthState = {
  status: AuthStatus
  user: AuthUser | null
  accessToken: string | null
  setSession: (session: AuthSession) => void
  clearSession: () => void
}

export const useAuthStore = create<AuthState>()((set) => ({
  status: 'pending',
  user: null,
  accessToken: null,
  setSession: ({ accessToken, user }) => set({ status: 'authenticated', accessToken, user }),
  clearSession: () => set({ status: 'unauthenticated', accessToken: null, user: null }),
}))
