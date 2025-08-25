import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import RoleManagement from "../../Components/RoleManagement";

export default function AdminRolePage() {
  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <AdminSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <AdminNavbar />
        <RoleManagement currentUserRole="admin" />
      </main>
    </div>
  );
}
