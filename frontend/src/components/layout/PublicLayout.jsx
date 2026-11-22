import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { roleHome } from '../../data/demoUsers'
import './PublicLayout.css'

function PublicLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const { user } = useAuth()

  // Scroll to a section (like #features) or to the top on a new page.
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="public-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>

      <header className="navbar">
        <div className="container navbar-inner">
          <Link to="/" className="brand" onClick={closeMenu}>
            <span className="brand-mark" aria-hidden="true">C</span>
            <span className="brand-text">College Complaint Registration System</span>
          </Link>

          <button
            type="button"
            className="menu-toggle"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Main">
            <NavLink to="/" end onClick={closeMenu}>Home</NavLink>
            <Link to="/#features" onClick={closeMenu}>Features</Link>
            <Link to="/#how-it-works" onClick={closeMenu}>How It Works</Link>
            {user ? (
              <Link to={roleHome[user.role]} className="btn btn-primary" onClick={closeMenu}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline" onClick={closeMenu}>Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMenu}>Register</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            © {new Date().getFullYear()} College Complaint Registration System. A
            college software engineering project.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default PublicLayout