import { useState } from 'react'
import FormField from '../../components/common/FormField'
import { useAuth } from '../../context/useAuth'
import { useComplaints } from '../../context/useComplaints'
import { useDirectory } from '../../context/useDirectory'

function AssignPanel({ complaint }) {
  const { user } = useAuth()
  const { assignComplaint } = useComplaints()
  const { departments, staffForDepartment } = useDirectory()
  const [department, setDepartment] = useState(complaint.department)
  const [staff, setStaff] = useState(complaint.assignedStaff)
  const [errors, setErrors] = useState({})
  const [notice, setNotice] = useState('')

  // Once staff mark it resolved, the assignment is locked.
  // (If the student reopens it, it becomes In Progress and can be reassigned.)
  if (complaint.status === 'Resolved') {
    return (
      <section className="card assign-card" aria-labelledby="assign-heading">
        <h2 id="assign-heading">Assignment</h2>
        <p className="muted-note">
          This complaint is resolved, so it cannot be reassigned. If the student says the problem
          is not fixed, it will return to In Progress and you can reassign it.
        </p>
      </section>
    )
  }

  const isAssigned = Boolean(complaint.assignedStaff)
  const staffOptions = department ? staffForDepartment(department) : []

  const handleDepartment = (event) => {
    setDepartment(event.target.value)
    setStaff('') // the old staff member may not work in the new department
    setErrors({})
    setNotice('')
  }

  const handleStaff = (event) => {
    setStaff(event.target.value)
    setErrors({ ...errors, staff: '' })
    setNotice('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = {}
    if (!department) found.department = 'Select a department.'
    if (!staff) {
      found.staff = 'Select a staff member to handle this complaint.'
    } else if (staff === complaint.assignedStaff && department === complaint.department) {
      found.staff = 'This complaint is already assigned to this staff member.'
    }
    setErrors(found)
    if (Object.keys(found).length > 0) return

    assignComplaint(complaint.id, { department, staff }, user)
    setNotice(`${isAssigned ? 'Complaint reassigned' : 'Complaint assigned'} to ${staff} (${department}).`)
  }

  return (
    <section className="card assign-card" aria-labelledby="assign-heading">
      <h2 id="assign-heading">{isAssigned ? 'Reassign this complaint' : 'Assign this complaint'}</h2>
      <p className="muted-note">
        {isAssigned
          ? 'Change the department or staff member handling this complaint.'
          : 'Choose the department that should handle it, then a staff member from that department.'}
      </p>

      {notice && <div className="alert alert-info" role="status">{notice}</div>}

      <form onSubmit={handleSubmit} noValidate>
        <div className="assign-grid">
          <FormField
            label="Department"
            name="department"
            type="select"
            options={departments}
            value={department}
            onChange={handleDepartment}
            error={errors.department}
          />
          <FormField
            label="Staff member"
            name="staff"
            type="select"
            options={staffOptions}
            emptyLabel={department ? 'Select staff member...' : 'Select a department first'}
            value={staff}
            onChange={handleStaff}
            error={errors.staff}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {isAssigned ? 'Reassign complaint' : 'Assign complaint'}
        </button>
      </form>
    </section>
  )
}

export default AssignPanel