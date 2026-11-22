import ComplaintBrowser from '../../components/common/ComplaintBrowser'
import PageHeader from '../../components/common/PageHeader'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { isAssignedTo } from '../../utils/complaintUtils'

function StaffComplaints() {
  const { user } = useAuth()
  const { complaints } = useComplaints()

  const mine = complaints
    .filter((item) => isAssignedTo(item, user))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))

  return (
    <>
      <PageHeader
        title="Assigned Complaints"
        subtitle="Search and filter the complaints assigned to you."
      />
      <ComplaintBrowser
        complaints={mine}
        linkBase="/staff/complaints"
        showStudent
        showAssignment={false}
        emptyTitle="No complaints assigned yet"
        emptyText="When the admin assigns a complaint to you, it will appear here."
      />
    </>
  )
}

export default StaffComplaints