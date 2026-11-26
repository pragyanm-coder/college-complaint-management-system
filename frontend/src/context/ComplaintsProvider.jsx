
import { useState } from 'react'
import { ComplaintsContext } from './ComplaintsContext'
import api from '../api/axios'

function formatComplaint(complaint) {
  return {
    ...complaint,
    id: complaint._id,
    submittedAt: complaint.createdAt,
    studentName: complaint.student?.fullName || '',
    studentEmail: complaint.student?.email || '',
    studentRollNumber: complaint.student?.rollNumber || '',
    department: complaint.assignedStaff?.handlingDepartment || '',
    assignedStaff: complaint.assignedStaff?.fullName || '',
    updates: (complaint.updates || []).map((item) => ({
      ...item,
      type: item.type === 'Comment' ? 'remark' : 'status',
      author: typeof item.author === 'object'
        ? item.author?.fullName || 'System'
        : item.author || 'System',
    })),
  }
}

function ComplaintsProvider({ children }) {
  const [complaints, setComplaints] = useState([])

  // Fetch complaints submitted by the logged-in student.
  const fetchMyComplaints = async () => {
    const response = await api.get('/api/complaints/my')
    const myComplaints = response.data.data.map(formatComplaint)

    setComplaints(myComplaints)
    return myComplaints
  }

  // Fetch all complaints for the admin.
  const fetchAllComplaints = async () => {
    const response = await api.get('/api/admin/complaints')
    const allComplaints = response.data.data.map(formatComplaint)

    setComplaints(allComplaints)
    return allComplaints
  }

  // Student confirms resolution and submits rating/feedback.
  const confirmResolution = async (complaintId, rating, feedback) => {
    const response = await api.patch(
      `/api/complaints/${complaintId}/confirm`,
      { rating, feedback }
    )

    const updated = response.data.data
    const formatted = formatComplaint(updated)

    setComplaints((previous) =>
      previous.map((item) =>
        item.id === complaintId
          ? {
              ...item,
              status: updated.status,
              studentConfirmed: updated.studentConfirmed,
              rating: updated.rating,
              feedback: updated.feedback,
              updates: formatted.updates,
            }
          : item
      )
    )

    return formatted
  }

  // Student reopens a resolved complaint.
  const reopenComplaint = async (complaintId) => {
    const response = await api.patch(
      `/api/complaints/${complaintId}/reopen`
    )

    const updated = response.data.data
    const formatted = formatComplaint(updated)

    setComplaints((previous) =>
      previous.map((item) =>
        item.id === complaintId
          ? {
              ...item,
              status: updated.status,
              studentConfirmed: updated.studentConfirmed,
              rating: updated.rating,
              feedback: updated.feedback,
              resolutionDetails: updated.resolutionDetails,
              resolvedAt: updated.resolvedAt,
              updates: formatted.updates,
            }
          : item
      )
    )

    return formatted
  }

  // Staff assignment.
  const assignComplaint = async () => {
    throw new Error('Staff assignment requires a staff ID and the staff directory integration.')
  }

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        setComplaints,
        fetchMyComplaints,
        fetchAllComplaints,
        confirmResolution,
        reopenComplaint,
        assignComplaint,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  )
}

export default ComplaintsProvider
