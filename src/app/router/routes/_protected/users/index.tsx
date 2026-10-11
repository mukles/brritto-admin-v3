import { createFileRoute } from '@tanstack/react-router'
import { UsersPage } from '@/modules/users'
import { requirePermission } from '@/app/router/guards'

export const Route = createFileRoute('/_protected/users/')({
  beforeLoad: ({ context }) => requirePermission(context, 'users:read'),
  component: UsersPage,
})
