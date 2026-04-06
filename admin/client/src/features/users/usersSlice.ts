import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User } from '../../types/user.types'
import { exportAdminUsersCsv, fetchUsers, inviteAdminUser } from './usersAPI'
import type { AppDispatch, RootState } from '../../app/store'

type UsersState = {
  users: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  actionMessage?: string
  error?: string
}

const initialState: UsersState = {
  users: [],
  status: 'idle',
  actionStatus: 'idle',
}

export const loadUsers = createAsyncThunk<
  User[],
  void,
  { state: RootState; rejectValue: string }
>('users/load', async (_, { getState, rejectWithValue }) => {
  if (getState().auth.role !== 'admin') {
    return rejectWithValue('Only administrators can view users.')
  }

  try {
    return await fetchUsers()
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Unable to load users.'
    return rejectWithValue(message)
  }
})

export const inviteUser = createAsyncThunk<
  void,
  { name: string; email: string; role?: 'user' | 'authority' | 'admin' },
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>('users/invite', async (payload, { dispatch }) => {
  await inviteAdminUser(payload)
  await dispatch(loadUsers())
})

export const exportUsers = createAsyncThunk<string>('users/export', async () => {
  return exportAdminUsersCsv()
})

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUsersActionMessage: (state) => {
      state.actionStatus = 'idle'
      state.actionMessage = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadUsers.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.users = action.payload
      })
      .addCase(loadUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload ?? action.error.message ?? 'Unable to load users.'
      })
      .addCase(inviteUser.pending, (state) => {
        state.actionStatus = 'loading'
        state.actionMessage = undefined
      })
      .addCase(inviteUser.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
        state.actionMessage = 'Invite sent successfully.'
      })
      .addCase(inviteUser.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionMessage = action.error.message ?? 'Unable to invite user.'
      })
      .addCase(exportUsers.pending, (state) => {
        state.actionStatus = 'loading'
        state.actionMessage = undefined
      })
      .addCase(exportUsers.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
        state.actionMessage = 'User export downloaded.'
      })
      .addCase(exportUsers.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionMessage = action.error.message ?? 'Unable to export users.'
      })
  },
})

export const { clearUsersActionMessage } = usersSlice.actions
export default usersSlice.reducer
