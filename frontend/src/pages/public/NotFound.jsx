import { Link } from 'react-router-dom'
import { useAuth } from '../../context/useAuth'
import { roleHome } from '../../data/roleHome'

function NotFound() {
  const { user } = useAuth()

  return (
    <section className="container not-found">
      <p className="not-found-code" aria-hidden="true">404</p>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist or may have been moved.</p>
      <Link to={user ? roleHome[user.role] : '/'} className="btn btn-primary">
        {user ? 'Go to my dashboard' : 'Back to Home'}
      </Link>
    </section>
  )
}

export default NotFound