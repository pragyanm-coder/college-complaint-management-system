
import { useState } from 'react'
import { Link } from 'react-router-dom'
import FormField from '../../components/common/FormField'
import Icon from '../../components/common/Icon'
import PageHeader from '../../components/common/PageHeader'
import api from '../../api/axios'
import { complaintCategories, priorities } from '../../data/options'
import './RegisterComplaint.css'

const initialForm = {
  title: '',
  category: '',
  priority: 'Medium',
  location: '',
  description: '',
}

function validate(form) {
  const found = {}
  const title = form.title.trim()
  const description = form.description.trim()

  if (title.length < 5) found.title = 'Enter a short title (at least 5 characters).'
  else if (title.length > 100) found.title = 'Keep the title under 100 characters.'

  if (!form.category) found.category = 'Select a category.'
  if (!form.priority) found.priority = 'Select a priority.'
  if (!form.location.trim()) found.location = 'Tell us where the problem is.'

  if (description.length < 20) found.description = 'Please describe the problem in at least 20 characters.'
  else if (description.length > 1000) found.description = 'Keep the description under 1000 characters.'

  return found
}

function RegisterComplaint() {
  const [form, setForm] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(null)
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
    setApiError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const found = validate(form)
    setErrors(found)

    if (Object.keys(found).length > 0) return

    try {
      setLoading(true)
      setApiError('')

      const response = await api.post('/api/complaints', {
        title: form.title.trim(),
        category: form.category,
        priority: form.priority,
        location: form.location.trim(),
        description: form.description.trim(),
      })

      const complaint = response.data.data

      setSubmitted({
        ...complaint,
        id: complaint._id,
      })

      window.scrollTo(0, 0)
    } catch (error) {
      setApiError(
        error.response?.data?.message || 'Unable to submit complaint. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const startAnother = () => {
    setForm(initialForm)
    setErrors({})
    setSubmitted(null)
    setApiError('')
  }

  if (submitted) {
    return (
      <>
        <PageHeader title="Register a Complaint" />
        <div className="card complaint-card success-card">
          <span className="success-icon">
            <Icon name="checkCircle" size={34} />
          </span>
          <h2>Complaint registered</h2>
          <p>
            Your complaint <strong>{submitted.id}</strong> has been submitted with the status{' '}
            <strong>Pending</strong>. The admin will review it and assign it to the right
            department.
          </p>
          <div className="form-actions">
            <Link to="/student/complaints" className="btn btn-primary">View My Complaints</Link>
            <button type="button" className="btn btn-outline" onClick={startAnother}>
              Register another complaint
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHeader
        title="Register a Complaint"
        subtitle="Describe your problem clearly so it can be handled quickly."
      />

      <form className="card complaint-card" onSubmit={handleSubmit} noValidate>
        <FormField
          label="Complaint title"
          name="title"
          value={form.title}
          onChange={handleChange}
          error={errors.title}
          placeholder="Example: Fan not working in Room 204"
        />

        <div className="complaint-form-grid">
          <FormField
            label="Category"
            name="category"
            type="select"
            options={complaintCategories}
            value={form.category}
            onChange={handleChange}
            error={errors.category}
          />
          <FormField
            label="Priority"
            name="priority"
            type="select"
            options={priorities}
            value={form.priority}
            onChange={handleChange}
            error={errors.priority}
            hint="Use Urgent only for safety problems or issues that need action today."
          />
        </div>

        <FormField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          error={errors.location}
          placeholder="Example: Hostel Block A, Room 204"
        />

        <FormField
          label="Description"
          name="description"
          type="textarea"
          rows={6}
          value={form.description}
          onChange={handleChange}
          error={errors.description}
          hint={`${form.description.length}/1000 characters. Explain what happened and since when.`}
        />

        {apiError && <p className="form-error">{apiError}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Complaint'}
          </button>
          <Link to="/student/dashboard" className="btn btn-outline">Cancel</Link>
        </div>
      </form>
    </>
  )
}

export default RegisterComplaint
