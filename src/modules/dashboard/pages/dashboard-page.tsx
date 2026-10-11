import { useCurrentUser } from '@/modules/auth'
import { PageHeader } from '@/shared/components/page-header'
import { StatCard } from '../components/stat-card'
import { useDashboardStats } from '../hooks/use-dashboard-stats'

const formatCurrency = (value: number) =>
  value.toLocaleString(undefined, {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

export function DashboardPage() {
  const user = useCurrentUser()
  const { data, isError } = useDashboardStats()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back${user ? `, ${user.name.split(' ')[0]}` : ''}`}
        description="Here's what's happening across your workspace."
      />
      {isError ? (
        <p className="text-destructive text-sm">Couldn't load dashboard stats.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total users" metric={data?.totalUsers} />
          <StatCard label="Active users" metric={data?.activeUsers} />
          <StatCard label="New sign-ups" metric={data?.newSignups} />
          <StatCard label="Revenue" metric={data?.revenue} format={formatCurrency} />
        </div>
      )}
    </div>
  )
}
