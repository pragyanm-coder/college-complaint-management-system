import { useState } from 'react'
import FormField from '../../components/common/FormField'
import PageHeader from '../../components/common/PageHeader'
import { useComplaints } from '../../context/useComplaints'
import { useDirectory } from '../../context/useDirectory'
import './AdminManage.css'

function AdminDepartments() {
  const { departments, staff, addDepartment, removeDepartment } = useDirectory()
  const { complaints } = useComplaints()
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [message, setMessage] = useState(null) // { type: 'success' | 'error', text }

  const rows = departments.map((department) => {
    const members = staff.filter((member) => member.departments.includes(department))
    const handled = complaints.filter((item) => item.department === department)
    return {
      name: department,
      members,
      total: handled.length,
      open: handled.filter((item) => item.status !== 'Resolved').length,
    }
  })

  const handleAdd = (event) => {
    event.preventDefault()
    const value = name.trim().replace(/\s+/g, ' ')

    if (value.length < 3) setError('Enter a department name (at least 3 characters).')
    else if (value.length > 40) setError('Keep the name under 40 characters.')
    else if (!/^[A-Za-z0-9 &'-]+$/.test(value)) setError('Use only letters, numbers, spaces, & and -.')
    else if (departments.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setError('This department already exists.')
    } else {
      addDepartment(value)
      setName('')
      setError('')
      setMessage({ type: 'success', text: `${value} was added. You can now assign complaints to it.` })
    }
  }

  const handleRemove = (row) => {
    if (row.members.length > 0) {
      setMessage({
        type: 'error',
        text: `${row.name} cannot be removed because ${row.members.length} staff ${row.members.length === 1 ? 'member works' : 'members work'} in it. Remove it from their profiles first.`,
      })
      return
    }
    if (row.total > 0) {
      setMessage({
        type: 'error',
        text: `${row.name} cannot be removed because it has handled ${row.total} ${row.total === 1 ? 'complaint' : 'complaints'}. Its history must be kept.`,
      })
      return
    }
    if (!window.confirm(`Remove the department "${row.name}"?`)) return

    removeDepartment(row.name)
    setMessage({ type: 'success', text: `${row.name} was removed.` })
  }

  return (
    <>
      <PageHeader title="Departments" subtitle="Manage the departments that handle complaints." />

      {message && (
        <div
          className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-info'}`}
          role={message.type === 'error' ? 'alert' : 'status'}
        >
          {message.text}
        </div>
      )}

      <section className="card manage-form-card" aria-labelledby="add-department-heading">
        <h2 id="add-department-heading">Add a department</h2>
        <form onSubmit={handleAdd} noValidate>
          <FormField
            label="Department name"
            name="departmentName"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setError('')
            }}
            error={error}
            placeholder="Example: Sports Office"
          />
          <button type="submit" className="btn btn-primary">Add department</button>
        </form>
      </section>

      <section className="card" aria-label="Departments">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Department</th>
                <th scope="col">Staff</th>
                <th scope="col">Complaints handled</th>
                <th scope="col">Still open</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.name}>
                  <td><span className="cell-main">{row.name}</span></td>
                  <td>
                    {row.members.length === 0 ? (
                      <span className="cell-sub">No staff yet</span>
                    ) : (
                      <div className="chip-list">
                        {row.members.map((member) => (
                          <span key={member.email} className="chip">{member.name}</span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td>{row.total}</td>
                  <td>{row.open}</td>
                  <td>
                    <button type="button" className="btn btn-outline btn-sm btn-danger" onClick={() => handleRemove(row)}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  )
}

export default AdminDepartments