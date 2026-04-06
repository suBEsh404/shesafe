import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
  fetchSettings,
  generateReport,
  reviewControls,
  type SettingsPayload,
} from './settingsAPI'
import type { RootState } from '../../app/store'

type SettingsState = {
  apiHealth: string
  storageUsed: number
  storageTotal: number
  securityLevel: string
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  actionMessage?: string
  error?: string
}

const initialState: SettingsState = {
  apiHealth: '',
  storageUsed: 0,
  storageTotal: 0,
  securityLevel: '',
  status: 'idle',
  actionStatus: 'idle',
}

export const loadSettings = createAsyncThunk<
  SettingsPayload,
  void,
  { state: RootState; rejectValue: string }
>(
  'settings/load',
  async (_, { getState, rejectWithValue }) => {
    if ((getState() as RootState).auth.role !== 'admin') {
      return rejectWithValue('Only administrators can view settings.')
    }

    try {
      return await fetchSettings()
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Unable to load settings.'
      return rejectWithValue(message)
    }
  },
)

export const reviewSecurityControls = createAsyncThunk<
  string,
  string | undefined,
  { state: RootState; rejectValue: string }
>('settings/reviewControls', async (notes, { getState, rejectWithValue }) => {
  if (getState().auth.role !== 'admin') {
    return rejectWithValue('Only administrators can review controls.')
  }

  try {
    return await reviewControls(notes)
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Unable to review security controls.'
    return rejectWithValue(message)
  }
})

export const generateAuditReport = createAsyncThunk<
  string,
  void,
  { state: RootState; rejectValue: string }
>('settings/generateReport', async (_, { getState, rejectWithValue }) => {
  if (getState().auth.role !== 'admin') {
    return rejectWithValue('Only administrators can generate reports.')
  }

  try {
    return await generateReport()
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Unable to generate report.'
    return rejectWithValue(message)
  }
})

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    clearSettingsActionMessage: (state) => {
      state.actionStatus = 'idle'
      state.actionMessage = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadSettings.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadSettings.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.apiHealth = action.payload.apiHealth
        state.storageUsed = action.payload.storageUsed
        state.storageTotal = action.payload.storageTotal
        state.securityLevel = action.payload.securityLevel
      })
      .addCase(loadSettings.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Unable to load settings.'
      })
      .addCase(reviewSecurityControls.pending, (state) => {
        state.actionStatus = 'loading'
        state.actionMessage = undefined
      })
      .addCase(reviewSecurityControls.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded'
        state.securityLevel = action.payload
        state.actionMessage = 'Security controls reviewed.'
      })
      .addCase(reviewSecurityControls.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionMessage =
          action.payload ?? action.error.message ?? 'Unable to review security controls.'
      })
      .addCase(generateAuditReport.pending, (state) => {
        state.actionStatus = 'loading'
        state.actionMessage = undefined
      })
      .addCase(generateAuditReport.fulfilled, (state, action) => {
        state.actionStatus = 'succeeded'
        state.actionMessage = `Report generated: ${action.payload}`
      })
      .addCase(generateAuditReport.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionMessage = action.payload ?? action.error.message ?? 'Unable to generate report.'
      })
  },
})

export const { clearSettingsActionMessage } = settingsSlice.actions
export default settingsSlice.reducer
