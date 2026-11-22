import { Link } from 'react-router-dom'
import PageHeader from '../../components/common/PageHeader'

function StudentPlaceholder({ title }) {
  return (
    <>
      <PageHeader title={title} subtitle="This page will be built in the next step." />
      <Link to="/student/dashboard" className="btn btn-outline">
        Back to Dashboard
      </Link>
    </>
  )
}

export default StudentPlaceholder