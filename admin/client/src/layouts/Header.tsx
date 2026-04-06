import { Bell, Menu, Search, ShieldCheck } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { toggleSidebar } from '../store/uiSlice'

export const Header = () => {
  const dispatch = useAppDispatch()
  const name = useAppSelector((state) => state.auth.name)
  const role = useAppSelector((state) => state.auth.role)

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle menu"
          onClick={() => dispatch(toggleSidebar())}
        >
          <Menu size={18} strokeWidth={2} />
        </button>
        <div>
          <p className="eyebrow">Government Authority Portal</p>
          <p className="topbar-title">Blockchain Evidence Control Console</p>
        </div>
      </div>
      <div className="topbar-actions">
        <label className="header-search" aria-label="Search evidence or case file">
          <Search size={16} strokeWidth={2} />
          <input
            type="search"
            placeholder="Search case ID, hash, officer, or unit"
          />
        </label>
        <div className="chip chip-success">
          <ShieldCheck size={16} strokeWidth={2} />
          Blockchain integrity verified
        </div>
        <button className="icon-button" type="button" aria-label="Notifications">
          <Bell size={16} strokeWidth={2} />
        </button>
        <div className="avatar">
          <div>
            <p className="avatar-name">{name}</p>
            <p className="avatar-sub">{role.toUpperCase()} CLEARANCE</p>
          </div>
          <div className="avatar-photo">{name.charAt(0).toUpperCase()}</div>
        </div>
      </div>
    </header>
  )
}

export default Header
