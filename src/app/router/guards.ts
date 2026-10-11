import { redirect } from '@tanstack/react-router'
import { hasPermission, type Permission } from '@/modules/auth'
import type { RouterContext } from './context'

export function requirePermission(context: RouterContext, permission: Permission) {
  if (!hasPermission(context.auth().user, permission)) {
    throw redirect({ to: '/forbidden' })
  }
}
