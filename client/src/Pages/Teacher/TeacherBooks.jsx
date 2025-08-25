import Books from "../../Components/Books";
import TeacherNavbar from "./TeacherNavbar";
import TeacherSidebar from "./TeacherSidebar";

export default function TeacherBooks() {
  return (
    <Books
      role="teacher"
      Navbar={TeacherNavbar}
      Sidebar={TeacherSidebar}
    />
  );
}
