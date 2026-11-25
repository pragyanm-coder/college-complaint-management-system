
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import PriorityBadge from '../../components/common/PriorityBadge'
import ProgressTracker from '../../components/common/ProgressTracker'
import StarRating from '../../components/common/StarRating'
import StatusBadge from '../../components/common/StatusBadge'
import Timeline from '../../components/common/Timeline'
import { useComplaints } from '../../context/useComplaints'
import { formatDateTime } from '../../utils/formatters'
import AssignPanel from './AssignPanel'
import '../student/ComplaintDetails.css'
import './AdminComplaintDetails.css'

function AdminComplaintDetails() {
  const { id } = useParams()
  const { fetchAllComplaints } = useComplaints()

  const [complaint, setComplaint] = useState(null)
  const [status, setStatus] = useState('Pending')
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaint = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/api/complaints/${id}`)
        const data = response.data.data

        const formattedComplaint = {
          ...data,
          id: data._id,
          submittedAt: data.createdAt,
          studentName: data.student?.fullName || '',
          studentEmail: data.student?.email || '',
          studentRollNumber: data.student?.rollNumber || '',
          department: data.assignedStaff?.handlingDepartment || '',
          assignedStaff: data.assignedStaff?.fullName || '',
          updates: (data.updates || []).map((item) => ({
            ...item,
            type: item.type === 'Comment' ? 'remark' : 'status',
            author: typeof item.author === 'object'
              ? item.author?.fullName || 'System'
              : item.author || 'System',
          })),
        }

        setComplaint(formattedComplaint)
        setStatus(formattedComplaint.status)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load complaint details.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadComplaint()
  }, [id])

  const handleStatusUpdate = async (event) => {
    event.preventDefault()
    setUpdating(true)
    setNotice('')
    setError('')

    try {
      await api.patch(`/api/admin/complaints/${id}/status`, { status })

      const updatedComplaints = await fetchAllComplaints()
      const updatedComplaint = updatedComplaints.find(
        (item) => item.id === id
      )

      if (updatedComplaint) {
        setComplaint(updatedComplaint)
        setStatus(updatedComplaint.status)
      }

      setNotice('Complaint status updated successfully.')
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to update complaint status.'
      )
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return <p>Loading complaint details...</p>
  }

  if (error && !complaint) {
    return (
      <>
        <PageHeader
          title="Unable to load complaint"
          subtitle={error}
        />
        <Link to="/admin/complaints" className="btn btn-primary">
          Back to All Complaints
        </Link>
      </>
    )
  }

  if (!complaint) {
    return (
      <>
        <PageHeader
          title="Complaint not found"
          subtitle="This complaint does not exist."
        />
        <Link to="/admin/complaints" className="btn btn-primary">
          Back to All Complaints
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/admin/complaints" className="back-link">
        ← Back to All Complaints
      </Link>

      <PageHeader
        title={complaint.title}
        subtitle={`${complaint.id} · Submitted on ${formatDateTime(complaint.submittedAt)}`}
      >
        <div className="complaint-badges">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </PageHeader>

      <section className="card tracker-card" aria-label="Progress">
        <ProgressTracker complaint={complaint} />
      </section>

      <section className="card details-card">
        <h2>Update complaint status</h2>

        {notice && (
          <div className="alert alert-info" role="status">{notice}</div>
        )}

        {error && (
          <div className="alert alert-error" role="alert">{error}</div>
        )}

        <form onSubmit={handleStatusUpdate}>
          <div className="form-group">
            <label htmlFor="admin-status">Select status</label>

            <select
              id="admin-status"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              disabled={updating}
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved" disabled>
                Resolved (not available through admin API)
              </option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={updating || status === complaint.status}
          >
            {updating ? 'Updating...' : 'Update status'}
          </button>
        </form>

        <p className="muted-note">
          Admin resolution is not available yet because the backend does not
          currently provide a way to submit resolution details.
        </p>
      </section>

      <AssignPanel complaint={complaint} />

      {complaint.studentConfirmed && (
        <section className="card confirmed-card" aria-labelledby="confirmed-heading">
          <h2 id="confirmed-heading">
            The student confirmed this complaint is resolved
          </h2>
          <StarRating value={complaint.rating} />
          <p className="feedback-text">
            {complaint.feedback
              ? `“${complaint.feedback}”`
              : 'The student left no written feedback.'}
          </p>
        </section>
      )}

      <div className="details-grid">
        <div className="details-main">
          <section className="card details-card" aria-labelledby="details-heading">
            <h2 id="details-heading">Complaint details</h2>
            <dl className="detail-list">
              <dt>Category</dt>
              <dd>{complaint.category}</dd>
              <dt>Location</dt>
              <dd>{complaint.location}</dd>
              <dt>Description</dt>
              <dd className="detail-description">{complaint.description}</dd>
            </dl>
          </section>

          <section className="card details-card" aria-labelledby="timeline-heading">
            <h2 id="timeline-heading">Progress and remarks</h2>
            <Timeline updates={complaint.updates} />
          </section>
        </div>

        <aside className="details-main">
          <section className="card details-card" aria-labelledby="student-heading">
            <h2 id="student-heading">Student</h2>
            <dl className="detail-list">
              <dt>Name</dt>
              <dd>{complaint.studentName}</dd>
              <dt>Email</dt>
              <dd>{complaint.studentEmail}</dd>
            </dl>
          </section>

          <section className="card details-card" aria-labelledby="assignment-heading">
            <h2 id="assignment-heading">Current assignment</h2>
            <dl className="detail-list">
              <dt>Department</dt>
              <dd>{complaint.department || 'Not assigned yet'}</dd>
              <dt>Staff member</dt>
              <dd>{complaint.assignedStaff || 'Not assigned yet'}</dd>

              {complaint.resolvedAt && (
                <>
                  <dt>Marked resolved on</dt>
                  <dd>{formatDateTime(complaint.resolvedAt)}</dd>
                </>
              )}
            </dl>
          </section>
        </aside>
      </div>
    </>
  )
}

export default AdminComplaintDetails
