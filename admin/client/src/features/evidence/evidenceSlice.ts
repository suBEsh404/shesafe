import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { EvidenceItem } from '../../types/evidence.types'
import { fetchAdminEvidence } from './evidenceAPI'
import type { RootState } from '../../app/store'

type EvidenceState = {
  items: EvidenceItem[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: EvidenceState = {
  items: [],
  status: 'idle',
}

export const loadEvidence = createAsyncThunk<
  EvidenceItem[],
  void,
  { state: RootState }
>('evidence/load', async (_, { getState }) => {
  const role = getState().auth.role
  if (role !== 'admin') {
    return []
  }
  return fetchAdminEvidence()
})

const evidenceSlice = createSlice({
  name: 'evidence',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadEvidence.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadEvidence.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(loadEvidence.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Unable to load evidence.'
      })
  },
})

export default evidenceSlice.reducer
