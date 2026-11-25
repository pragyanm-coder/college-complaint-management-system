
import { useState } from 'react'
import ComplaintListItem from './ComplaintListItem'
import EmptyState from './EmptyState'
import FormField from './FormField'
import { complaintCategories, complaintStatuses, priorities } from '../../data/options'
import { emptyFilters, filterComplaints } from '../../utils/complaintUtils'
import './ComplaintBrowser.css'

function ComplaintBrowser({
  complaints,
  linkBase,
  showStudent = false,
  showAssignment = true,
  adminFilters = false,
  initialFilters,
  emptyTitle = 'No complaints yet',
  emptyText = '',
}) {
  const [filters, setFilters] = useState(initialFilters ?? emptyFilters)

  const departments = [
    ...new Set(
      complaints
        .map((item) => item.department || item.assignedStaff?.handlingDepartment)
        .filter(Boolean)
    ),
  ].sort()

  const visible = filterComplaints(complaints, filters)
  const filtersActive = Object.values(filters).some(Boolean)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFilters({ ...filters, [name]: value })
  }

  if (complaints.length === 0) {
    return (
      <div className="card">
        <EmptyState title={emptyTitle} text={emptyText} />
      </div>
    )
  }

  return (
    <>
      <section className="card browser-filters" aria-label="Search and filters">
        <div className="browser-filter-grid">
          <FormField
            label="Search"
            name="search"
            type="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Title, ID, student or location"
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
            label="Priority"
            name="priority"
            type="select"
            options={priorities}
            emptyLabel="All priorities"
            value={filters.priority}
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

          {adminFilters && (
            <>
              <FormField
                label="Assignment"
                name="assignment"
                type="select"
                options={['Assigned', 'Unassigned']}
                emptyLabel="All"
                value={filters.assignment}
                onChange={handleChange}
              />

              <FormField
                label="Department"
                name="department"
                type="select"
                options={departments}
                emptyLabel="All departments"
                value={filters.department}
                onChange={handleChange}
              />
            </>
          )}

          <FormField
            label="From date"
            name="from"
            type="date"
            value={filters.from}
            onChange={handleChange}
          />

          <FormField
            label="To date"
            name="to"
            type="date"
            value={filters.to}
            onChange={handleChange}
          />
        </div>
      </section>

      <section className="card" aria-label="Complaint list">
        <div className="browser-results-bar">
          <p>
            Showing <strong>{visible.length}</strong> of{' '}
            <strong>{complaints.length}</strong> complaints
          </p>

          {filtersActive && (
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={() => setFilters(emptyFilters)}
            >
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
              <ComplaintListItem
                key={item.id}
                complaint={item}
                to={`${linkBase}/${item.id}`}
                showStudent={showStudent}
                showAssignment={showAssignment}
              />
            ))}
          </ul>
        )}
      </section>
    </>
  )
}

export default ComplaintBrowser
