import UploadedBooksPage from "../../Components/UploadedBooks";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

export default function AdminUploadedBooks() {
  return (
    <UploadedBooksPage
      role="admin"
      Sidebar={AdminSidebar}
      Navbar={AdminNavbar}
    />
  );
}
