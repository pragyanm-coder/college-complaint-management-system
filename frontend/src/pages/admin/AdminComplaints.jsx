
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ComplaintBrowser from '../../components/common/ComplaintBrowser'
import PageHeader from '../../components/common/PageHeader'
import { useComplaints } from '../../context/useComplaints'
import { emptyFilters } from '../../utils/complaintUtils'

function AdminComplaints() {
  const { complaints, fetchAllComplaints } = useComplaints()
  const [params] = useSearchParams()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setLoading(true)
        setError('')
        await fetchAllComplaints()
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load complaints.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const newestFirst = [...complaints].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
  )

  const initialFilters = {
    ...emptyFilters,
    assignment: params.get('assignment') === 'Unassigned' ? 'Unassigned' : '',
  }

  return (
    <>
      <PageHeader
        title="All Complaints"
        subtitle="Every complaint submitted in the college. Open one to assign it."
      />

      {loading && <p>Loading complaints...</p>}

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <ComplaintBrowser
          key={params.toString()}
          complaints={newestFirst}
          linkBase="/admin/complaints"
          showStudent
          showAssignment
          adminFilters
          initialFilters={initialFilters}
          emptyTitle="No complaints yet"
          emptyText="Complaints submitted by students will appear here."
        />
      )}
    </>
  )
}

export default AdminComplaints
