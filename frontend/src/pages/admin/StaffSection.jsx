
import { useEffect, useState } from 'react'
import { useComplaints } from '../../context/useComplaints'
import './AdminManage.css'

function StaffSection() {
  const { complaints, fetchAllComplaints } = useComplaints()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setError('')
        await fetchAllComplaints()
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load staff information.')
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const staffMap = new Map()

  complaints.forEach((complaint) => {
    if (!complaint.assignedStaff) return

    const name = complaint.assignedStaff

    if (!staffMap.has(name)) {
      staffMap.set(name, {
        name,
        departments: new Set(),
        activeComplaints: 0,
        totalComplaints: 0,
      })
    }

    const member = staffMap.get(name)

    if (complaint.department) {
      member.departments.add(complaint.department)
    }

    member.totalComplaints += 1

    if (complaint.status !== 'Resolved') {
      member.activeComplaints += 1
    }
  })

  const staff = [...staffMap.values()]

  return (
    <section className="card" aria-label="Staff">
      <div className="manage-toolbar">
        <p>
          <strong>{staff.length}</strong> staff members found in complaint assignments
        </p>
      </div>

      {loading ? (
        <div className="alert alert-info">Loading staff information...</div>
      ) : error ? (
        <div className="alert alert-error" role="alert">{error}</div>
      ) : staff.length === 0 ? (
        <p className="muted-note">
          No staff members have been assigned complaints yet.
        </p>
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col">Staff member</th>
                <th scope="col">Department</th>
                <th scope="col">Active complaints</th>
                <th scope="col">Total assigned</th>
              </tr>
            </thead>

            <tbody>
              {staff.map((member) => (
                <tr key={member.name}>
                  <td>
                    <span className="cell-main">{member.name}</span>
                  </td>

                  <td>
                    <div className="chip-list">
                      {[...member.departments].map((department) => (
                        <span key={department} className="chip">
                          {department}
                        </span>
                      ))}
                      {member.departments.size === 0 && 'Not specified'}
                    </div>
                  </td>

                  <td>{member.activeComplaints}</td>
                  <td>{member.totalComplaints}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="muted-note">
        This overview includes staff members found in existing complaint assignments.
        Staff account management is not available through the current backend APIs.
      </p>
    </section>
  )
}

export default StaffSection
