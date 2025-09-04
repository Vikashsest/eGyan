import { FiSearch, FiBell } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function TeacherNavbar({
  searchTerm = "",
  onSearchChange,
  onAdd,
  buttonLabel = "",
  searchPlaceholder,
}) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Search Bar */}
      <div className="flex items-center gap-4 w-full max-w-md">
        {onSearchChange && (
          <div className="flex items-center bg-[#15161e] px-4 py-2 rounded w-full">
            <FiSearch className="text-gray-400 mr-2" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="bg-transparent outline-none w-full placeholder-gray-400"
            />
          </div>
        )}
      </div>

      {/* Icons & Avatar */}
      <div className="flex items-center space-x-6 relative ml-4">
        {/* Upload/Add Button */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-semibold transition"
          >
            {buttonLabel}
          </button>
        )}

        {/* Notification Icon (no API data) */}
        <div className="relative">
          <FiBell
            className="text-xl text-gray-300 cursor-pointer"
            onClick={() => navigate("/concerns-list")}
          />
        </div>

        {/* Avatar Dropdown */}
        <div className="flex flex-col items-center">
          <Link
            to="/teacher/profile"
            className="flex flex-col items-center group relative"
          >
            <img
              src="/user.png"
              alt="User"
              width={32}
              height={32}
              className="rounded-full cursor-pointer"
            />
            <span className="absolute top-full mt-1 text-white font-bold text-md opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Teacher
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default TeacherNavbar;
