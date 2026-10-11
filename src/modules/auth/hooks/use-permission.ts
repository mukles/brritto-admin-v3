import { useAuthStore } from '../stores/auth.store'
import type { Permission } from '../types/auth.types'
import { hasPermission } from '../utils/permissions'

export function usePermission(permission: Permission) {
  return useAuthStore((state) => hasPermission(state.user, permission))
}
