// DEMO ONLY: sample accounts so the frontend can be tested without a backend.
// Real login (with secure passwords) will be done by the backend later.
export const demoUsers = [
  { name: 'Demo Student', email: 'student@college.test', password: 'Demo@123', role: 'student' },
  { name: 'Demo Staff', email: 'staff@college.test', password: 'Demo@123', role: 'staff' },
  { name: 'Demo Admin', email: 'admin@college.test', password: 'Demo@123', role: 'admin' },
]

// Where each role goes after logging in.
export const roleHome = {
  student: '/student/dashboard',
  staff: '/staff/dashboard',
  admin: '/admin/dashboard',
}