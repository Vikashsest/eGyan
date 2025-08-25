import {
  FaUsers,
  FaBook,
  FaChalkboardTeacher,
  FaTachometerAlt,
  FaBookOpen
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
                to="/principal/dashboard"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/principal/teachers"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaChalkboardTeacher />
                  <span>Manage Teachers</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/principal/students"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaUsers />
                  <span>Manage Students</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/principal/books"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBook />
                  <span>Manage Books</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/principal/role"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <MdManageAccounts />
                  <span>Role Management</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/principal/upload-books"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBookOpen />
                  <span>My Books</span>
                </li>
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
