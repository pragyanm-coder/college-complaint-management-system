import { useState } from 'react'
import Icon from '../../components/common/Icon'
import { useComplaints } from '../../context/useComplaints'
import { useDirectory } from '../../context/useDirectory'
import StaffForm from './StaffForm'
import './AdminManage.css'

function StaffSection() {
  const { staff, setStaffActive } = useDirectory()
  const { complaints } = useComplaints()
  const [editing, setEditing] = useState(null) // null, 'new', or the email of the staff member being edited
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text }

  // Complaints this person still has to work on.
  const activeCount = (member) =>
    complaints.filter((item) => item.assignedStaff === member.name && item.status !== 'Resolved').length

  const handleToggle = (member) => {
    if (member.active) {
      const open = activeCount(member)
      if (open > 0) {
        setMessage({
          type: 'error',
          text: `${member.name} still has ${open} active ${open === 1 ? 'complaint' : 'complaints'}. Reassign ${open === 1 ? 'it' : 'them'} first, then deactivate.`,
        })
        return
      }
      setStaffActive(member.email, false)
      setMessage({ type: 'success', text: `${member.name} has been deactivated and can no longer be assigned complaints.` })
    } else {
      setStaffActive(member.email, true)
      setMessage({ type: 'success', text: `${member.name} has been activated.` })
    }
  }

  const handleSaved = (text) => {
    setEditing(null)
    setMessage({ type: 'success', text })
  }

  const editingMember = staff.find((member) => member.email === editing)

  return (
    <>
      {message && (
        <div
          className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-info'}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </div>
      )}

      {editing !== null && (
        <StaffForm
          key={editing}
          member={editingMember ?? null}
          onSaved={handleSaved}
          onCancel={() => setEditing(null)}
        />
      )}

      <section className="card" aria-label="Staff">
        <div className="manage-toolbar">
          <p>
            <strong>{staff.length}</strong> staff members
          </p>
          {editing === null && (
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => {
                setMessage(null)
                setEditing('new')
              }}
            >
              <Icon name="plus" size={16} />
              Add staff member
            </button>
          )}
        </div>

        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Staff member</th>
                <th scope="col">Departments</th>
                <th scope="col">Active complaints</th>
                <th scope="col">Status</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr key={member.email}>
                  <td>
                    <span className="cell-main">{member.name}</span>
                    <span className="cell-sub">{member.email}</span>
                  </td>
                  <td>
                    <div className="chip-list">
                      {member.departments.map((name) => (
                        <span key={name} className="chip">{name}</span>
                      ))}
                    </div>
                  </td>
                  <td>{activeCount(member)}</td>
                  <td>
                    <span className={`badge ${member.active ? 'badge-resolved' : 'badge-low'}`}>
                      {member.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => {
                          setMessage(null)
                          setEditing(member.email)
                        }}
                      >
                        Edit departments
                      </button>
                      <button
                        type="button"
                        className={`btn btn-outline btn-sm ${member.active ? 'btn-danger' : ''}`}
                        onClick={() => handleToggle(member)}
                      >
                        {member.active ? 'Deactivate' : 'Activate'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="muted-note">
          Deactivated staff do not appear when assigning complaints and cannot log in.
        </p>
      </section>
    </>
  )
}

export default StaffSection