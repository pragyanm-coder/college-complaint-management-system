import { useState } from 'react'
import FormField from '../../components/common/FormField'
import StarRating from '../../components/common/StarRating'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'

function ResolutionPanel({ complaint }) {
  const { user } = useAuth()
  const { confirmResolution, reopenComplaint } = useComplaints()

  const [mode, setMode] = useState('confirm') // 'confirm' or 'reopen'
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [reason, setReason] = useState('')
  const [errors, setErrors] = useState({})

  const switchMode = (newMode) => {
    setMode(newMode)
    setErrors({})
  }

  const handleConfirm = (event) => {
    event.preventDefault()
    const found = {}
    if (rating < 1) found.rating = 'Please choose a star rating.'
    if (feedback.trim().length > 500) found.feedback = 'Keep your feedback under 500 characters.'
    setErrors(found)
    if (Object.keys(found).length > 0) return

    confirmResolution(complaint.id, { rating, feedback }, user)
  }

  const handleReopen = (event) => {
    event.preventDefault()
    const found = {}
    if (reason.trim().length < 10) {
      found.reason = 'Please explain what is still wrong (at least 10 characters).'
    } else if (reason.trim().length > 500) {
      found.reason = 'Keep your explanation under 500 characters.'
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    reopenComplaint(complaint.id, reason, user)
  }

  return (
    <section className="card resolution-card" aria-labelledby="resolution-heading">
      <h2 id="resolution-heading">Is your problem solved?</h2>
      <p>
        Staff have marked this complaint as resolved. Please check whether the problem is really
        fixed.
      </p>

      <div className="choice-row">
        <button
          type="button"
          className="btn btn-outline"
          aria-pressed={mode === 'confirm'}
          onClick={() => switchMode('confirm')}
        >
          Yes, it is resolved
        </button>
        <button
          type="button"
          className="btn btn-outline"
          aria-pressed={mode === 'reopen'}
          onClick={() => switchMode('reopen')}
        >
          No, it is not resolved
        </button>
      </div>

      {mode === 'confirm' ? (
        <form onSubmit={handleConfirm} noValidate>
          <div className="rating-block">
            <p className="rating-label">How would you rate the way it was handled?</p>
            <StarRating
              value={rating}
              onChange={(number) => {
                setRating(number)
                setErrors({ ...errors, rating: '' })
              }}
            />
            {errors.rating && <p className="field-error" role="alert">{errors.rating}</p>}
          </div>

          <FormField
            label="Feedback (optional)"
            name="feedback"
            type="textarea"
            rows={4}
            value={feedback}
            onChange={(event) => {
              setFeedback(event.target.value)
              setErrors({ ...errors, feedback: '' })
            }}
            error={errors.feedback}
            hint={`${feedback.length}/500 characters`}
          />
          <button type="submit" className="btn btn-primary">Confirm resolution</button>
        </form>
      ) : (
        <form onSubmit={handleReopen} noValidate>
          <FormField
            label="What is still wrong?"
            name="reason"
            type="textarea"
            rows={4}
            value={reason}
            onChange={(event) => {
              setReason(event.target.value)
              setErrors({ ...errors, reason: '' })
            }}
            error={errors.reason}
            hint="The complaint will go back to In Progress and staff will see your message."
          />
          <button type="submit" className="btn btn-primary">Reopen complaint</button>
        </form>
      )}
    </section>
  )
}

export default ResolutionPanel