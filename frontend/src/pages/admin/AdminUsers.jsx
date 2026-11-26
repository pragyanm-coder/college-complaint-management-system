
import { useState } from 'react'
import PageHeader from '../../components/common/PageHeader'
import StaffSection from './StaffSection'
import StudentsTable from './StudentsTable'
import './AdminManage.css'

function AdminUsers() {
  const [tab, setTab] = useState('students')

  return (
    <>
      <PageHeader
        title="Users"
        subtitle="View student and staff information."
      />

      <div className="tab-row" role="group" aria-label="User type">
        <button
          type="button"
          className="btn btn-outline"
          aria-pressed={tab === 'students'}
          onClick={() => setTab('students')}
        >
          Students
        </button>

        <button
          type="button"
          className="btn btn-outline"
          aria-pressed={tab === 'staff'}
          onClick={() => setTab('staff')}
        >
          Staff
        </button>
      </div>

      {tab === 'students' ? <StudentsTable /> : <StaffSection />}
    </>
  )
}

export default AdminUsers
