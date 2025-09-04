
import { useEffect, useState } from "react";
import {
  FaClock,
  FaBookOpen,
  FaCheckCircle,
  FaHeart,
  FaBullhorn,
} from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import { toast } from "react-toastify";
import { getCookie } from "../../utils/cookie";
import StudentNavbar from "./StudentNavbar";
import StudentSidebar from "./StudentSidebar";
import WelcomeHeading from "../../Components/WelcomeHeading";

const API_URL = import.meta.env.VITE_API_URL;
const access_token = getCookie("access_token");

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}

export default function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    timeSpent: "0h 0m",
    booksCompleted: 0,
    recentActivity: 0,
    favorites: 0,
  });

  const [announcements, setAnnouncements] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const res = await fetch(`${API_URL}/students/metrices`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch metrics");

        const data = await res.json();

        setMetrics({
          timeSpent: formatTime(data.totalTimeSpent || 0),
          booksCompleted: data.booksCompleted || 0,
          recentActivity: data.recentActivityCount || 0,
          favorites: data.favoriteBooksCount || 0,
        });
      } catch (error) {
        toast.error("❌ Failed to load metrics");
        console.error(error);
      }
    }

    async function fetchAnnouncements() {
      try {
        const res = await fetch(`${API_URL}/students/announcements`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch announcements");

        const data = await res.json();
        setAnnouncements(data);
      } catch (error) {
        toast.error("❌ Failed to load announcements");
        console.error(error);
      }
    }

    fetchMetrics();
    fetchAnnouncements();
  }, []);

  const icons = {
    timeSpent: <FaClock className="text-orange-500 text-3xl" />,
    booksCompleted: <FaCheckCircle className="text-blue-500 text-3xl" />,
    recentActivity: <FaBookOpen className="text-green-500 text-3xl" />,
    favorites: <FaHeart className="text-yellow-500 text-3xl" />,
  };

  const items = [
    { title: "Total Time Spent", icon: icons.timeSpent, count: metrics.timeSpent },
    { title: "Books Completed", icon: icons.booksCompleted, count: metrics.booksCompleted },
    { title: "Recent Activity", icon: icons.recentActivity, count: metrics.recentActivity },
    { title: "Favorites", icon: icons.favorites, count: metrics.favorites },
  ];

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      {/* Sidebar */}
      <StudentSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 pr-5 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden px-4 mb-4">
          <button onClick={() => setIsSidebarOpen(true)} className="text-white">
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <div className="p-4">
          <WelcomeHeading />
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
          {items.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-xl shadow-md flex items-center gap-4 border bg-[#3b3c4e] text-white"
            >
              <div>{item.icon}</div>
              <div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm opacity-80">{item.count}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Announcements */}
        <div className="mt-10 px-4">
          <h2 className="text-xl font-semibold mb-4">📌 Announcements</h2>
          <div className="space-y-4">
            {announcements.length > 0 ? (
              announcements.map((announcement, i) => (
                <div
                  key={i}
                  className="bg-[#2c2d3c] p-3 rounded flex items-start gap-3"
                >
                  <FaBullhorn className="text-yellow-400 mt-1" />
                  <p className="text-sm text-gray-300">{announcement.message}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-400 text-sm">No announcements available.</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
