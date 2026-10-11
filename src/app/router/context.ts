import type { QueryClient } from '@tanstack/react-query'
import type { AuthState } from '@/modules/auth'

export type RouterContext = {
  queryClient: QueryClient
  auth: () => AuthState
}
