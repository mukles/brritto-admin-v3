import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Skeleton } from '@/shared/components/ui/skeleton'
import type { StatMetric } from '../types/dashboard.types'

type StatCardProps = {
  label: string
  metric?: StatMetric
  format?: (value: number) => string
}

const formatNumber = (value: number) => value.toLocaleString()

export function StatCard({ label, metric, format = formatNumber }: StatCardProps) {
  const isUp = (metric?.change ?? 0) >= 0
  const TrendIcon = isUp ? TrendingUpIcon : TrendingDownIcon

  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {metric ? format(metric.value) : <Skeleton className="h-8 w-24" />}
        </CardTitle>
        {metric && (
          <CardAction>
            <Badge variant="outline">
              <TrendIcon />
              {isUp ? '+' : ''}
              {metric.change.toFixed(1)}%
            </Badge>
          </CardAction>
        )}
      </CardHeader>
    </Card>
  )
}
