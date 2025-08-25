import TeacherSidebar from "./TeacherSidebar";
import TeacherNavbar from "./TeacherNavbar";
import RoleManagement from "../../Components/RoleManagement";

export default function TeacherRolePage() {
  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <TeacherSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <TeacherNavbar />
        <RoleManagement currentUserRole="teacher" />
      </main>
    </div>
  );
}
