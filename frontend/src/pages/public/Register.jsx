import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import FormField from '../../components/common/FormField'
import { useAuth } from '../../context/useAuth'
import { roleHome } from '../../data/roleHome'
import { departments, years } from '../../data/options'
import { emailPattern } from '../../utils/validators'
import './Auth.css'

const initialForm = {
  fullName: '',
  email: '',
  rollNumber: '',
  department: '',
  year: '',
  phone: '',
  password: '',
  confirmPassword: '',
}

function validate(form) {
  const found = {}
  if (form.fullName.trim().length < 3) found.fullName = 'Enter your full name (at least 3 characters).'
  if (!form.email.trim()) found.email = 'Email is required.'
  else if (!emailPattern.test(form.email.trim())) found.email = 'Enter a valid email address.'
  if (!form.rollNumber.trim()) found.rollNumber = 'Roll number is required.'
  if (!form.department) found.department = 'Select your department.'
  if (!form.year) found.year = 'Select your year.'
  if (!/^\d{10}$/.test(form.phone.trim())) found.phone = 'Enter a 10-digit phone number.'
  if (form.password.length < 8) found.password = 'Password must be at least 8 characters.'
  else if (!/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)) {
    found.password = 'Use both letters and numbers.'
  }
  if (!form.confirmPassword) found.confirmPassword = 'Confirm your password.'
  else if (form.confirmPassword !== form.password) found.confirmPassword = 'Passwords do not match.'
  return found
}

function Register() {
  const { user, registerStudent } = useAuth()
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [formError, setFormError] = useState('')

  if (user) return <Navigate to={roleHome[user.role]} replace />

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)

    if (Object.keys(found).length > 0) return

    setLoading(true)
    setFormError('')

    const result = await registerStudent(form)

    if (!result.ok) {
        setFormError(result.message)
    }

    setLoading(false)
}

  return (
    <section className="auth-page">
      <div className="container">
        <div className="card auth-card auth-card-wide">
          <h1>Create your student account</h1>
          <p className="auth-subtitle">Fill in your details to start registering complaints.</p>

          {formError && (
    <div className="alert alert-error" role="alert">
        {formError}
    </div>
)}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-grid">
              <FormField label="Full name" name="fullName" value={form.fullName} onChange={handleChange} error={errors.fullName} autoComplete="name" />
              <FormField label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} placeholder="you@college.edu" autoComplete="email" />
              <FormField label="Roll number" name="rollNumber" value={form.rollNumber} onChange={handleChange} error={errors.rollNumber} />
              <FormField label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} error={errors.phone} hint="10 digits" autoComplete="tel" />
              <FormField label="Department" name="department" type="select" options={departments} value={form.department} onChange={handleChange} error={errors.department} />
              <FormField label="Year" name="year" type="select" options={years} value={form.year} onChange={handleChange} error={errors.year} />
              <FormField label="Password" name="password" type="password" value={form.password} onChange={handleChange} error={errors.password} hint="At least 8 characters, with letters and numbers" autoComplete="new-password" />
              <FormField label="Confirm password" name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} autoComplete="new-password" />
            </div>
            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
    {loading ? 'Creating account...' : 'Create account'}
</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register