import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaUserTie,
  FaFileAlt,
  FaTachometerAlt,
  FaSchool,
  FaBookOpen,
} from "react-icons/fa";
import { MdManageAccounts } from "react-icons/md";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-[#15161e] p-6 flex flex-col justify-between z-50">
      <div>
        <h1 className="text-2xl font-bold flex items-center space-x-2 mb-8">
          <span className="bg-blue-600 w-2.5 h-2.5 rounded-sm"></span>
          <span className="text-gray-300">Dashboard</span>
        </h1>

        <nav className="space-y-6">
          <div>
            <ul className="space-y-5">
              <Link
                className="flex items-center space-x-2"
                to="/admin/dashboard"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/admin/school-overview"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaSchool />
                  <span>School Overview</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/admin/principals"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaUserTie />
                  <span>Manage Principals</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/admin/teachers"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaChalkboardTeacher />
                  <span>Manage Teachers</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/admin/students"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaUsers />
                  <span>Manage Students</span>
                </li>
              </Link>
              <Link className="flex items-center space-x-2" to="/admin-books">
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBook />
                  <span> Manage Books</span>
                </li>
              </Link>
              {/* <Link className="flex items-center space-x-2" to="/admin/reports">
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaFileAlt />
                  <span>Reports</span>
                </li>
              </Link> */}
              <Link
                className="flex items-center space-x-2"
                to="/admin/role"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <MdManageAccounts />
                  <span>Role Management</span>
                </li>
              </Link>

              <Link
                className="flex items-center space-x-2"
                to="/admin/upload-books"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBookOpen />
                  <span>My Books</span>
                </li>
              </Link>
              <Link>
              <Link
  className="flex items-center space-x-2"
  to="/admin/repository"
>
  <li className="flex items-center space-x-2 text-gray-300">
    <FaFileAlt />
    <span>Repository</span>
  </li>
</Link>

              </Link>
            </ul>
          </div>
        </nav>
      </div>

      <div>
        <Logout />
      </div>
    </aside>
  );
}
