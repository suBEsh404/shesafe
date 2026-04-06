import { apiRequest } from '../../services/apiClient'
import type {
  ActivitySummaryCard,
  RecentProjectActivity,
  WeeklyActivityCard,
} from '../../types/overview.types'

export type OverviewPayload = {
  activityCards: ActivitySummaryCard[]
  weeklyActivity: WeeklyActivityCard[]
  recentActivity: RecentProjectActivity[]
}

export const fetchOverview = async (): Promise<OverviewPayload> => {
  const response = await apiRequest<{ success: boolean; data: OverviewPayload }>(
    '/api/admin/project-activity-summary',
    { auth: true },
  )

  return response.data
}
