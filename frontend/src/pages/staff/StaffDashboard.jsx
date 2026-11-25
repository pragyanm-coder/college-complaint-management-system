
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../api/axios'
import ComplaintListItem from '../../components/common/ComplaintListItem'
import EmptyState from '../../components/common/EmptyState'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { useAuth } from '../../context/useAuth'
import { sortByPriority } from '../../utils/complaintUtils'

function StaffDashboard() {
  const { user } = useAuth()
  const [mine, setMine] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/api/staff/complaints')

        const formattedComplaints = response.data.data.map((item) => ({
          ...item,
          id: item._id,
          submittedAt: item.createdAt,
          studentName: item.student?.fullName || '',
          studentEmail: item.student?.email || '',
          studentRollNumber: item.student?.rollNumber || '',
          department: item.assignedStaff?.handlingDepartment || '',
          assignedStaff: item.assignedStaff?.fullName || '',
          updates: (item.updates || []).map((update) => ({
            ...update,
            type: update.type === 'Comment' ? 'remark' : 'status',
            author: typeof update.author === 'object'
              ? update.author?.fullName || 'System'
              : update.author || 'System',
          })),
        }))

        setMine(formattedComplaints)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load assigned complaints.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const countByStatus = (status) =>
    mine.filter((item) => item.status === status).length

  const open = mine.filter((item) => item.status !== 'Resolved')
  const needsAttention = sortByPriority(open).slice(0, 5)
  const urgentCount = open.filter(
    (item) => item.priority === 'Urgent'
  ).length

  return (
    <>
      <PageHeader
        title={`Welcome, ${user.fullName || user.name}`}
        subtitle="Complaints assigned to you or your department."
      />

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {urgentCount > 0 && (
        <div className="alert alert-error" role="status">
          <strong>{urgentCount}</strong> urgent{' '}
          {urgentCount === 1 ? 'complaint needs' : 'complaints need'} your
          attention.{' '}
          <Link to={`/staff/complaints/${needsAttention[0].id}`}>
            Open {needsAttention[0].id}
          </Link>
        </div>
      )}

      <div className="stat-grid">
        <StatCard icon="inbox" label="Assigned to me" value={loading ? '—' : mine.length} tone="blue" />
        <StatCard icon="clock" label="Not started" value={loading ? '—' : countByStatus('Pending')} tone="amber" />
        <StatCard icon="refresh" label="In progress" value={loading ? '—' : countByStatus('In Progress')} tone="indigo" />
        <StatCard icon="checkCircle" label="Resolved" value={loading ? '—' : countByStatus('Resolved')} tone="green" />
      </div>

      <section className="card" aria-labelledby="attention-heading">
        <div className="section-head">
          <h2 id="attention-heading">Needs your attention</h2>
          {mine.length > 0 && <Link to="/staff/complaints">View all</Link>}
        </div>

        {loading ? (
          <p>Loading assigned complaints...</p>
        ) : needsAttention.length === 0 ? (
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
