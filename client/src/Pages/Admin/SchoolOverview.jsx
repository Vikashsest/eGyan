import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  FaChalkboard,
  FaUsers,
  FaUserTie,
  FaBook,
  FaSyncAlt,
  FaIdCard,
  FaTabletAlt,
} from "react-icons/fa";
import { getCookie } from "../../utils/cookie";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

export default function AdminSchoolOverview() {
  const [data, setData] = useState({});
  const [lastSync, setLastSync] = useState("Loading...");

  useEffect(() => {
  const fetchSchoolOverview = async () => {
    try {
      const res = await fetch(`${API_URL}/admin/school-overview`, {
        credentials:'include',
        method: "GET",
        headers: {
      Authorization: `Bearer ${access_token}`
    },
      });

      const result = await res.json();
      if (result && result.totalBooks !== undefined) {
  setData(result);
} else {
  toast.error("Failed to load school data.");
}
    } catch (error) {
      
      toast.error("Error fetching school overview.");
    }
  };

  fetchSchoolOverview();
},[])

  const handleSync = async () => {
    setLastSync("🔄 Syncing data...");
    setTimeout(() => {
      setLastSync("Just now");
      toast.success("✅ Synced successfully");
    }, 1000);
  };

  const summaryCards = [
    {
      title: "Total Teachers",
      icon: <FaUserTie />,
      count: data.totalTeachers ?? 0,
      color: "bg-orange-500",
    },
    {
      title: "Total Students",
      icon: <FaUsers />,
      count: data.totalStudents ?? 0,
      color: "bg-blue-500",
    },
    {
      title: "Total Classes",
      icon: <FaChalkboard />,
      count: data.totalClasses ?? 0,
      color: "bg-green-500",
    },
    {
      title: "Total Books",
      icon: <FaBook />,
      count: data.totalBooks ?? 0,
      color: "bg-yellow-500",
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <AdminSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <AdminNavbar />

        <div className="p-4">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">School Overview</h1>
            <p className="text-white/70 text-sm mt-1">
              Track your school’s usage and digital library sync.
            </p>
          </div>

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {summaryCards.map((item, index) => (
              <div
                key={index}
                className={`p-5 rounded-xl shadow-lg flex items-center gap-4 cursor-pointer ${item.color}`}
              >
                <div className="text-3xl">{item.icon}</div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-white/90">{item.count}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            <div className="bg-[#2a2b39] p-6 rounded-xl shadow-lg col-span-2">
              <h2 className="text-xl font-semibold mb-4">Sync Status</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-600 rounded-lg p-4">
                  <p className="text-white/70 text-sm">Last Sync</p>
                  <p className="text-green-400 font-semibold">{lastSync}</p>
                </div>
                <div className="border border-gray-600 rounded-lg p-4">
                  <p className="text-white/70 text-sm">Pending Uploads</p>
                  <p className="text-yellow-400 font-semibold">
                    {data.pendingUploads ?? 0} files
                  </p>
                </div>
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={handleSync}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-sm transition"
                >
                  <FaSyncAlt /> Sync Now
                </button>
              </div>
            </div>

            <div className="bg-[#2a2b39] p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold mb-4">School Info</h2>
              <div className="space-y-3 text-white/80 text-sm">
                <div className="flex items-center gap-2">
                  <FaIdCard className="text-lg" />
                  <span>School Code:</span>
                  <span className="text-white font-semibold ml-auto">
                    {data.schoolCode || "SCH-1023"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaTabletAlt className="text-lg" />
                  <span>Connected Devices:</span>
                  <span className="text-white font-semibold ml-auto">
                    {data.connectedDevices ?? 0}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
