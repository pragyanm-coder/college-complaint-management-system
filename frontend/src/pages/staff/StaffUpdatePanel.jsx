import { useState } from 'react'
import FormField from '../../components/common/FormField'
import StarRating from '../../components/common/StarRating'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'

function StaffUpdatePanel({ complaint }) {
  const { user } = useAuth()
  const { addRemark, updateStatus } = useComplaints()
  const [text, setText] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  // The student has confirmed: the complaint is closed.
  if (complaint.studentConfirmed) {
    return (
      <section className="card confirmed-card" aria-labelledby="closed-heading">
        <h2 id="closed-heading">Closed: the student confirmed this is resolved</h2>
        <StarRating value={complaint.rating} />
        <p className="feedback-text">
          {complaint.feedback ? `“${complaint.feedback}”` : 'The student left no written feedback.'}
        </p>
      </section>
    )
  }

  // Staff finished their work and are waiting for the student.
  if (complaint.status === 'Resolved') {
    return (
      <section className="card update-card" aria-labelledby="waiting-heading">
        <h2 id="waiting-heading">Waiting for the student</h2>
        <p className="update-hint">
          You marked this complaint as resolved. It will be closed once the student confirms. If the
          student says it is not fixed, it will come back to you as In Progress.
        </p>
      </section>
    )
  }

  const handleChange = (event) => {
    setText(event.target.value)
    setError('')
    setNotice('')
  }

  const finish = (message) => {
    setText('')
    setError('')
    setNotice(message)
  }

  const handleRemark = () => {
    const remark = text.trim()
    if (remark.length < 5) {
      setError('Write a remark of at least 5 characters.')
      return
    }
    if (remark.length > 500) {
      setError('Keep the remark under 500 characters.')
      return
    }
    addRemark(complaint.id, remark, user)
    finish('Remark added. The student can now see it.')
  }

  const handleStart = () => {
    const remark = text.trim()
    if (remark.length > 500) {
      setError('Keep the remark under 500 characters.')
      return
    }
    updateStatus(complaint.id, 'In Progress', remark, user)
    finish('Status changed to In Progress.')
  }

  const handleResolve = () => {
    const remark = text.trim()
    if (remark.length < 10) {
      setError('Explain what was done to fix the problem (at least 10 characters). The student will read this.')
      return
    }
    if (remark.length > 500) {
      setError('Keep the remark under 500 characters.')
      return
    }
    updateStatus(complaint.id, 'Resolved', remark, user)
  }

  return (
    <section className="card update-card" aria-labelledby="update-heading">
      <h2 id="update-heading">Update this complaint</h2>
      <p className="update-hint">
        {complaint.status === 'Pending'
          ? 'Start work to move this complaint to In Progress, or just add a remark.'
          : 'Add remarks as work continues. When the problem is fixed, explain what you did and mark it as resolved.'}
      </p>

      {notice && <div className="alert alert-info" role="status">{notice}</div>}

      <FormField
        label="Remark for the student"
        name="remark"
        type="textarea"
        rows={4}
        value={text}
        onChange={handleChange}
        error={error}
        hint={`${text.length}/500 characters. Students can see your remarks.`}
      />

      <div className="form-actions">
        <button type="button" className="btn btn-outline" onClick={handleRemark}>
          Add remark
        </button>
        {complaint.status === 'Pending' && (
          <button type="button" className="btn btn-primary" onClick={handleStart}>
            Start work
          </button>
        )}
        {complaint.status === 'In Progress' && (
          <button type="button" className="btn btn-primary" onClick={handleResolve}>
            Mark as resolved
          </button>
        )}
      </div>
    </section>
  )
}

export default StaffUpdatePanel