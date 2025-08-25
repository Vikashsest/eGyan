import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { FaBook, FaUserTie, FaUsers } from "react-icons/fa";
import PrincipalSidebar from "./PrincipalSidebar";
import PrincipalNavbar from "./PrincipalNavbar";
import { getCookie } from "../../utils/cookie";
import WelcomeHeading from "../../Components/WelcomeHeading";

export default function PrincipalDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalBooks: 0,
  });

  const [booksPerSubject, setBooksPerSubject] = useState([]);
  const [subjectUploads, setSubjectUploads] = useState({});
  const [selectedSubject, setSelectedSubject] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;
  const access_token = getCookie("access_token");

useEffect(() => {
  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/books/dashboard-stats`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      const data = await res.json();

      setStats({
        totalStudents: data.totalStudents || 0,
        totalTeachers: data.totalTeachers || 0,
        totalBooks: data.totalBooks || 0,
      });

  
      setBooksPerSubject(data.booksPerSubject || []);

      setSubjectUploads(data.subjectWiseUploads || {});
      const subjects = Object.keys(data.subjectWiseUploads || {});
      if (subjects.length > 0) {
        setSelectedSubject(subjects[0]);
      }

    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  };

  fetchStats();
}, []);


  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <PrincipalSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <PrincipalNavbar />

        <div className="p-4">
       <WelcomeHeading/>
       </div>

        <div className="p-6 space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SummaryCard
              title="Total Students"
              value={stats.totalStudents}
              color="bg-orange-500"
              icon={<FaUsers />}
            />
            <SummaryCard
              title="Total Teachers"
              value={stats.totalTeachers}
              color="bg-indigo-500"
              icon={<FaUserTie />}
            />
            <SummaryCard
              title="Total Books"
              value={stats.totalBooks}
              color="bg-sky-500"
              icon={<FaBook />}
            />
          </div>

          {/* Monthly Uploads per Subject */}
          <div className="bg-[#2a2b38] rounded-2xl shadow-md p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-white">Monthly Uploads per Subject</h2>
              <select
                className="bg-[#1e1f2b] text-white border border-gray-600 rounded px-3 py-1"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
              >
                {Object.keys(subjectUploads).map((subject) => (
                  <option key={subject} value={subject}>
                    {subject}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={subjectUploads[selectedSubject]}>
                  <XAxis dataKey="month" stroke="#ccc" />
                  <YAxis stroke="#ccc" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="uploads"
                    stroke="#fbbf24"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        {/* Books Per Subject - Table View */}
<div className="bg-[#2a2b38] rounded-2xl shadow-md p-5">
  <h2 className="font-bold mb-4 text-white">Books Per Subject</h2>
  <div className="overflow-y-auto max-h-[300px]">
    <table className="w-full text-left">
      <thead>
        <tr className="text-gray-300">
          <th className="py-2 px-3">Subject</th>
          <th className="py-2 px-3">Books</th>
        </tr>
      </thead>
      <tbody>
        {booksPerSubject.map((item) => (
          <tr key={item.subject} className="border-b border-gray-700">
            <td className="py-2 px-3 text-white">{item.subject}</td>
            <td className="py-2 px-3 w-full">
              <div className="relative w-full bg-gray-700 h-4 rounded">
                <div
                  className="bg-blue-400 h-4 rounded"
                  style={{
                    width: `${Math.min(Number(item.count) / stats.totalBooks * 100, 100)}%`,
                  }}
                  title={`${item.count} books`}
                />
              </div>
              <span className="text-sm text-gray-300 ml-2">{item.count}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

        </div>
      </main>
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  return (
    <div className={`rounded-xl shadow-md p-6 flex items-center gap-4 ${color}`}>
      <div className="text-3xl text-white">{icon}</div>
      <div>
        <p className="text-sm text-white/80">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </div>
  );
}
