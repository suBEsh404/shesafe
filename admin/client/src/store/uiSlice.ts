import { createSlice } from '@reduxjs/toolkit'

type UiState = {
  sidebarCollapsed: boolean
}

const initialState: UiState = {
  sidebarCollapsed: false,
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSidebarCollapsed: (state, action: { payload: boolean }) => {
      state.sidebarCollapsed = action.payload
    },
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed
    },
  },
})

export const { toggleSidebar, setSidebarCollapsed } = uiSlice.actions
export default uiSlice.reducer
