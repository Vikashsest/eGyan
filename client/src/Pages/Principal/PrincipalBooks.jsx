import Books from "../../Components/Books";
import PrincipalNavbar from "./PrincipalNavbar";
import PrincipalSidebar from "./PrincipalSidebar";

export default function PrincipalBooks() {
  return (
    <Books
      role="principal"
      Navbar={PrincipalNavbar}
      Sidebar={PrincipalSidebar}
    />
  );
}
