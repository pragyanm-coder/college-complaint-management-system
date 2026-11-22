import { BrowserRouter, Routes, Route } from 'react-router-dom'
import AuthProvider from './context/AuthProvider'
import DirectoryProvider from './context/DirectoryProvider'
import ComplaintsProvider from './context/ComplaintsProvider'
import PublicLayout from './components/layout/PublicLayout'
import DashboardLayout from './components/layout/DashboardLayout'
import ProtectedRoute from './components/common/ProtectedRoute'
import RouteTitle from './components/common/RouteTitle'
import Home from './pages/public/Home'
import Login from './pages/public/Login'
import Register from './pages/public/Register'
import NotFound from './pages/public/NotFound'
import StudentDashboard from './pages/student/StudentDashboard'
import RegisterComplaint from './pages/student/RegisterComplaint'
import MyComplaints from './pages/student/MyComplaints'
import ComplaintDetails from './pages/student/ComplaintDetails'
import StaffDashboard from './pages/staff/StaffDashboard'
import StaffComplaints from './pages/staff/StaffComplaints'
import StaffComplaintDetails from './pages/staff/StaffComplaintDetails'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminComplaints from './pages/admin/AdminComplaints'
import AdminComplaintDetails from './pages/admin/AdminComplaintDetails'
import AdminUsers from './pages/admin/AdminUsers'
import AdminDepartments from './pages/admin/AdminDepartments'
import AdminReports from './pages/admin/AdminReports'

function App() {
  return (
    <AuthProvider>
      <DirectoryProvider>
        <ComplaintsProvider>
          <BrowserRouter>
            <RouteTitle />
            <Routes>
              <Route element={<PublicLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Route>

              <Route element={<ProtectedRoute role="student" />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/student/dashboard" element={<StudentDashboard />} />
                  <Route path="/student/complaints/new" element={<RegisterComplaint />} />
                  <Route path="/student/complaints" element={<MyComplaints />} />
                  <Route path="/student/complaints/:id" element={<ComplaintDetails />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute role="staff" />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/staff/dashboard" element={<StaffDashboard />} />
                  <Route path="/staff/complaints" element={<StaffComplaints />} />
                  <Route path="/staff/complaints/:id" element={<StaffComplaintDetails />} />
                </Route>
              </Route>

              <Route element={<ProtectedRoute role="admin" />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/complaints" element={<AdminComplaints />} />
                  <Route path="/admin/complaints/:id" element={<AdminComplaintDetails />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/admin/departments" element={<AdminDepartments />} />
                  <Route path="/admin/reports" element={<AdminReports />} />
                </Route>
              </Route>
            </Routes>
          </BrowserRouter>
        </ComplaintsProvider>
      </DirectoryProvider>
    </AuthProvider>
  )
}

export default App