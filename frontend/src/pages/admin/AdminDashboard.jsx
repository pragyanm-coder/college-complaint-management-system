import { Link } from 'react-router-dom'
import BarChart from '../../components/common/BarChart'
import ComplaintListItem from '../../components/common/ComplaintListItem'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { complaintCategories } from '../../data/options'
import { sortByPriority } from '../../utils/complaintUtils'
import './AdminDashboard.css'

function AdminDashboard() {
  const { user } = useAuth()
  const { complaints } = useComplaints()

  const countByStatus = (status) => complaints.filter((item) => item.status === status).length

  const unassigned = complaints.filter((item) => !item.assignedStaff)
  const urgentUnassigned = unassigned.filter((item) => item.priority === 'Urgent').length
  const waiting = sortByPriority(unassigned).slice(0, 5)

  const categoryItems = complaintCategories.map((label) => ({
    label,
    value: complaints.filter((item) => item.category === label).length,
  }))

  return (
    <>
      <PageHeader title={`Welcome, ${user.name}`} subtitle="Overview of all complaints in the college." />

      {unassigned.length > 0 && (
        <div className="alert alert-info" role="status">
          <strong>{unassigned.length}</strong>{' '}
          {unassigned.length === 1 ? 'complaint is' : 'complaints are'} waiting to be assigned
          {urgentUnassigned > 0 && ` (${urgentUnassigned} urgent)`}.{' '}
          <Link to="/admin/complaints?assignment=Unassigned">View them</Link>
        </div>
      )}

      <div className="stat-grid">
        <StatCard icon="inbox" label="Total complaints" value={complaints.length} tone="blue" />
        <StatCard icon="clock" label="Pending" value={countByStatus('Pending')} tone="amber" />
        <StatCard icon="refresh" label="In progress" value={countByStatus('In Progress')} tone="indigo" />
        <StatCard icon="checkCircle" label="Resolved" value={countByStatus('Resolved')} tone="green" />
      </div>

      <div className="admin-grid">
        <section className="card" aria-labelledby="waiting-heading">
          <div className="section-head">
            <h2 id="waiting-heading">Waiting for assignment</h2>
            {unassigned.length > 0 && <Link to="/admin/complaints?assignment=Unassigned">View all</Link>}
          </div>

          {waiting.length === 0 ? (
            <EmptyState
              icon="checkCircle"
              title="Everything is assigned"
              text="Every complaint has a department and a staff member."
            />
          ) : (
            <ul className="complaint-list">
              {waiting.map((item) => (
                <ComplaintListItem
                  key={item.id}
                  complaint={item}
                  to={`/admin/complaints/${item.id}`}
                  showStudent
                  showAssignment={false}
                />
              ))}
            </ul>
          )}
        </section>

        <section className="card" aria-labelledby="category-heading">
          <h2 id="category-heading" className="chart-heading">Complaints by category</h2>
          <BarChart items={categoryItems} />
        </section>
      </div>
    </>
  )
}

export default AdminDashboard