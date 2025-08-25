import UploadedBooksPage from "../../Components/UploadedBooks";
import PrincipalSidebar from "./PrincipalSidebar";
import PrincipalNavbar from "./PrincipalNavbar";

export default function PrincipalUploadedBooks() {
  return (
    <UploadedBooksPage
      role="principal"
      Sidebar={PrincipalSidebar}
      Navbar={PrincipalNavbar}
    />
  );
}
