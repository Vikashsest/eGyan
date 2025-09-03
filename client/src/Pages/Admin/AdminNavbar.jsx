import { FiSearch, FiBell } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar({
  searchTerm = "",
  onSearchChange,
  onAdd,
  onUpload,
  buttonLabel,
  uploadLabel = "Upload Credentials +",
  searchPlaceholder = "Search by name or email...",
  notificationsCount = 0, 
}) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center gap-4 mb-6">
      {/* Search Bar */}
      {onSearchChange ? (
        <div className="flex items-center bg-[#2a2b39] px-4 py-2 rounded w-[70%] lg:w-full lg:max-w-md">
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
      <div className="flex items-center space-x-6 relative">
        {/* Upload Button */}
        {onUpload && (
          <button
            onClick={onUpload}
            className="bg-blue-600 px-4 py-1 rounded text-sm font-semibold hover:bg-blue-700"
          >
            {uploadLabel}
          </button>
        )}

        {/* Add Button */}
        {onAdd && (
          <button
            onClick={onAdd}
            className="bg-blue-600 px-4 py-1 rounded text-sm font-semibold hover:bg-blue-700"
          >
            {buttonLabel}
          </button>
        )}

          <div className="relative">
          <FiBell
            className="text-xl text-gray-300 cursor-pointer"
            onClick={() => navigate("/concerns-list")}
          />
          {notificationsCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">
              {notificationsCount}
            </span>
          )}
        </div>

        {/* Avatar */}
        <div className="relative group">
          <Link to="/admin/profile" className="block px-2 py-1">
          <img
            src="/user.png"
            alt="User"
            width={32}
            height={32}
            className="rounded-full cursor-pointer"
          />
          <div className="absolute text-white font-[600] flex justify-center opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-opacity duration-300 z-10">
            <ul className="py-2">
              <li>
                  Admin
              </li>
            </ul>
          </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminNavbar;


