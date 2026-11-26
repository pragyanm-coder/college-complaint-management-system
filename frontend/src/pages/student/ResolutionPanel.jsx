
import { useState } from 'react'
import { useComplaints } from '../../context/useComplaints'
import StarRating from '../../components/common/StarRating'

function ResolutionPanel({ complaint, onUpdated }) {
  const { confirmResolution, reopenComplaint } = useComplaints()

  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const complaintId = complaint.id || complaint._id

  const handleConfirm = async () => {
    if (rating === 0) {
      setError('Please select a rating before confirming.')
      return
    }

    try {
      setLoading(true)
      setError('')

      const updated = await confirmResolution(
        complaintId,
        rating,
        feedback
      )

      onUpdated(updated)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to confirm the resolution. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleReopen = async () => {
    try {
      setLoading(true)
      setError('')

      const updated = await reopenComplaint(complaintId)

      onUpdated(updated)
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Unable to reopen the complaint. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="card resolution-card" aria-labelledby="resolution-heading">
      <h2 id="resolution-heading">Is your problem solved?</h2>

      <p>
        Staff have marked this complaint as resolved. Please check whether
        the problem is really fixed.
      </p>

      <div className="rating-section">
        <label>Rate the resolution (1–5 stars)</label>
        <StarRating value={rating} onChange={setRating} />
      </div>

      <div className="feedback-section">
        <label htmlFor="resolution-feedback">
          Feedback (optional)
        </label>

        <textarea
          id="resolution-feedback"
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
          placeholder="Share your experience with the resolution..."
          maxLength={1000}
          rows={4}
        />
      </div>

      {error && (
        <p className="field-error" role="alert">
          {error}
        </p>
      )}

      <div className="resolution-actions">
        <button
          type="button"
          className="btn btn-primary"
          onClick={handleConfirm}
          disabled={loading || rating === 0}
        >
          {loading ? 'Submitting...' : 'Confirm Resolution'}
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleReopen}
          disabled={loading}
        >
          {loading ? 'Please wait...' : 'Problem Not Solved? Reopen'}
        </button>
      </div>
    </section>
  )
}

export default ResolutionPanel
