import UploadedBooksPage from "../../Components/UploadedBooks";
import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";

export default function TeacherUploadedBooks() {
  return (
    <UploadedBooksPage
      role="teacher"
      Sidebar={TeacherSidebar}
      Navbar={TeacherNavbar}
    />
  );
}
