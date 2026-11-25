
import { useEffect, useState } from 'react'
import BarChart from '../../components/common/BarChart'
import EmptyState from '../../components/common/EmptyState'
import FormField from '../../components/common/FormField'
import Icon from '../../components/common/Icon'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { useComplaints } from '../../context/useComplaints'
import { complaintCategories, complaintStatuses, priorities } from '../../data/options'
import { emptyFilters, filterComplaints } from '../../utils/complaintUtils'
import { downloadCsv } from '../../utils/exportCsv'
import { toDateInputValue } from '../../utils/formatters'
import './AdminReports.css'

const DAY = 24 * 60 * 60 * 1000
const emptyReportFilters = { from: '', to: '', category: '', department: '' }

function countBy(list, getValue, labels) {
  return labels.map((label) => ({
    label,
    value: list.filter((item) => getValue(item) === label).length,
  }))
}

function AdminReports() {
  const { complaints, fetchAllComplaints } = useComplaints()

  const [filters, setFilters] = useState(emptyReportFilters)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setError('')
        await fetchAllComplaints()
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load complaint reports.')
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const departments = [...new Set(
    complaints.map((item) => item.department).filter(Boolean),
  )].sort()

  const staff = [...new Set(
    complaints.map((item) => item.assignedStaff).filter(Boolean),
  )].sort()

  const list = filterComplaints(complaints, { ...emptyFilters, ...filters })
  const filtersActive = Object.values(filters).some(Boolean)

  const total = list.length
  const resolved = list.filter((item) => item.status === 'Resolved').length
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0

  const withTime = list.filter((item) => item.resolvedAt)
  const averageDays = withTime.length
    ? (
        withTime.reduce(
          (sum, item) =>
            sum + (new Date(item.resolvedAt) - new Date(item.submittedAt)) / DAY,
          0,
        ) / withTime.length
      ).toFixed(1)
    : null

  const rated = list.filter((item) => item.rating)
  const averageRating = rated.length
    ? (rated.reduce((sum, item) => sum + item.rating, 0) / rated.length).toFixed(1)
    : null

  const statusItems = countBy(list, (item) => item.status, complaintStatuses)
  const priorityItems = countBy(list, (item) => item.priority, priorities)
  const categoryItems = countBy(list, (item) => item.category, complaintCategories)

  const departmentItems = countBy(
    list,
    (item) => item.department || 'Unassigned',
    [...departments, 'Unassigned'],
  )

  const workloadItems = staff.map((member) => ({
    label: member,
    value: list.filter(
      (item) => item.assignedStaff === member && item.status !== 'Resolved',
    ).length,
  }))

  const handleChange = (event) => {
    const { name, value } = event.target
    setFilters((previous) => ({ ...previous, [name]: value }))
  }

  const handleDownload = () => {
    const headers = [
      'ID', 'Title', 'Category', 'Priority', 'Status', 'Student', 'Student email',
      'Department', 'Assigned staff', 'Submitted', 'Resolved', 'Rating',
    ]

    const rows = list.map((item) => [
      item.id,
      item.title,
      item.category,
      item.priority,
      item.status,
      item.studentName,
      item.studentEmail,
      item.department || 'Unassigned',
      item.assignedStaff,
      toDateInputValue(item.submittedAt),
      item.resolvedAt ? toDateInputValue(item.resolvedAt) : '',
      item.rating ?? '',
    ])

    downloadCsv(
      `complaints-report-${toDateInputValue(new Date().toISOString())}.csv`,
      headers,
      rows,
    )
  }

  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Statistics about complaints. Use the filters to narrow them down."
      >
        <button
          type="button"
          className="btn btn-outline"
          onClick={handleDownload}
          disabled={total === 0 || loading || Boolean(error)}
        >
          <Icon name="download" size={18} />
          Download CSV
        </button>
      </PageHeader>

      {loading ? (
        <div className="alert alert-info">Loading complaint reports...</div>
      ) : error ? (
        <div className="alert alert-error" role="alert">{error}</div>
      ) : (
        <>
          <section className="card report-filters" aria-label="Report filters">
            <div className="report-filter-grid">
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
              <FormField
                label="Category"
                name="category"
                type="select"
                options={complaintCategories}
                emptyLabel="All categories"
                value={filters.category}
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
            </div>

            {filtersActive && (
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setFilters(emptyReportFilters)}
              >
                Clear filters
              </button>
            )}
          </section>

          {total === 0 ? (
            <section className="card">
              <EmptyState
                icon="chart"
                title="No complaints match these filters"
                text="Try a wider date range or clear the filters."
              />
            </section>
          ) : (
            <>
              <div className="stat-grid">
                <StatCard icon="inbox" label="Total complaints" value={total} tone="blue" />
                <StatCard
                  icon="checkCircle"
                  label={`Resolved (${resolved} of ${total})`}
                  value={`${resolutionRate}%`}
                  tone="green"
                />
                <StatCard
                  icon="clock"
                  label="Average time to resolve"
                  value={averageDays === null ? '–' : `${averageDays} days`}
                  tone="indigo"
                />
                <StatCard
                  icon="star"
                  label={`Average rating (${rated.length} ${rated.length === 1 ? 'rating' : 'ratings'})`}
                  value={averageRating === null ? '–' : `${averageRating} / 5`}
                  tone="amber"
                />
              </div>

              <div className="report-grid">
                <section className="card" aria-labelledby="status-chart">
                  <h2 id="status-chart" className="report-heading">By status</h2>
                  <BarChart items={statusItems} />
                </section>

                <section className="card" aria-labelledby="priority-chart">
                  <h2 id="priority-chart" className="report-heading">By priority</h2>
                  <BarChart items={priorityItems} />
                </section>

                <section className="card" aria-labelledby="category-chart">
                  <h2 id="category-chart" className="report-heading">By category</h2>
                  <BarChart items={categoryItems} />
                </section>

                <section className="card" aria-labelledby="department-chart">
                  <h2 id="department-chart" className="report-heading">By department</h2>
                  <BarChart items={departmentItems} />
                </section>

                <section className="card" aria-labelledby="workload-chart">
                  <h2 id="workload-chart" className="report-heading">
                    Active complaints per staff member
                  </h2>
                  <BarChart items={workloadItems} />
                </section>
              </div>
            </>
          )}
        </>
      )}
    </>
  )
}

export default AdminReports
