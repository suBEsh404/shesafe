import { useEffect, useState } from 'react'
import {
  Shield,
  LayoutDashboard,
  Users,
  FileSearch,
  Blocks,
  ClipboardList,
  BadgeCheck,
  Building2,
  Settings,
  Plus,
} from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { setSidebarCollapsed, toggleSidebar } from '../store/uiSlice'

const navItems = [
  {
    label: 'Home',
    path: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Officer Directory',
    path: '/users',
    icon: Users,
  },
  {
    label: 'Evidence Review',
    path: '/evidence',
    icon: FileSearch,
  },
  {
    label: 'Ledger Integrity',
    path: '/blockchain',
    icon: Blocks,
  },
  {
    label: 'Audit Logs',
    path: '/logs',
    icon: ClipboardList,
  },
  {
    label: 'Access Control',
    path: '/roles',
    icon: BadgeCheck,
  },
  {
    label: 'Authorities',
    path: '/authorities',
    icon: Building2,
  },
  {
    label: 'System Settings',
    path: '/settings',
    icon: Settings,
  },
]

export const Sidebar = () => {
  const dispatch = useAppDispatch()
  const sidebarCollapsed = useAppSelector((state) => state.ui.sidebarCollapsed)
  const [isMobile, setIsMobile] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const media = window.matchMedia('(max-width: 980px)')
    const handleChange = () => {
      setIsMobile(media.matches)
      if (media.matches) {
        dispatch(setSidebarCollapsed(true))
      }
    }
    handleChange()
    media.addEventListener('change', handleChange)
    return () => media.removeEventListener('change', handleChange)
  }, [dispatch])

  const handleNavClick = () => {
    if (window.matchMedia('(max-width: 980px)').matches) {
      dispatch(toggleSidebar())
    }
  }

  return (
    <>
      <div
        className={
          isMobile && !sidebarCollapsed
            ? 'sidebar-overlay show'
            : 'sidebar-overlay'
        }
        onClick={() => dispatch(toggleSidebar())}
        aria-hidden="true"
      ></div>
      <aside className={sidebarCollapsed ? 'sidebar collapsed' : 'sidebar open'}>
        <div className="brand">
          <div className="brand-icon">
            <Shield size={18} strokeWidth={2} />
          </div>
          <div>
            <p className="brand-title">Women Safety Command</p>
            <p className="brand-sub">Digital Evidence Management System</p>
          </div>
        </div>

        <div className="sidebar-section-label">Authority Workspace</div>
        <nav className="nav">
          {navItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.label}
                to={item.path}
                end
                className={({ isActive }) =>
                  isActive ? 'nav-item active' : 'nav-item'
                }
                onClick={handleNavClick}
              >
                <span className="nav-icon" aria-hidden="true">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-section-label">Case Intake</div>
          <button className="cta" onClick={() => navigate('/evidence')}>
            <Plus size={16} strokeWidth={2} />
            <span className="nav-label">Register Evidence</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
