import ProtectedRoute from "../ProtectedRoute";

import AdminDashboard from "../Pages/Admin/AdminDashboard";
import Principals from "../Pages/Admin/Principals";
import AdminTeachers from "../Pages/Admin/AdminTeachers";
import AdminStudents from "../Pages/Admin/AdminStudents";
import AdminBooks from "../Pages/Admin/AdminBooks";
import AdminRole from "../Pages/Admin/AdminRole";
import AdminProfile from "../Pages/Admin/AdminProfile";
import SchoolOverview from "../Pages/Admin/SchoolOverview";
import AdminReports from "../Pages/Admin/AdminReports";
import AdminUploadBooks from "../Pages/Admin/AdminUploadBooks"

export const adminRouteList = [
  {
    path: "/admin/dashboard",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminDashboard /></ProtectedRoute>
  },
  {
    path: "/admin/principals",
    element: <ProtectedRoute allowedRoles={["admin"]}><Principals /></ProtectedRoute>
  },
  {
    path: "/admin/teachers",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminTeachers /></ProtectedRoute>
  },
  {
    path: "/admin/students",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminStudents /></ProtectedRoute>
  },
  {
    path: "/admin-books",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminBooks /></ProtectedRoute>
  },
  {
    path: "/admin/role",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminRole /></ProtectedRoute>
  },
  {
    path: "/admin/profile",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminProfile /></ProtectedRoute>
  },
  {
    path: "/admin/school-overview",
    element: <ProtectedRoute allowedRoles={["admin"]}><SchoolOverview /></ProtectedRoute>
  },
  {
    path: "/admin/reports",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminReports /></ProtectedRoute>
  },
  {
    path: "/admin/upload-books",
    element: <ProtectedRoute allowedRoles={["admin"]}><AdminUploadBooks /></ProtectedRoute>
  },
];
