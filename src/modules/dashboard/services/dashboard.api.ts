import { queryOptions } from '@tanstack/react-query'
import { api } from '@/shared/services/http'
import type { DashboardStats } from '../types/dashboard.types'

export const dashboardApi = {
  getStats: () => api.get<DashboardStats>('/dashboard/stats'),
}

export const dashboardStatsQuery = queryOptions({
  queryKey: ['dashboard', 'stats'],
  queryFn: dashboardApi.getStats,
})
