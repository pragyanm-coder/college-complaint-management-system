
import { useEffect, useState } from 'react'
import EmptyState from '../../components/common/EmptyState'
import FormField from '../../components/common/FormField'
import { useComplaints } from '../../context/useComplaints'
import './AdminManage.css'

function StudentsTable() {
  const { complaints, fetchAllComplaints } = useComplaints()

  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setError('')
        await fetchAllComplaints()
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load student information.')
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const studentMap = new Map()

  complaints.forEach((complaint) => {
    const student = complaint.student

    if (!student || !student.email) return

    if (!studentMap.has(student.email)) {
      studentMap.set(student.email, {
        name: student.fullName || 'Unknown',
        email: student.email,
        rollNumber: student.rollNumber || '—',
        department: student.department || '—',
        year: student.year || '—',
        complaintCount: 0,
      })
    }

    studentMap.get(student.email).complaintCount += 1
  })

  const students = [...studentMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )

  const text = search.trim().toLowerCase()

  const visible = students.filter((student) =>
    `${student.name} ${student.email} ${student.rollNumber} ${student.department}`
      .toLowerCase()
      .includes(text),
  )

  return (
    <section className="card" aria-label="Students">
      <div className="manage-toolbar">
        <FormField
          label="Search students"
          name="studentSearch"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Name, email, roll number or department"
        />

        <p>
          Showing <strong>{visible.length}</strong> of{' '}
          <strong>{students.length}</strong> students
        </p>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading student information...</div>
      ) : error ? (
        <div className="alert alert-error" role="alert">{error}</div>
      ) : visible.length === 0 ? (
        <EmptyState
          icon="users"
          title="No students found"
          text={search ? 'Try a different search.' : 'No students with registered complaints were found.'}
        />
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
                  <td>{student.complaintCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted-note">
        This list shows students who have registered complaints.
        Account activation and deactivation are not available through the current backend APIs.
      </p>
    </section>
  )
}

export default StudentsTable
