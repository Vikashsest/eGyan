import React, { useEffect, useState } from "react";
import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { FiMenu } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentProgress() {
  const [progress, setProgress] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${API_URL}/students/progress`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch progress");
        const data = await res.json();
        console.log("Progress API response:", data);
        setProgress(data);
      } catch (error) {
        console.error("Error fetching progress:", error);
        setProgress({ error: true });
      }
    };

    fetchProgress();
  }, []);

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white relative">
      {/* Sidebar */}
      <StudentSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Overlay for mobile when sidebar open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 lg:pl-[280px] py-6 px-4 sm:px-6 w-full">
        {/* Mobile Menu Icon */}
        <div className="lg:hidden mb-4 flex items-center">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-white focus:outline-none"
          >
            <FiMenu size={28} />
          </button>
        </div>

        <StudentNavbar />

        <div className="p-4 space-y-6">
          {/* Header */}
          <div className="mb-2">
            <h1 className="text-3xl font-bold">📈 My Progress</h1>
            <p className="text-white/70 text-sm">
              Track your study activity and performance over time.
            </p>
          </div>
          {progress === null ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-white text-lg animate-pulse">Loading progress...</p>
            </div>
          ) : progress.error ? (
            <div className="flex justify-center items-center h-48">
              <p className="text-red-500 text-lg">Failed to load progress data.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="bg-[#2a2b39] p-5 rounded-xl shadow flex items-center gap-4">
                  <div className="text-yellow-400 text-3xl">📚</div>
                  <div>
                    <p className="text-sm text-white/60">Books In Progress</p>
                    <h3 className="text-xl font-semibold">{progress.booksInProgress}</h3>
                  </div>
                </div>

                <div className="bg-[#2a2b39] p-5 rounded-xl shadow flex items-center gap-4">
                  <div className="text-blue-400 text-3xl">⏱️</div>
                  <div>
                    <p className="text-sm text-white/60">Avg. Session Time</p>
                    <h3 className="text-xl font-semibold">{progress.avgSessionTime} </h3>
                  </div>
                </div>

                <div className="bg-[#2a2b39] p-5 rounded-xl shadow flex items-center gap-4">
                  <div className="text-green-400 text-3xl">🕒</div>
                  <div>
                    <p className="text-sm text-white/60">Last Activity</p>
                    <h3 className="text-xl font-semibold">
                      {progress.lastActivity
                        ? new Date(progress.lastActivity).toLocaleString()
                        : "N/A"}
                    </h3>
                  </div>
                </div>
              </div>
              {progress.subjectWiseProgress &&
                Object.keys(progress.subjectWiseProgress).length > 0 && (
                  <div className="bg-[#2a2b39] p-5 rounded-xl shadow">
                    <h2 className="text-xl font-semibold mb-4">📚 Subject-wise Progress</h2>
                    <div className="space-y-4">
                      {Object.entries(progress.subjectWiseProgress).map(
                        ([subject, stats]) => {
                          
                             const percentage = stats.percentage ?? 0;
                       
                          return (
                            <div key={subject}>
                              <div className="flex justify-between mb-1">
                                <span className="text-sm">{subject}</span>
                                <span className="text-sm">{percentage}%</span>
                              </div>
                              <div className="w-full bg-gray-600 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                )}
              <div className="bg-[#2a2b39] p-5 rounded-xl shadow">
                <h2 className="text-xl font-semibold mb-4">🕒 Recently Accessed</h2>
                <ul className="text-white/80 text-sm space-y-2">
                  {progress.recentActivity && progress.recentActivity.length > 0 ? (
                    progress.recentActivity.map((item, index) => (
                      <li key={index}>
                        <span className="font-medium text-white">{item.type}:</span>{" "}
                        {item.title}{" "}
                        <span className="text-white/50">
                          ({new Date(item.time).toLocaleString()})
                        </span>
                      </li>
                    ))
                  ) : (
                    <li>No recent activity found.</li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}


