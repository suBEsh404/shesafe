import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { User } from '../../types/user.types'
import type { RootState } from '../../app/store'
import {
  changeAuthorityStatus,
  createAuthority,
  fetchAuthorities,
} from './authorityAPI'

type AuthorityState = {
  authorities: User[]
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  actionStatus: 'idle' | 'loading' | 'succeeded' | 'failed'
  actionMessage?: string
  error?: string
}

const initialState: AuthorityState = {
  authorities: [],
  status: 'idle',
  actionStatus: 'idle',
}

export const loadAuthorities = createAsyncThunk<
  User[],
  void,
  { state: RootState; rejectValue: string }
>('authority/load', async (_, { getState, rejectWithValue }) => {
  if (getState().auth.role !== 'admin') {
    return rejectWithValue('Only administrators can view authorities.')
  }

  try {
    return await fetchAuthorities()
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Unable to load authorities.'
    return rejectWithValue(message)
  }
})

export const addAuthority = createAsyncThunk<
  void,
  { name: string; email: string; password: string; confirmPassword: string },
  { state: RootState; rejectValue: string }
>('authority/add', async (payload, { getState, dispatch, rejectWithValue }) => {
  if (getState().auth.role !== 'admin') {
    return rejectWithValue('Only administrators can create authorities.')
  }

  try {
    await createAuthority(payload)
    await dispatch(loadAuthorities())
  } catch (error) {
    const message =
      typeof error === 'object' && error && 'message' in error
        ? String((error as { message?: string }).message)
        : 'Unable to create authority.'
    return rejectWithValue(message)
  }
})

export const updateAuthorityStatus = createAsyncThunk<
  void,
  { userId: string; status: 'active' | 'suspended' },
  { state: RootState; rejectValue: string }
>(
  'authority/updateStatus',
  async ({ userId, status }, { getState, dispatch, rejectWithValue }) => {
    if (getState().auth.role !== 'admin') {
      return rejectWithValue('Only administrators can manage authority status.')
    }

    try {
      await changeAuthorityStatus(userId, status)
      await dispatch(loadAuthorities())
    } catch (error) {
      const message =
        typeof error === 'object' && error && 'message' in error
          ? String((error as { message?: string }).message)
          : 'Unable to update authority status.'
      return rejectWithValue(message)
    }
  },
)

const authoritySlice = createSlice({
  name: 'authority',
  initialState,
  reducers: {
    clearAuthorityMessage: (state) => {
      state.actionStatus = 'idle'
      state.actionMessage = undefined
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadAuthorities.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loadAuthorities.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.authorities = action.payload
      })
      .addCase(loadAuthorities.rejected, (state, action) => {
        state.status = 'failed'
        state.error =
          action.payload ?? action.error.message ?? 'Unable to load authorities.'
      })
      .addCase(addAuthority.pending, (state) => {
        state.actionStatus = 'loading'
        state.actionMessage = undefined
      })
      .addCase(addAuthority.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
        state.actionMessage = 'Authority account created.'
      })
      .addCase(addAuthority.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionMessage =
          action.payload ?? action.error.message ?? 'Unable to create authority.'
      })
      .addCase(updateAuthorityStatus.pending, (state) => {
        state.actionStatus = 'loading'
        state.actionMessage = undefined
      })
      .addCase(updateAuthorityStatus.fulfilled, (state) => {
        state.actionStatus = 'succeeded'
        state.actionMessage = 'Authority status updated.'
      })
      .addCase(updateAuthorityStatus.rejected, (state, action) => {
        state.actionStatus = 'failed'
        state.actionMessage =
          action.payload ??
          action.error.message ??
          'Unable to update authority status.'
      })
  },
})

export const { clearAuthorityMessage } = authoritySlice.actions
export default authoritySlice.reducer
