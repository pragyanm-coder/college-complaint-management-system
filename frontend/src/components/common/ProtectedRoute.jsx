import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { roleHome } from '../../data/roleHome'

function ProtectedRoute({ role }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
  if (user.role !== role) return <Navigate to={roleHome[user.role]} replace />
  return <Outlet />
}

export default ProtectedRoute