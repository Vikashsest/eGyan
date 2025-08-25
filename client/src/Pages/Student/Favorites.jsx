
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFilePdf,
  FaVideo,
  FaHeadphones,
  FaHeart,
  FaBookOpen,
} from "react-icons/fa";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

const iconMap = {
  PDF: <FaFilePdf className="text-red-400 text-xl" />,
  VIDEO: <FaVideo className="text-green-400 text-xl" />,
  AUDIO: <FaHeadphones className="text-yellow-400 text-xl" />,
};

const buttonTextMap = {
  PDF: "Continue Reading",
  VIDEO: "Continue Watching",
  AUDIO: "Continue Listening",
};

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentFavorites() {
  const [favoriteBooks, setFavoriteBooks] = useState([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetch(`${API_URL}/students/favorite-books`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorite books");
        return res.json();
      })
      .then((data) => setFavoriteBooks(data))
      .catch((err) => console.error("Error fetching favorites:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <StudentSidebar />

      <main className="pl-[280px] py-6 pr-5 w-full">
        <StudentNavbar />

        <div className="p-4">
          <h1 className="text-3xl font-bold mb-2">❤️ Favorite Books</h1>
          <p className="text-white/70 text-sm mb-6">
            All the learning materials you’ve marked as favorite.
          </p>

          {favoriteBooks.length === 0 ? (
            <p className="text-white/50">You have no favorite books yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {favoriteBooks.map((item) => {
                const resourceType = item.resourceType?.toUpperCase?.();
                const icon = iconMap[resourceType] || (
                  <FaBookOpen className="text-gray-400 text-xl" />
                );
                const buttonText = buttonTextMap[resourceType] || "Continue";
                return (
                  <div
                    key={item.id}
                    className="bg-[#2a2b39] p-5 rounded-xl shadow hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <FaHeart className="text-pink-500" />
                    </div>

                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-white/60">{item.subject}</span>
                      <span className="flex items-center gap-1">
                        {icon}
                        <span>{item.resourceType}</span>
                      </span>
                    </div>

                    <button
                        onClick={() => navigate(`/student/books/${item.id}/chapters`)}

                      className="mt-4 bg-blue-600 hover:bg-blue-700 transition px-4 py-2 rounded text-sm"
                    >
                      {buttonText}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}







