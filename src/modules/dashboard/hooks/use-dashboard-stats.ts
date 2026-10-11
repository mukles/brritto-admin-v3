import { useQuery } from '@tanstack/react-query'
import { dashboardStatsQuery } from '../services/dashboard.api'

export function useDashboardStats() {
  return useQuery(dashboardStatsQuery)
}
