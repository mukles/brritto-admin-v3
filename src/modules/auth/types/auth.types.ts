export const ROLES = ['admin', 'manager', 'viewer'] as const
export type Role = (typeof ROLES)[number]

export const PERMISSIONS = ['dashboard:view', 'users:read', 'users:write'] as const
export type Permission = (typeof PERMISSIONS)[number]

export type AuthUser = {
  id: string
  name: string
  email: string
  role: Role
  permissions: Permission[]
}

export type LoginCredentials = {
  email: string
  password: string
}

export type AuthSession = {
  accessToken: string
  expiresIn: number
  user: AuthUser
}
