import Books from "../../Components/Books";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export default function AdminBooks() {
  return (
    <Books
      role="admin"
      Navbar={AdminNavbar}
      Sidebar={AdminSidebar}
    />
  );
}
