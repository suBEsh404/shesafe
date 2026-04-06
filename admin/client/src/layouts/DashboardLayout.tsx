import { Outlet } from 'react-router-dom'
import { useAppSelector } from '../app/hooks'
import { Sidebar } from './Sidebar'
import { Header } from './Header'

export const DashboardLayout = () => {
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed)

  return (
    <div className={sidebarCollapsed ? 'app-shell collapsed' : 'app-shell'}>
      <Sidebar />
      <div className="app-body">
        <Header />
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
