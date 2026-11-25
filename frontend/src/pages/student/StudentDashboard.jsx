
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState'
import Icon from '../../components/common/Icon'
import PageHeader from '../../components/common/PageHeader'
import PriorityBadge from '../../components/common/PriorityBadge'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { formatDate } from '../../utils/formatters'
import './StudentDashboard.css'

function StudentDashboard() {
  const { user } = useAuth()
  const { complaints, fetchMyComplaints } = useComplaints()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setError('')
        await fetchMyComplaints()
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load your complaints.')
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const mine = complaints

  const countByStatus = (status) =>
    mine.filter((complaint) => complaint.status === status).length

  const awaitingConfirmation = mine.filter(
    (complaint) => complaint.status === 'Resolved' && !complaint.studentConfirmed,
  )

  const recent = [...mine]
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5)

  return (
    <>
      <PageHeader
        title={`Welcome, ${user?.fullName || user?.name || 'Student'}`}
        subtitle="Here is a summary of your complaints."
      >
        <Link to="/student/complaints/new" className="btn btn-primary">
          <Icon name="filePlus" size={18} />
          Register a Complaint
        </Link>
      </PageHeader>

      {loading ? (
        <div className="alert alert-info">Loading your complaints...</div>
      ) : error ? (
        <div className="alert alert-error" role="alert">{error}</div>
      ) : (
        <>
          {awaitingConfirmation.length > 0 && (
            <div className="alert alert-info" role="status">
              <strong>{awaitingConfirmation.length}</strong> resolved{' '}
              {awaitingConfirmation.length === 1 ? 'complaint is' : 'complaints are'} waiting for your
              confirmation.{' '}
              <Link to={`/student/complaints/${awaitingConfirmation[0].id}`}>
                Review complaint
              </Link>
            </div>
          )}

          <div className="stat-grid">
            <StatCard icon="inbox" label="Total complaints" value={mine.length} tone="blue" />
            <StatCard icon="clock" label="Pending" value={countByStatus('Pending')} tone="amber" />
            <StatCard icon="refresh" label="In progress" value={countByStatus('In Progress')} tone="indigo" />
            <StatCard icon="checkCircle" label="Resolved" value={countByStatus('Resolved')} tone="green" />
          </div>

          <div className="dash-grid">
            <section className="card" aria-labelledby="recent-heading">
              <div className="section-head">
                <h2 id="recent-heading">Recent complaints</h2>
                {mine.length > 0 && <Link to="/student/complaints">View all</Link>}
              </div>

              {recent.length === 0 ? (
                <EmptyState
                  title="No complaints yet"
                  text="When you register a complaint, it will appear here."
                >
                  <Link to="/student/complaints/new" className="btn btn-primary">
                    Register your first complaint
                  </Link>
                </EmptyState>
              ) : (
                <ul className="complaint-list">
                  {recent.map((complaint) => (
                    <li key={complaint.id} className="complaint-item">
                      <Link to={`/student/complaints/${complaint.id}`}>
                        <div>
                          <p className="complaint-title">{complaint.title}</p>
                          <p className="complaint-meta">
                            {complaint.id} · {complaint.category} · {formatDate(complaint.submittedAt)}
                          </p>
                        </div>
                        <div className="complaint-badges">
                          <PriorityBadge priority={complaint.priority} />
                          <StatusBadge status={complaint.status} />
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className="card" aria-labelledby="quick-heading">
              <h2 id="quick-heading" className="quick-heading">Quick links</h2>
              <Link to="/student/complaints/new" className="quick-link">
                <span className="stat-icon tone-blue"><Icon name="filePlus" /></span>
                <span>
                  <strong>Register a Complaint</strong>
                  <small>Report a new problem</small>
                </span>
              </Link>
              <Link to="/student/complaints" className="quick-link">
                <span className="stat-icon tone-indigo"><Icon name="list" /></span>
                <span>
                  <strong>My Complaints</strong>
                  <small>Track all your complaints</small>
                </span>
              </Link>
            </section>
          </div>
        </>
      )}
    </>
  )
}

export default StudentDashboard
