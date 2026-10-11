import type { ReactNode } from 'react'
import { usePermission } from '../hooks/use-permission'
import type { Permission } from '../types/auth.types'

type CanProps = {
  permission: Permission
  children: ReactNode
  fallback?: ReactNode
}

export function Can({ permission, children, fallback = null }: CanProps) {
  return usePermission(permission) ? children : fallback
}
