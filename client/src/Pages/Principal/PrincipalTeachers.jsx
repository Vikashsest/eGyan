import PrincipalSidebar from "./PrincipalSidebar";
import PrincipalNavbar from "./PrincipalNavbar";
import Teachers from "../../Components/Teachers";

export default function PrincipalTeachersPage() {
  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <PrincipalSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <PrincipalNavbar />
        <Teachers />
      </main>
    </div>
  );
}
