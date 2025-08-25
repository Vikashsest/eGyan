import ProtectedRoute from "../ProtectedRoute";
import TeacherDashboard from "../Pages/Teacher/TeacherDashboard";
import TeacherBooks from "../Pages/Teacher/TeacherBooks";
import TeacherStudents from "../Pages/Teacher/TeacherStudents";
import TeacherProfile from "../Pages/Teacher/TeacherProfile";
import TeacherRole from "../Pages/Teacher/TeacherRole";
import TeacherUploadedBooks from "../Pages/Teacher/TeacherUploadBooks";
import UploadChapter from "../Components/UploadChapter";

export const teacherRouteList = [
  {
    path: "/teacher/dashboard",
    element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherDashboard /></ProtectedRoute>,
  },
  {
    path: "/teacher/books",
    element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherBooks /></ProtectedRoute>,
  },
  {
    path: "/teacher/students",
    element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherStudents /></ProtectedRoute>,
  },
  {
    path: "/teacher/profile",
    element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherProfile /></ProtectedRoute>,
  },
  {
    path: "/teacher/role",
    element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherRole /></ProtectedRoute>,
  },
  {
    path: "/teacher/upload-books",
    element: <ProtectedRoute allowedRoles={["teacher"]}><TeacherUploadedBooks /></ProtectedRoute>,
  },
 {
  path: "/books/:bookId/chapters",
  element: (
    <ProtectedRoute allowedRoles={["teacher", "admin", "principal"]}>
      <UploadChapter />
    </ProtectedRoute>
  ),
}


];
