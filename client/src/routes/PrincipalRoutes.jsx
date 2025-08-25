import ProtectedRoute from "../ProtectedRoute";

import PrincipalDashboard from "../Pages/Principal/PrincipalDashboard";
import PrincipalBooks from "../Pages/Principal/PrincipalBooks";
import PrincipalTeachers from "../Pages/Principal/PrincipalTeachers";
import PrincipalStudents from "../Pages/Principal/PrincipalStudents";
import PrincipalProfile from "../Pages/Principal/PrincipalProfile";
import PrincipalRole from "../Pages/Principal/PrincipalRole";
import PrincipalUploadBooks from "../Pages/Principal/PrincipalUploadBooks"

export const principalRouteList = [
  {
    path: "/principal/dashboard",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalDashboard /></ProtectedRoute>,
  },
  {
    path: "/principal/books",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalBooks /></ProtectedRoute>,
  },
  {
    path: "/principal/teachers",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalTeachers /></ProtectedRoute>,
  },
  {
    path: "/principal/students",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalStudents /></ProtectedRoute>,
  },
  {
    path: "/principal/profile",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalProfile /></ProtectedRoute>,
  },
  {
    path: "/principal/role",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalRole /></ProtectedRoute>,
  },
  {
    path: "/principal/upload-books",
    element: <ProtectedRoute allowedRoles={["principal"]}><PrincipalUploadBooks /></ProtectedRoute>,
  },
];
