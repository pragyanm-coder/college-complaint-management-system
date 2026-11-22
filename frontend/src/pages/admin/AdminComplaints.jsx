import { useSearchParams } from 'react-router-dom'
import ComplaintBrowser from '../../components/common/ComplaintBrowser'
import PageHeader from '../../components/common/PageHeader'
import { useComplaints } from '../../context/useComplaints'
import { emptyFilters } from '../../utils/complaintUtils'

function AdminComplaints() {
  const { complaints } = useComplaints()
  const [params] = useSearchParams()

  const newestFirst = [...complaints].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt),
  )

  // The dashboard links here with ?assignment=Unassigned to pre-select that filter.
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
    </>
  )
}

export default AdminComplaints