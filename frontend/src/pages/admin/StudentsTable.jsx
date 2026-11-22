import { useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import FormField from '../../components/common/FormField'
import { useComplaints } from '../../context/useComplaints'
import { useDirectory } from '../../context/useDirectory'
import './AdminManage.css'

function StudentsTable() {
  const { students, setStudentActive } = useDirectory()
  const { complaints } = useComplaints()
  const [search, setSearch] = useState('')
  const [message, setMessage] = useState('')

  const text = search.trim().toLowerCase()
  const visible = students
    .filter((student) => {
      if (!text) return true
      return `${student.name} ${student.email} ${student.rollNumber} ${student.department}`
        .toLowerCase()
        .includes(text)
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const complaintCount = (student) =>
    complaints.filter((item) => item.studentEmail.toLowerCase() === student.email.toLowerCase()).length

  const handleToggle = (student) => {
    setStudentActive(student.email, !student.active)
    setMessage(`${student.name} has been ${student.active ? 'deactivated' : 'activated'}.`)
  }

  return (
    <section className="card" aria-label="Students">
      <div className="manage-toolbar">
        <FormField
          label="Search students"
          name="studentSearch"
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setMessage('')
          }}
          placeholder="Name, email, roll number or department"
        />
        <p>
          Showing <strong>{visible.length}</strong> of <strong>{students.length}</strong> students
        </p>
      </div>

      {message && <div className="alert alert-info" role="status">{message}</div>}

      {visible.length === 0 ? (
        <EmptyState icon="users" title="No students found" text="Try a different search." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Student</th>
                <th scope="col">Roll no.</th>
                <th scope="col">Department</th>
                <th scope="col">Year</th>
                <th scope="col">Complaints</th>
                <th scope="col">Status</th>
                <th scope="col">Action</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((student) => (
                <tr key={student.email}>
                  <td>
                    <span className="cell-main">{student.name}</span>
                    <span className="cell-sub">{student.email}</span>
                  </td>
                  <td>{student.rollNumber}</td>
                  <td>{student.department}</td>
                  <td>{student.year}</td>
                  <td>{complaintCount(student)}</td>
                  <td>
                    <span className={`badge ${student.active ? 'badge-resolved' : 'badge-low'}`}>
                      {student.active ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className={`btn btn-outline btn-sm ${student.active ? 'btn-danger' : ''}`}
                      onClick={() => handleToggle(student)}
                    >
                      {student.active ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted-note">
        Deactivated students cannot log in. Their complaints are kept.
      </p>
    </section>
  )
}

export default StudentsTable