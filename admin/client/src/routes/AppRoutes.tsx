import { Navigate, Route, Routes } from 'react-router-dom'
import DashboardLayout from '../layouts/DashboardLayout'
import OverviewPage from '../features/overview/OverviewPage'
import UsersPage from '../features/users/UsersPage'
import EvidencePage from '../features/evidence/EvidencePage'
import BlockchainPage from '../features/blockchain/BlockchainPage'
import LogsPage from '../features/logs/LogsPage'
import RolesPage from '../features/roles/RolesPage'
import SettingsPage from '../features/settings/SettingsPage'
import AuthorityManagementPage from '../features/authority/AuthorityManagementPage'
import { ProtectedRoute } from './ProtectedRoute'
import LoginPage from '../features/auth/LoginPage'
import RegisterPage from '../features/auth/RegisterPage'

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="login" element={<LoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="evidence" element={<EvidencePage />} />
          <Route path="blockchain" element={<BlockchainPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="roles" element={<RolesPage />} />
          <Route path="authorities" element={<AuthorityManagementPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
