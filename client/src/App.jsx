import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Auth/Login";
import ForgotPassword from "./Pages/Auth/ForgotPassword";

import ProfilePage from "./Components/ProfilePage";
import ViewConcerns from "./Components/ViewConcerns";
import NotFound from "./Components/NotFound";
import { adminRouteList } from "./routes/AdminRoutes";
import  {principalRouteList } from "./routes/PrincipalRoutes";
import  {teacherRouteList } from "./routes/TeacherRoutes";
import {studentRouteList}  from "./routes/StudentRoutes";
import UploadChapter from "./Components/UploadChapter";

function Page() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/concerns-list" element={<ViewConcerns />} />
      <Route path="/profilepage" element={<ProfilePage />} />
      <Route path="/booksdetails/:id" element={<UploadChapter />} />

      {/* Admin Routes */}
      {adminRouteList.map(({ path, element }, i) => (
        <Route key={i} path={path} element={element} />
      ))}

      {/* Principal Routes */}
      {principalRouteList.map(({ path, element }, i) => (
        <Route key={i} path={path} element={element} />
      ))}

      {/* Teacher Routes */}
      {teacherRouteList.map(({ path, element }, i) => (
        <Route key={i} path={path} element={element} />
      ))}

      {/* Student Routes */}
      {studentRouteList.map(({ path, element }, i) => (
        <Route key={i} path={path} element={element} />
      ))}
       <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default Page;
