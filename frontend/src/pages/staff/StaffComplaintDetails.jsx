
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import api from '../../api/axios'
import PageHeader from '../../components/common/PageHeader'
import PriorityBadge from '../../components/common/PriorityBadge'
import ProgressTracker from '../../components/common/ProgressTracker'
import StatusBadge from '../../components/common/StatusBadge'
import Timeline from '../../components/common/Timeline'
import { formatDateTime } from '../../utils/formatters'
import StaffUpdatePanel from './StaffUpdatePanel'
import '../student/ComplaintDetails.css'
import './StaffComplaintDetails.css'

function StaffComplaintDetails() {
  const { id } = useParams()
  const [complaint, setComplaint] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchComplaint = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get(`/api/complaints/${id}`)
        const data = response.data.data

        setComplaint({
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
        })
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load complaint details.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchComplaint()
  }, [id])

  if (loading) {
    return <p>Loading complaint details...</p>
  }

  if (error || !complaint) {
    return (
      <>
        <PageHeader
          title="Complaint not found"
          subtitle={error || 'This complaint does not exist, or it is not assigned to you.'}
        />
        <Link to="/staff/complaints" className="btn btn-primary">
          Back to Assigned Complaints
        </Link>
      </>
    )
  }

  return (
    <>
      <Link to="/staff/complaints" className="back-link">
        ← Back to Assigned Complaints
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

      <StaffUpdatePanel complaint={complaint} />

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

        <aside>
          <section className="card details-card" aria-labelledby="info-heading">
            <h2 id="info-heading">Complaint info</h2>
            <dl className="detail-list">
              <dt>Submitted by</dt>
              <dd>{complaint.studentName}</dd>

              <dt>Student email</dt>
              <dd>{complaint.studentEmail}</dd>

              <dt>Department</dt>
              <dd>{complaint.department}</dd>

              <dt>Priority</dt>
              <dd>
                <PriorityBadge priority={complaint.priority} />
              </dd>

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

export default StaffComplaintDetails
