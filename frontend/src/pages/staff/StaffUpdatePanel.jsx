
import { useState } from 'react'
import FormField from '../../components/common/FormField'
import StarRating from '../../components/common/StarRating'
import api from '../../api/axios'

function StaffUpdatePanel({ complaint }) {
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (complaint.studentConfirmed) {
    return (
      <section className="card confirmed-card" aria-labelledby="closed-heading">
        <h2 id="closed-heading">Closed: the student confirmed this is resolved</h2>
        <StarRating value={complaint.rating} />
        <p className="feedback-text">
          {complaint.feedback
            ? `“${complaint.feedback}”`
            : 'The student left no written feedback.'}
        </p>
      </section>
    )
  }

  if (complaint.status === 'Resolved') {
    return (
      <section className="card update-card" aria-labelledby="waiting-heading">
        <h2 id="waiting-heading">Waiting for the student</h2>
        <p className="update-hint">
          You marked this complaint as resolved. It will be closed once the student confirms.
          If the student says it is not fixed, it will come back to you as In Progress.
        </p>
      </section>
    )
  }

  const handleChange = (event) => {
    setText(event.target.value)
    setError('')
  }

  const updateStatus = async (status, resolutionDetails = '') => {
    try {
      setLoading(true)
      setError('')

      await api.patch(`/api/staff/complaints/${complaint.id}/status`, {
        status,
        ...(status === 'Resolved' && { resolutionDetails }),
      })

      window.location.reload()
    } catch (error) {
      setError(
        error.response?.data?.message ||
        'Unable to update complaint status. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleStart = () => {
    updateStatus('In Progress')
  }

  const handleResolve = () => {
    const resolutionDetails = text.trim()

    if (resolutionDetails.length < 10) {
      setError(
        'Explain what was done to fix the problem (at least 10 characters). The student will read this.'
      )
      return
    }

    if (resolutionDetails.length > 500) {
      setError('Keep the resolution details under 500 characters.')
      return
    }

    updateStatus('Resolved', resolutionDetails)
  }

  return (
    <section className="card update-card" aria-labelledby="update-heading">
      <h2 id="update-heading">Update this complaint</h2>

      <p className="update-hint">
        {complaint.status === 'Pending'
          ? 'Start work to move this complaint to In Progress.'
          : 'Explain what you did to fix the problem before marking it as resolved.'}
      </p>

      <FormField
        label="Resolution details"
        name="remark"
        type="textarea"
        rows={4}
        value={text}
        onChange={handleChange}
        error={error}
        hint={`${text.length}/500 characters. Required when marking the complaint as resolved.`}
      />

      <p className="muted-note">
        Saving separate remarks is not currently supported by the backend.
      </p>

      <div className="form-actions">
        {complaint.status === 'Pending' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleStart}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Start work'}
          </button>
        )}

        {complaint.status === 'In Progress' && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleResolve}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Mark as resolved'}
          </button>
        )}
      </div>
    </section>
  )
}

export default StaffUpdatePanel
