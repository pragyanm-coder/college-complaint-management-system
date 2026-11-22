import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import { useDirectory } from '../../context/useDirectory'
import StaffSection from './StaffSection'
import StudentsTable from './StudentsTable'
import './AdminManage.css'

function AdminUsers() {
  const { students, staff } = useDirectory()
  const [tab, setTab] = useState('students')

  return (
    <>
      <PageHeader title="Users" subtitle="View and manage student and staff accounts." />

      <div className="tab-row" role="group" aria-label="User type">
        <button
          type="button"
          className="btn btn-outline"
          aria-pressed={tab === 'students'}
          onClick={() => setTab('students')}
        >
          Students ({students.length})
        </button>
        <button
          type="button"
          className="btn btn-outline"
          aria-pressed={tab === 'staff'}
          onClick={() => setTab('staff')}
        >
          Staff ({staff.length})
        </button>
      </div>

      {tab === 'students' ? <StudentsTable /> : <StaffSection />}
    </>
  )
}

export default AdminUsers