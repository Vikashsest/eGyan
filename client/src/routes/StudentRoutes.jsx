
import ProtectedRoute from "../ProtectedRoute";
import StudentDashboard from "../Pages/Student/StudentDashboard";
import StudentProfile from "../Pages/Student/StudentProfile";
import Progress from "../Pages/Student/Progress";
import RecentReadBooks from "../Pages/Student/RecentReadBooks";
import Favorites from "../Pages/Student/Favorites";
import RaiseConcern from "../Pages/Student/RaiseConcern";
import StudentBooks from "../Pages/Student/StudentBooks"
import Subjects from "../Pages/Student/Subjects"
import BooksList from "../Pages/Student/BooksList"
import ClassList from "../Pages/Student/ClassList";
import ChaptersList from "../Pages/Student/ChaptersList";

export const studentRouteList = [
  {
    path: "/student/dashboard",
    element: <StudentDashboard />
  },
  {
    path: "/student/profile",
    element: <StudentProfile />,
  },
  {
    path: "/student/myprogress",
    element: <ProtectedRoute allowedRoles={["student"]}><Progress /></ProtectedRoute>,
  },
  {
    path: "/student/recent-read-books",
    element: <ProtectedRoute allowedRoles={["student"]}><RecentReadBooks /></ProtectedRoute>,
  },
  {
    path: "/student/favorites",
    element: <ProtectedRoute allowedRoles={["student"]}><Favorites /></ProtectedRoute>,
  },
  {
    path: "/student/raise-concern",
    element: <ProtectedRoute allowedRoles={["student"]}><RaiseConcern /></ProtectedRoute>,
  },
  {
    path: "/students/books",
    element: <ProtectedRoute allowedRoles={["student"]}><StudentBooks /></ProtectedRoute>,
  },
  {
    path: "/classes",
    element: <ProtectedRoute allowedRoles={["student"]}><ClassList /></ProtectedRoute>,
  },
{
  path: "/subjects",
  element: (
    <ProtectedRoute allowedRoles={["student"]}>
      <Subjects />
    </ProtectedRoute>
  ),
},
// {
//   path: "/books/:className/:subject",
//   element: (
//     <ProtectedRoute allowedRoles={["student"]}>
//       <BooksList />
//     </ProtectedRoute>
//   ),
// },
{
  path: "/student/books/:bookId/chapters",
  element: (
    <ProtectedRoute allowedRoles={["student"]}>
      <ChaptersList />
    </ProtectedRoute>
  ),
},
{
  path: "/subjects/:className",
  element: (
    <ProtectedRoute allowedRoles={["student"]}>
      <Subjects />
    </ProtectedRoute>
  ),
},
{
  path: "/books/:className/:subject",
  element: (
    <ProtectedRoute allowedRoles={["student"]}>
      <BooksList />
    </ProtectedRoute>
  ),
},
{
  path: "/books",
  element: (
    <ProtectedRoute allowedRoles={["student"]}>
      <BooksList />
    </ProtectedRoute>
  ),
},
 {
    path: "/student/books/:bookId/chapters",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <ChaptersList />
      </ProtectedRoute>
    ),
  },
];
