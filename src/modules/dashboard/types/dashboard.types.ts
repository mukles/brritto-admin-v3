export type StatMetric = {
  value: number
  change: number
}

export type DashboardStats = {
  totalUsers: StatMetric
  activeUsers: StatMetric
  newSignups: StatMetric
  revenue: StatMetric
}
