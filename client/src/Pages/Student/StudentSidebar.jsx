import {
  FaFileAlt,
  FaTachometerAlt,
  FaBookOpen,
  FaChartLine,
  FaExclamationTriangle,
} from "react-icons/fa";
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
                to="/student/dashboard"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaTachometerAlt />
                  <span>Dashboard</span>
                </li>
              </Link>
                <Link
                className="flex items-center space-x-2"
                to="/students/books"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBookOpen />
                  <span>Study Material</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/student/myprogress"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaChartLine />
                  <span>My Progress</span>
                </li>
              </Link>
             
              <Link
                className="flex items-center space-x-2"
                to="/student/recent-read-books"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBookOpen />
                  <span>Recent Activity</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/student/favorites"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaFileAlt />
                  <span>Favorites</span>
                </li>
              </Link>
              <Link
                className="flex items-center space-x-2"
                to="/student/raise-concern"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaExclamationTriangle />
                  <span>Raise Concern</span>
                </li>
              </Link>
              {/* <Link
                className="flex items-center space-x-2"
                to="/students/books"
              >
                <li className="flex items-center space-x-2 text-gray-300">
                  <FaBookOpen />
                  <span>Study Material</span>
                </li>
              </Link> */}
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
