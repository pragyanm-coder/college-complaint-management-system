export const navByRole = {
  student: [
    { to: '/student/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/student/complaints/new', label: 'Register a Complaint', icon: 'filePlus' },
    { to: '/student/complaints', label: 'My Complaints', icon: 'list' },
  ],
  staff: [
    { to: '/staff/dashboard', label: 'Dashboard', icon: 'dashboard' },
    // exact: false keeps this link highlighted on the complaint details page too.
    { to: '/staff/complaints', label: 'Assigned Complaints', icon: 'list', exact: false },
  ],
  admin: [
    { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
    { to: '/admin/complaints', label: 'All Complaints', icon: 'list', exact: false },
    { to: '/admin/users', label: 'Users', icon: 'users' },
    { to: '/admin/departments', label: 'Departments', icon: 'briefcase' },
    { to: '/admin/reports', label: 'Reports', icon: 'chart' },
  ],
}

export const roleLabels = {
  student: 'Student',
  staff: 'Staff',
  admin: 'Admin',
}