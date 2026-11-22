import { useState } from 'react'
import { Link } from 'react-router-dom'
import ComplaintListItem from '../../components/common/ComplaintListItem'
import EmptyState from '../../components/common/EmptyState'
import FormField from '../../components/common/FormField'
import Icon from '../../components/common/Icon'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { complaintCategories, complaintStatuses } from '../../data/options'
import { toDateInputValue } from '../../utils/formatters'
import './MyComplaints.css'

const emptyFilters = { search: '', status: '', category: '', from: '', to: '' }

function MyComplaints() {
  const { user } = useAuth()
  const { complaints } = useComplaints()
  const [filters, setFilters] = useState(emptyFilters)

  const mine = complaints
    .filter((item) => item.studentEmail.toLowerCase() === user.email.toLowerCase())
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  const searchText = filters.search.trim().toLowerCase()

  const visible = mine.filter((item) => {
    const day = toDateInputValue(item.submittedAt)
    if (searchText) {
      const haystack = `${item.id} ${item.title} ${item.description} ${item.location}`.toLowerCase()
      if (!haystack.includes(searchText)) return false
    }
    if (filters.status && item.status !== filters.status) return false
    if (filters.category && item.category !== filters.category) return false
    if (filters.from && day < filters.from) return false
    if (filters.to && day > filters.to) return false
    return true
  })

  const filtersActive = Object.values(filters).some(Boolean)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFilters({ ...filters, [name]: value })
  }

  return (
    <>
      <PageHeader title="My Complaints" subtitle="Search and filter every complaint you have submitted.">
        <Link to="/student/complaints/new" className="btn btn-primary">
          <Icon name="filePlus" size={18} />
          Register a Complaint
        </Link>
      </PageHeader>

      {mine.length === 0 ? (
        <div className="card">
          <EmptyState title="No complaints yet" text="When you register a complaint, it will appear here.">
            <Link to="/student/complaints/new" className="btn btn-primary">
              Register your first complaint
            </Link>
          </EmptyState>
        </div>
      ) : (
        <>
          <section className="card filter-card" aria-label="Search and filters">
            <div className="filter-grid">
              <FormField
                label="Search"
                name="search"
                type="search"
                value={filters.search}
                onChange={handleChange}
                placeholder="Title, ID or location"
              />
              <FormField
                label="Status"
                name="status"
                type="select"
                options={complaintStatuses}
                emptyLabel="All statuses"
                value={filters.status}
                onChange={handleChange}
              />
              <FormField
                label="Category"
                name="category"
                type="select"
                options={complaintCategories}
                emptyLabel="All categories"
                value={filters.category}
                onChange={handleChange}
              />
              <FormField label="From date" name="from" type="date" value={filters.from} onChange={handleChange} />
              <FormField label="To date" name="to" type="date" value={filters.to} onChange={handleChange} />
            </div>
          </section>

          <section className="card" aria-label="Complaint list">
            <div className="results-bar">
              <p>
                Showing <strong>{visible.length}</strong> of <strong>{mine.length}</strong> complaints
              </p>
              {filtersActive && (
                <button type="button" className="btn btn-outline btn-sm" onClick={() => setFilters(emptyFilters)}>
                  Clear filters
                </button>
              )}
            </div>

            {visible.length === 0 ? (
              <EmptyState
                icon="list"
                title="No complaints match your filters"
                text="Try changing or clearing the filters."
              />
            ) : (
              <ul className="complaint-list">
                {visible.map((item) => (
                  <ComplaintListItem key={item.id} complaint={item} to={`/student/complaints/${item.id}`} />
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </>
  )
}

export default MyComplaints