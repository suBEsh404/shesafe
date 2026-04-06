import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchOverview, type OverviewPayload } from './overviewAPI'
import type {
  ActivitySummaryCard,
  RecentProjectActivity,
  WeeklyActivityCard,
} from '../../types/overview.types'

type OverviewState = {
  activityCards: ActivitySummaryCard[]
  weeklyActivity: WeeklyActivityCard[]
  recentActivity: RecentProjectActivity[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: OverviewState = {
  activityCards: [],
  weeklyActivity: [],
  recentActivity: [],
  status: 'idle',
}

export const loadOverview = createAsyncThunk<OverviewPayload>(
  'overview/load',
  async () => {
    return fetchOverview()
  },
)

const overviewSlice = createSlice({
  name: 'overview',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadOverview.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadOverview.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.activityCards = action.payload.activityCards
        state.weeklyActivity = action.payload.weeklyActivity
        state.recentActivity = action.payload.recentActivity
      })
      .addCase(loadOverview.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Unable to load overview data.'
      })
  },
})

export default overviewSlice.reducer
