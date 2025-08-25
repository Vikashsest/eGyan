import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import Students from "../../Components/Students";

export default function ManageStudentsPage() {
  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <AdminSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <AdminNavbar />
        <Students />
      </main>
    </div>
  );
}
