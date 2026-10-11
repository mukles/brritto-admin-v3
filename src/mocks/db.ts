import { PERMISSIONS, type AuthUser, type Permission, type Role } from '@/modules/auth'
import type { User, UserStatus } from '@/modules/users'

export const DEMO_PASSWORD = 'password123'

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  admin: [...PERMISSIONS],
  manager: ['dashboard:view', 'users:read'],
  viewer: ['dashboard:view'],
}

const FIRST_NAMES = [
  'Ava',
  'Noah',
  'Mia',
  'Liam',
  'Zara',
  'Omar',
  'Lena',
  'Ravi',
  'Ines',
  'Kai',
  'Sara',
  'Yusuf',
]
const LAST_NAMES = ['Rahman', 'Chen', 'Okafor', 'Silva', 'Haddad', 'Novak', 'Patel', 'Kim']
const STATUSES: UserStatus[] = ['active', 'active', 'active', 'invited', 'suspended']
const ROLES: Role[] = ['viewer', 'viewer', 'manager', 'admin']

const demoAccounts: User[] = [
  {
    id: 'u_admin',
    name: 'Amina Admin',
    email: 'admin@brritto.dev',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-12T09:00:00Z',
  },
  {
    id: 'u_manager',
    name: 'Milo Manager',
    email: 'manager@brritto.dev',
    role: 'manager',
    status: 'active',
    createdAt: '2025-03-04T09:00:00Z',
  },
  {
    id: 'u_viewer',
    name: 'Vera Viewer',
    email: 'viewer@brritto.dev',
    role: 'viewer',
    status: 'active',
    createdAt: '2025-05-21T09:00:00Z',
  },
]

const generatedUsers: User[] = Array.from({ length: 24 }, (_, index) => {
  const first = FIRST_NAMES[index % FIRST_NAMES.length]
  const last = LAST_NAMES[index % LAST_NAMES.length]
  return {
    id: `u_${index + 1}`,
    name: `${first} ${last}`,
    email: `${first}.${last}${index + 1}@example.com`.toLowerCase(),
    role: ROLES[index % ROLES.length],
    status: STATUSES[index % STATUSES.length],
    createdAt: new Date(Date.UTC(2025, index % 12, (index % 27) + 1)).toISOString(),
  }
})

export const users: User[] = [...demoAccounts, ...generatedUsers]

export function findUserByEmail(email: unknown) {
  if (typeof email !== 'string') return undefined
  return demoAccounts.find((user) => user.email === email.toLowerCase())
}

export function findUserById(id: string) {
  return users.find((user) => user.id === id)
}

export function toAuthUser(user: User): AuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: ROLE_PERMISSIONS[user.role],
  }
}
