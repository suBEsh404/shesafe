import { combineReducers } from '@reduxjs/toolkit'
import overview from '../features/overview/overviewSlice'
import users from '../features/users/usersSlice'
import evidence from '../features/evidence/evidenceSlice'
import blockchain from '../features/blockchain/blockchainSlice'
import logs from '../features/logs/logsSlice'
import roles from '../features/roles/rolesSlice'
import settings from '../features/settings/settingsSlice'
import authority from '../features/authority/authoritySlice'
import auth from '../store/authSlice'
import ui from '../store/uiSlice'

const rootReducer = combineReducers({
  overview,
  users,
  evidence,
  blockchain,
  logs,
  roles,
  settings,
  authority,
  auth,
  ui,
})

export default rootReducer
