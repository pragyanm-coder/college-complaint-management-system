import { Link, useParams } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'
import PriorityBadge from '../../components/common/PriorityBadge'
import ProgressTracker from '../../components/common/ProgressTracker'
import StatusBadge from '../../components/common/StatusBadge'
import Timeline from '../../components/common/Timeline'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { isAssignedTo } from '../../utils/complaintUtils'
import { formatDateTime } from '../../utils/formatters'
import StaffUpdatePanel from './StaffUpdatePanel'
// Shared page layout styles (details grid, cards, lists) from the student details page.
import '../student/ComplaintDetails.css'
import './StaffComplaintDetails.css'

function StaffComplaintDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const { complaints } = useComplaints()

  // Staff may only open complaints assigned to them.
  const complaint = complaints.find((item) => item.id === id && isAssignedTo(item, user))

  if (!complaint) {
    return (
      <>
        <PageHeader
          title="Complaint not found"
          subtitle="This complaint does not exist, or it is not assigned to you."
        />
        <Link to="/staff/complaints" className="btn btn-primary">Back to Assigned Complaints</Link>
      </>
    )
  }

  return (
    <>
      <Link to="/staff/complaints" className="back-link">← Back to Assigned Complaints</Link>

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
              <dd><PriorityBadge priority={complaint.priority} /></dd>
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