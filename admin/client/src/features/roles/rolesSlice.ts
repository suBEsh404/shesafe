import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchRoles, type RolesPayload } from './rolesAPI'

type RoleState = {
  roles: string[]
  permissions: Record<string, string[]>
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const initialState: RoleState = {
  roles: [],
  permissions: {},
  status: 'idle',
}

export const loadRoles = createAsyncThunk<RolesPayload>('roles/load', async () => {
  return fetchRoles()
})

const rolesSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadRoles.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadRoles.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.roles = action.payload.roles
        state.permissions = action.payload.permissions
      })
      .addCase(loadRoles.rejected, (state) => {
        state.status = 'failed'
        state.error = 'Unable to load roles.'
      })
  },
})

export default rolesSlice.reducer
