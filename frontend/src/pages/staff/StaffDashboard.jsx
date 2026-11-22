import { Link } from 'react-router-dom'
import ComplaintListItem from '../../components/common/ComplaintListItem'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { isAssignedTo, sortByPriority } from '../../utils/complaintUtils'

function StaffDashboard() {
  const { user } = useAuth()
  const { complaints } = useComplaints()

  const mine = complaints.filter((item) => isAssignedTo(item, user))
  const countByStatus = (status) => mine.filter((item) => item.status === status).length

  // Complaints that still need work, most urgent first.
  const open = mine.filter((item) => item.status !== 'Resolved')
  const needsAttention = sortByPriority(open).slice(0, 5)
  const urgentCount = open.filter((item) => item.priority === 'Urgent').length

  return (
    <>
      <PageHeader title={`Welcome, ${user.name}`} subtitle="Complaints assigned to you or your department." />

      {urgentCount > 0 && (
        <div className="alert alert-error" role="status">
          <strong>{urgentCount}</strong> urgent {urgentCount === 1 ? 'complaint needs' : 'complaints need'} your
          attention. <Link to={`/staff/complaints/${needsAttention[0].id}`}>Open {needsAttention[0].id}</Link>
        </div>
      )}

      <div className="stat-grid">
        <StatCard icon="inbox" label="Assigned to me" value={mine.length} tone="blue" />
        <StatCard icon="clock" label="Not started" value={countByStatus('Pending')} tone="amber" />
        <StatCard icon="refresh" label="In progress" value={countByStatus('In Progress')} tone="indigo" />
        <StatCard icon="checkCircle" label="Resolved" value={countByStatus('Resolved')} tone="green" />
      </div>

      <section className="card" aria-labelledby="attention-heading">
        <div className="section-head">
          <h2 id="attention-heading">Needs your attention</h2>
          {mine.length > 0 && <Link to="/staff/complaints">View all</Link>}
        </div>

        {needsAttention.length === 0 ? (
          <EmptyState
            icon="checkCircle"
            title="You are all caught up"
            text="There are no active complaints assigned to you right now."
          />
        ) : (
          <ul className="complaint-list">
            {needsAttention.map((item) => (
              <ComplaintListItem
                key={item.id}
                complaint={item}
                to={`/staff/complaints/${item.id}`}
                showStudent
                showAssignment={false}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default StaffDashboard