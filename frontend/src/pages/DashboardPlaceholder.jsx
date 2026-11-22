import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

function DashboardPlaceholder({ title }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <section className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>Welcome, {user.name}. The real dashboard will be built in the next steps.</p>
      <button type="button" className="btn btn-primary" onClick={handleLogout}>
        Log out
      </button>
    </section>
  )
}

export default DashboardPlaceholder