import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import FormField from '../../components/common/FormField'
import { useAuth } from '../../context/useAuth'
import { useDirectory } from '../../context/useDirectory'
import { demoUsers, roleHome } from '../../data/demoUsers'
import { emailPattern } from '../../utils/validators'
import './Auth.css'

function Login() {
  const { user, login } = useAuth()
  const { isDeactivated } = useDirectory()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')

  // Already logged in? Go straight to your own dashboard.
  if (user) return <Navigate to={roleHome[user.role]} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
    setFormError('')
  }

  const validate = () => {
    const found = {}
    if (!form.email.trim()) found.email = 'Email is required.'
    else if (!emailPattern.test(form.email.trim())) found.email = 'Enter a valid email address.'
    if (!form.password) found.password = 'Password is required.'
    return found
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = validate()
    setErrors(found)
    if (Object.keys(found).length > 0) return

    if (isDeactivated(form.email.trim())) {
      setFormError('This account has been deactivated. Please contact the administrator.')
      return
    }
    const result = login(form.email.trim(), form.password)
    if (!result.ok) setFormError(result.message)
    // On success the page redirects automatically (see the line near the top).
  }

  return (
    <section className="auth-page">
      <div className="container">
        <div className="card auth-card">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Log in to continue to your dashboard.</p>

          {formError && <div className="alert alert-error" role="alert">{formError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="you@college.edu"
              autoComplete="email"
            />
            <FormField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              autoComplete="current-password"
            />
            <button type="submit" className="btn btn-primary auth-submit">Log in</button>
          </form>

          <p className="auth-switch">
            New student? <Link to="/register">Create an account</Link>
          </p>

          <div className="demo-box">
            <h2>Demo accounts</h2>
            <p>
              Sample logins for testing only. They will be replaced by real login
              when the backend is connected. Click one to fill the form:
            </p>
            <div className="demo-buttons">
              {demoUsers.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  className="btn btn-outline"
                  onClick={() => {
                    setForm({ email: demo.email, password: demo.password })
                    setErrors({})
                    setFormError('')
                  }}
                >
                  {demo.role.charAt(0).toUpperCase() + demo.role.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login