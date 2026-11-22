import { useEffect } from 'react'
import { matchPath, useLocation } from 'react-router-dom'

const siteName = 'College Complaint Registration System'

// The first matching address wins, so "new" must come before ":id".
const titles = [
  ['/', 'Home'],
  ['/login', 'Login'],
  ['/register', 'Student Registration'],
  ['/student/dashboard', 'Student Dashboard'],
  ['/student/complaints/new', 'Register a Complaint'],
  ['/student/complaints', 'My Complaints'],
  ['/student/complaints/:id', 'Complaint Details'],
  ['/staff/dashboard', 'Staff Dashboard'],
  ['/staff/complaints', 'Assigned Complaints'],
  ['/staff/complaints/:id', 'Complaint Details'],
  ['/admin/dashboard', 'Admin Dashboard'],
  ['/admin/complaints', 'All Complaints'],
  ['/admin/complaints/:id', 'Complaint Details'],
  ['/admin/users', 'Users'],
  ['/admin/departments', 'Departments'],
  ['/admin/reports', 'Reports'],
]

function RouteTitle() {
  const { pathname } = useLocation()

  useEffect(() => {
    const match = titles.find(([path]) => matchPath({ path, end: true }, pathname))
    document.title = match ? `${match[1]} | ${siteName}` : `Page not found | ${siteName}`
  }, [pathname])

  return null
}

export default RouteTitle