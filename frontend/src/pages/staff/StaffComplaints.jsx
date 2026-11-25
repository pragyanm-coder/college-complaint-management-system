
import { useEffect, useState } from 'react'
import api from '../../api/axios'
import ComplaintBrowser from '../../components/common/ComplaintBrowser'
import PageHeader from '../../components/common/PageHeader'

function StaffComplaints() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAssignedComplaints = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await api.get('/api/staff/complaints')

        const assignedComplaints = response.data.data.map((complaint) => ({
          ...complaint,
          id: complaint._id,
          submittedAt: complaint.createdAt,
          studentName: complaint.student?.fullName || '',
          studentEmail: complaint.student?.email || '',
          studentRollNumber: complaint.student?.rollNumber || '',
          department: complaint.assignedStaff?.handlingDepartment || '',
          assignedStaff: complaint.assignedStaff?.fullName || '',
          updates: complaint.updates || [],
        }))

        setComplaints(assignedComplaints)
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load assigned complaints.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchAssignedComplaints()
  }, [])

  if (loading) {
    return <p>Loading assigned complaints...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  const mine = [...complaints].sort(
    (a, b) => new Date(b.submittedAt) - new Date(a.submittedAt)
  )

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
