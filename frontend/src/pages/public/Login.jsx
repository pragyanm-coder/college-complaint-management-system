
import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import FormField from '../../components/common/FormField'
import { useAuth } from '../../context/useAuth'
import { roleHome } from '../../data/roleHome'
import { emailPattern } from '../../utils/validators'
import './Auth.css'

function Login() {
  const { user, login } = useAuth()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  if (user) return <Navigate to={roleHome[user.role]} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
    setFormError('')
  }

  const validate = () => {
    const found = {}

    if (!form.email.trim()) {
      found.email = 'Email is required.'
    } else if (!emailPattern.test(form.email.trim())) {
      found.email = 'Enter a valid email address.'
    }

    if (!form.password) {
      found.password = 'Password is required.'
    }

    return found
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const found = validate()
    setErrors(found)

    if (Object.keys(found).length > 0) return

    setLoading(true)
    setFormError('')

    try {
      const result = await login(form.email.trim(), form.password)

      if (!result.ok) {
        setFormError(result.message)
      }
    } catch (error) {
      setFormError(
        error.response?.data?.message ||
        'Unable to log in. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      <div className="container">
        <div className="card auth-card">
          <h1>Welcome back</h1>
          <p className="auth-subtitle">
            Log in to continue to your dashboard.
          </p>

          {formError && (
            <div className="alert alert-error" role="alert">
              {formError}
            </div>
          )}

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

            <button
              type="submit"
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>

          <p className="auth-switch">
            New student? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
