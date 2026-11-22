import { useState } from 'react'
import { ComplaintsContext } from './ComplaintsContext'
import { sampleComplaints } from '../data/sampleComplaints'

function ComplaintsProvider({ children }) {
  // Demo: complaints live in memory only, so they reset when you refresh the page.
  const [complaints, setComplaints] = useState(sampleComplaints)

  // Changes one complaint and leaves all the others untouched.
  const updateComplaint = (id, change) => {
    setComplaints((current) => current.map((item) => (item.id === id ? change(item) : item)))
  }

  // Creates a new complaint for the logged-in student and puts it at the top of the list.
  const addComplaint = (data, user) => {
    const numbers = complaints.map((item) => Number(item.id.replace('CMP-', '')))
    const nextNumber = Math.max(1000, ...numbers) + 1
    const now = new Date().toISOString()

    const newComplaint = {
      id: `CMP-${nextNumber}`,
      title: data.title.trim(),
      category: data.category,
      description: data.description.trim(),
      location: data.location.trim(),
      priority: data.priority,
      status: 'Pending',
      submittedAt: now,
      studentName: user.name,
      studentEmail: user.email,
      department: '',
      assignedStaff: '',
      updates: [{ type: 'status', date: now, author: user.name, text: 'Complaint submitted' }],
      resolvedAt: null,
      studentConfirmed: false,
      rating: null,
      feedback: '',
    }

    setComplaints([newComplaint, ...complaints])
    return newComplaint
  }

  // The student says the issue is really fixed, and leaves a rating and feedback.
  const confirmResolution = (id, { rating, feedback }, user) => {
    const now = new Date().toISOString()
    updateComplaint(id, (item) => ({
      ...item,
      studentConfirmed: true,
      rating,
      feedback: feedback.trim(),
      updates: [
        ...item.updates,
        { type: 'status', date: now, author: user.name, text: 'Student confirmed the complaint is resolved' },
      ],
    }))
  }

  // The student says the issue is NOT fixed, so the complaint goes back to In Progress.
  const reopenComplaint = (id, reason, user) => {
    const now = new Date().toISOString()
    updateComplaint(id, (item) => ({
      ...item,
      status: 'In Progress',
      resolvedAt: null,
      studentConfirmed: false,
      updates: [
        ...item.updates,
        { type: 'status', date: now, author: user.name, text: 'Student reported the issue is not resolved' },
        { type: 'remark', date: now, author: user.name, text: reason.trim() },
      ],
    }))
  }

  // Staff: change the status, and optionally add a remark at the same time.
  const updateStatus = (id, status, remark, user) => {
    const now = new Date().toISOString()
    updateComplaint(id, (item) => {
      const entries = [
        {
          type: 'status',
          date: now,
          author: user.name,
          text: status === 'Resolved' ? 'Marked as resolved' : `Status changed to ${status}`,
        },
      ]
      if (remark.trim()) {
        entries.push({ type: 'remark', date: now, author: user.name, text: remark.trim() })
      }
      return {
        ...item,
        status,
        resolvedAt: status === 'Resolved' ? now : null,
        studentConfirmed: false,
        updates: [...item.updates, ...entries],
      }
    })
  }

  // Staff: add a remark without changing the status.
  const addRemark = (id, text, user) => {
    const now = new Date().toISOString()
    updateComplaint(id, (item) => ({
      ...item,
      updates: [...item.updates, { type: 'remark', date: now, author: user.name, text: text.trim() }],
    }))
  }

  // Admin: assign (or reassign) a complaint to a department and a staff member.
  const assignComplaint = (id, { department, staff }, user) => {
    const now = new Date().toISOString()
    updateComplaint(id, (item) => ({
      ...item,
      department,
      assignedStaff: staff,
      updates: [
        ...item.updates,
        {
          type: 'status',
          date: now,
          author: user.name,
          text: `${item.assignedStaff ? 'Reassigned' : 'Assigned'} to ${department} (${staff})`,
        },
      ],
    }))
  }

  return (
    <ComplaintsContext.Provider
      value={{
        complaints,
        addComplaint,
        confirmResolution,
        reopenComplaint,
        updateStatus,
        addRemark,
        assignComplaint,
      }}
    >
      {children}
    </ComplaintsContext.Provider>
  )
}

export default ComplaintsProvider