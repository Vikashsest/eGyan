
import { FiSearch, FiBell } from "react-icons/fi";
import {Link} from "react-router-dom";

function StudentNavbar({
  searchTerm = "",
  onSearchChange,
  onAdd,
  buttonLabel = "+ Add Principal",
  searchPlaceholder = "Search by name or email...",
}) {
  return (
    <div className="flex justify-between items-center mb-6">
      {/* Search Bar */}
      {onSearchChange ? (
        <div className="flex items-center bg-[#15161e] px-4 py-2 rounded w-full max-w-md">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="bg-transparent outline-none w-full placeholder-gray-400"
          />
        </div>
      ) : (
        <div />
      )}

      {/* Right Icons */}
      <div className="flex items-center space-x-6">
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 px-4 py-1 rounded text-sm font-semibold hover:bg-blue-700"
          >
            {buttonLabel}
          </button>
        )}

        <FiBell className="text-xl text-gray-300" />

        <div className="flex flex-col items-center">
          <Link
            to="/student/profile"
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
              Student
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default StudentNavbar;
