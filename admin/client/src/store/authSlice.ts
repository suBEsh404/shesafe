import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { login, register, logout } from '../services/authApi'
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  type StoredUser,
} from '../utils/authStorage'

export type AuthState = {
  isAuthenticated: boolean
  role: string
  name: string
  email?: string
  accessToken: string | null
  refreshToken: string | null
  status: 'idle' | 'loading' | 'succeeded' | 'failed'
  error?: string
}

const storedUser = getStoredUser()
const storedAccessToken = getAccessToken()
const storedRefreshToken = getRefreshToken()

const initialState: AuthState = {
  isAuthenticated: Boolean(storedAccessToken && storedUser),
  role: storedUser?.role ?? 'user',
  name: storedUser?.name ?? 'Guest',
  email: storedUser?.email,
  accessToken: storedAccessToken,
  refreshToken: storedRefreshToken,
  status: 'idle',
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload: { email: string; password: string }) => {
    return login(payload)
  },
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload: { name: string; email: string; password: string; role?: string }) => {
    return register(payload)
  },
)

export const logoutUser = createAsyncThunk('auth/logout', async (refreshToken: string) => {
  return logout(refreshToken)
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    restoreSession: (state, action: PayloadAction<StoredUser | null>) => {
      if (action.payload) {
        state.name = action.payload.name
        state.role = action.payload.role
        state.email = action.payload.email
        state.isAuthenticated = true
      }
    },
    signOutLocal: (state) => {
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.name = 'Guest'
      state.role = 'user'
      state.email = undefined
      clearTokens()
      clearStoredUser()
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isAuthenticated = true
        state.accessToken = action.payload.data.accessToken
        state.refreshToken = action.payload.data.refreshToken
        state.name = action.payload.data.user.name
        state.role = action.payload.data.user.role
        state.email = action.payload.data.user.email
        setTokens(action.payload.data.accessToken, action.payload.data.refreshToken)
        setStoredUser({
          name: action.payload.data.user.name,
          role: action.payload.data.user.role,
          email: action.payload.data.user.email,
        })
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Login failed'
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading'
        state.error = undefined
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.isAuthenticated = true
        state.accessToken = action.payload.data.accessToken
        state.refreshToken = action.payload.data.refreshToken
        state.name = action.payload.data.user.name
        state.role = action.payload.data.user.role
        state.email = action.payload.data.user.email
        setTokens(action.payload.data.accessToken, action.payload.data.refreshToken)
        setStoredUser({
          name: action.payload.data.user.name,
          role: action.payload.data.user.role,
          email: action.payload.data.user.email,
        })
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message ?? 'Registration failed'
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false
        state.accessToken = null
        state.refreshToken = null
        state.name = 'Guest'
        state.role = 'user'
        state.email = undefined
        clearTokens()
        clearStoredUser()
      })
  },
})

export const { restoreSession, signOutLocal } = authSlice.actions
export default authSlice.reducer
