
import { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { FaBookReader, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentRecentBooks() {
  const [recentBooks, setRecentBooks] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_URL}/students/recent-books`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch recent books");
        return res.json();
      })
      .then((data) => setRecentBooks(data))
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <StudentSidebar />

      <main className="pl-[280px] py-6 pr-5 w-full">
        <StudentNavbar />

        <div className="p-4">
          <h1 className="text-3xl font-bold mb-4">📘 Recently Read Books</h1>
          <p className="text-white/70 mb-6 text-sm">
            View your recently accessed digital books with reading progress.
          </p>

          {recentBooks.length === 0 ? (
            <p className="text-white/50">No recent books found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentBooks.map((book) => (
  <div
    key={book.id}
    className="bg-[#2a2b39] p-5 rounded-xl shadow hover:shadow-xl transition"
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-xl font-semibold truncate">
        {book.bookName}
      </h2>
      <span className="text-xs text-white/60">
        {book.subject}
      </span>
    </div>

    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-white/70">Progress</span>
        <span className="text-white/50">{book.progress}%</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2">
        <div
          className="bg-green-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${book.progress}%` }}
        ></div>
      </div>
    </div>

    <p className="text-xs text-white/50 mb-4">
      Last Accessed: {new Date(book.lastAccessed).toLocaleString()}
    </p>

    <button
      onClick={() => navigate(`/student/books/${book.id}/chapters`)}
      className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition text-sm"
    >
      <FaBookReader />
      Continue Reading
      <FaArrowRight className="ml-1" />
    </button>
  </div>
))}

            </div>
          )}
        </div>
      </main>
    </div>
  );
}
