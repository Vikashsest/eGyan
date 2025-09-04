import {
  FaFileAlt,
  FaTachometerAlt,
  FaBookOpen,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { Link } from "react-router-dom";
import Logout from "../Auth/Logout";

export default function StudentSidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`fixed top-0 left-0 h-screen w-64 bg-[#15161e] p-6 flex flex-col justify-between z-50 transform transition-transform duration-300
      ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
    >
      {/* Close button (only mobile/ipad) */}
      <button
        className="absolute top-4 right-4 text-white lg:hidden"
        onClick={onClose}
      >
        <FiX size={26} />
      </button>

      <div className="flex-1 overflow-y-auto">
        <h1 className="text-2xl font-bold flex items-center space-x-2 mb-8">
          <span className="bg-blue-600 w-2.5 h-2.5 rounded-sm"></span>
          <span className="text-gray-300">Dashboard</span>
        </h1>

        {/* Navigation */}
        <nav>
          <ul className="space-y-4">
            <li>
              <Link
                to="/student/dashboard"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
              >
                <FaTachometerAlt />
                <span>Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to="/students/books"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
              >
                <FaBookOpen />
                <span>Study Material</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/myprogress"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
              >
                <FaChartLine />
                <span>My Progress</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/recent-read-books"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
              >
                <FaBookOpen />
                <span>Recent Activity</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/favorites"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
              >
                <FaFileAlt />
                <span>Favorites</span>
              </Link>
            </li>

            <li>
              <Link
                to="/student/raise-concern"
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition"
              >
                <FaExclamationTriangle />
                <span>Raise Concern</span>
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Bottom Logout */}
      <div className="pt-6 border-t border-gray-700">
        <Logout />
      </div>
    </aside>
  );
}
