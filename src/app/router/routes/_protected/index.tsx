import { createFileRoute } from '@tanstack/react-router'
import { DashboardPage, dashboardStatsQuery } from '@/modules/dashboard'
import { requirePermission } from '@/app/router/guards'

export const Route = createFileRoute('/_protected/')({
  beforeLoad: ({ context }) => requirePermission(context, 'dashboard:view'),
  loader: ({ context }) => context.queryClient.prefetchQuery(dashboardStatsQuery),
  component: DashboardPage,
})
