import { Link } from 'react-router-dom'
import PriorityBadge from './PriorityBadge'
import StatusBadge from './StatusBadge'
import { formatDate } from '../../utils/formatters'

function ComplaintListItem({ complaint, to, showStudent = false, showAssignment = true }) {
  return (
    <li className="complaint-item">
      <Link to={to}>
        <div>
          <p className="complaint-title">{complaint.title}</p>
          <p className="complaint-meta">
            {complaint.id} · {complaint.category} · {formatDate(complaint.submittedAt)}
          </p>
          {showStudent && (
            <p className="complaint-meta">Submitted by {complaint.studentName}</p>
          )}
          {showAssignment && complaint.department && (
            <p className="complaint-meta">
              Assigned to {complaint.department}
              {complaint.assignedStaff ? ` (${complaint.assignedStaff})` : ''}
            </p>
          )}
        </div>
        <div className="complaint-badges">
          <PriorityBadge priority={complaint.priority} />
          <StatusBadge status={complaint.status} />
        </div>
      </Link>
    </li>
  )
}

export default ComplaintListItem