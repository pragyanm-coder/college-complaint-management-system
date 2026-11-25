
import { useEffect, useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import { useComplaints } from '../../context/useComplaints'
import './AdminManage.css'

function AdminDepartments() {
  const { complaints, fetchAllComplaints } = useComplaints()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadComplaints = async () => {
      try {
        setError('')
        await fetchAllComplaints()
      } catch (err) {
        setError(
          err.response?.data?.message ||
          'Unable to load department information.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadComplaints()
  }, [])

  const departmentMap = new Map()

  complaints.forEach((complaint) => {
    const department =
      complaint.assignedStaff?.handlingDepartment ||
      complaint.department

    if (!department) return

    if (!departmentMap.has(department)) {
      departmentMap.set(department, {
        name: department,
        members: new Set(),
        total: 0,
        open: 0,
      })
    }

    const row = departmentMap.get(department)

    if (complaint.assignedStaff?.fullName) {
      row.members.add(complaint.assignedStaff.fullName)
    } else if (typeof complaint.assignedStaff === 'string') {
      row.members.add(complaint.assignedStaff)
    }

    row.total += 1

    if (complaint.status !== 'Resolved') {
      row.open += 1
    }
  })

  const rows = [...departmentMap.values()]
    .map((row) => ({
      ...row,
      members: [...row.members],
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <>
      <PageHeader
        title="Departments"
        subtitle="View departments handling college complaints."
      />

      <div className="alert alert-info" role="status">
        Department creation and removal are not currently supported by the
        backend. This page displays departments found in actual complaint
        assignments.
      </div>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
        </div>
      )}

      <section className="card">
        <h2>Department overview</h2>

        {loading ? (
          <p>Loading department information...</p>
        ) : (
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
                    <td>
                      <span className="cell-main">{row.name}</span>
                    </td>

                    <td>
                      {row.members.length === 0 ? (
                        <span className="cell-sub">No staff information</span>
                      ) : (
                        <div className="chip-list">
                          {row.members.map((member) => (
                            <span key={member} className="chip">
                              {member}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td>{row.total}</td>
                    <td>{row.open}</td>

                    <td>
                      <span className="cell-sub">
                        Management unavailable
                      </span>
                    </td>
                  </tr>
                ))}

                {rows.length === 0 && (
                  <tr>
                    <td colSpan="5">
                      No department assignments found yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  )
}

export default AdminDepartments
