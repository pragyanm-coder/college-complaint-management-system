import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Icon from '../common/Icon'
import { useAuth } from '../../context/useAuth'
import { roleHome } from '../../data/demoUsers'
import { navByRole, roleLabels } from '../../data/navigation'
import './DashboardLayout.css'

function DashboardLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const navItems = navByRole[user.role] ?? []
  const closeSidebar = () => setSidebarOpen(false)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
        <div className="dash-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <Link to={roleHome[user.role]} className="sidebar-brand" onClick={closeSidebar}>
          <span className="sidebar-mark" aria-hidden="true">C</span>
          <span>Complaint System</span>
        </Link>

        <nav className="sidebar-nav" aria-label="Sidebar">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.exact !== false} onClick={closeSidebar}>
              <Icon name={item.icon} size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <p className="sidebar-note">Demo mode: sample data only</p>
      </aside>

      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={closeSidebar}
        aria-hidden="true"
      />

      <div className="dash-main">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="icon-btn"
              aria-label="Open menu"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(true)}
            >
              <Icon name="menu" size={22} />
            </button>
            <span className="topbar-title">{roleLabels[user.role]} Portal</span>
          </div>

          <div className="topbar-user">
            <div className="user-info">
              <div className="user-name">{user.name}</div>
              <div className="user-role">{roleLabels[user.role]}</div>
            </div>
            <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
              <Icon name="logout" size={16} />
              Log out
            </button>
          </div>
        </header>

        <main id="main-content" tabIndex={-1} className="dash-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout