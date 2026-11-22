import { Link, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import PriorityBadge from '../../components/common/PriorityBadge'
import ProgressTracker from '../../components/common/ProgressTracker'
import StarRating from '../../components/common/StarRating'
import StatusBadge from '../../components/common/StatusBadge'
import Timeline from '../../components/common/Timeline'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { formatDateTime } from '../../utils/formatters'
import ResolutionPanel from './ResolutionPanel'
import './ComplaintDetails.css'

function ComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { complaints } = useComplaints()

  // A student may only open their own complaints.
  const complaint = complaints.find(
    (item) => item.id === id && item.studentEmail.toLowerCase() === user.email.toLowerCase(),
  )

  if (!complaint) {
    return (
      <>
        <PageHeader
          title="Complaint not found"
          subtitle="This complaint does not exist, or it does not belong to your account."
        />
        <Link to="/student/complaints" className="btn btn-primary">Back to My Complaints</Link>
      </>
    )
  }

  const waitingForConfirmation = complaint.status === 'Resolved' && !complaint.studentConfirmed

  return (
    <>
      <Link to="/student/complaints" className="back-link">← Back to My Complaints</Link>

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

      {waitingForConfirmation && <ResolutionPanel complaint={complaint} />}

      {complaint.studentConfirmed && (
        <section className="card confirmed-card" aria-labelledby="confirmed-heading">
          <h2 id="confirmed-heading">You confirmed this complaint is resolved</h2>
          <StarRating value={complaint.rating} />
          <p className="feedback-text">
            {complaint.feedback ? `“${complaint.feedback}”` : 'No written feedback.'}
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

        <aside>
          <section className="card details-card" aria-labelledby="assignment-heading">
            <h2 id="assignment-heading">Assignment</h2>
            <dl className="detail-list">
              <dt>Status</dt>
              <dd><StatusBadge status={complaint.status} /></dd>
              <dt>Department</dt>
              <dd>{complaint.department || 'Not assigned yet'}</dd>
              <dt>Staff member</dt>
              <dd>{complaint.assignedStaff || 'Not assigned yet'}</dd>
              {complaint.resolvedAt && (
                <>
                  <dt>Resolved on</dt>
                  <dd>{formatDateTime(complaint.resolvedAt)}</dd>
                </>
              )}
            </dl>
            {!complaint.department && (
              <p className="muted-note">
                The admin will review your complaint and assign it to the right department.
              </p>
            )}
          </section>
        </aside>
      </div>
    </>
  )
}

export default ComplaintDetails