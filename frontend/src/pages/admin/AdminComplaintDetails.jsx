import { Link, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import PriorityBadge from '../../components/common/PriorityBadge'
import ProgressTracker from '../../components/common/ProgressTracker'
import StarRating from '../../components/common/StarRating'
import StatusBadge from '../../components/common/StatusBadge'
import Timeline from '../../components/common/Timeline'
import { useComplaints } from '../../context/useComplaints'
import { formatDateTime } from '../../utils/formatters'
import AssignPanel from './AssignPanel'
// Shared page layout styles (details grid, cards, lists) from the student details page.
import '../student/ComplaintDetails.css'
import './AdminComplaintDetails.css'

function AdminComplaintDetails() {
  const { id } = useParams()
  const { complaints } = useComplaints()

  const complaint = complaints.find((item) => item.id === id)

  if (!complaint) {
    return (
      <>
        <PageHeader title="Complaint not found" subtitle="This complaint does not exist." />
        <Link to="/admin/complaints" className="btn btn-primary">Back to All Complaints</Link>
      </>
    )
  }

  return (
    <>
      <Link to="/admin/complaints" className="back-link">← Back to All Complaints</Link>

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

      <AssignPanel complaint={complaint} />

      {complaint.studentConfirmed && (
        <section className="card confirmed-card" aria-labelledby="confirmed-heading">
          <h2 id="confirmed-heading">The student confirmed this complaint is resolved</h2>
          <StarRating value={complaint.rating} />
          <p className="feedback-text">
            {complaint.feedback ? `“${complaint.feedback}”` : 'The student left no written feedback.'}
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