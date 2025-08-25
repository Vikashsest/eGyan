import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import { useState } from "react";
import { FaFileExport, FaPrint, FaChartBar } from "react-icons/fa";

export default function SingleSchoolReportsPage() {
  const [filters, setFilters] = useState({
    class: "",
    type: "",
    date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex min-h-screen bg-[#16171f] text-white">
      <AdminSidebar />

      <main className="flex-1 pl-[280px] pr-5 py-6">
        <AdminNavbar />

        <section className="px-4">
          {/* Page Header */}
          <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-1">📚 School Reports Dashboard</h1>
              <p className="text-white/70 text-sm">
                View reading performance and sync status of your school.
              </p>
            </div>
          </header>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            <select
              name="class"
              value={filters.class}
              onChange={handleChange}
              className="bg-[#1f202a] border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">All Classes</option>
              <option value="10">Class 10</option>
              <option value="9">Class 9</option>
              <option value="8">Class 8</option>
            </select>

            <select
              name="type"
              value={filters.type}
              onChange={handleChange}
              className="bg-[#1f202a] border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            >
              <option value="">All Report Types</option>
              <option value="reading">Reading Progress</option>
              <option value="sync">Sync Status</option>
              <option value="usage">Book Usage</option>
            </select>

            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleChange}
              className="bg-[#1f202a] border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-wrap justify-end gap-3 mb-6">
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm flex items-center gap-2">
              <FaFileExport /> Export CSV
            </button>
            <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm flex items-center gap-2">
              <FaFileExport /> Export PDF
            </button>
            <button className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-sm text-black flex items-center gap-2">
              <FaPrint /> Print
            </button>
          </div>

          {/* Chart */}
          <div className="bg-[#2a2b39] rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Books Completed by Class</h2>
            <div className="h-[250px] bg-[#1f202a] rounded flex items-center justify-center text-white/50">
              <FaChartBar className="text-4xl mr-2" /> Chart Coming Soon
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto bg-[#2a2b39] rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Class-wise Report</h2>
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-[#1f202a] text-white/70 border-b border-gray-700">
                  <th className="py-2 px-4 text-left">Class</th>
                  <th className="py-2 px-4 text-left">Students</th>
                  <th className="py-2 px-4 text-left">Books Completed</th>
                  <th className="py-2 px-4 text-left">Last Sync</th>
                  <th className="py-2 px-4 text-left">Sync Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-gray-700">
                  <td className="py-2 px-4">10</td>
                  <td className="py-2 px-4">120</td>
                  <td className="py-2 px-4">78</td>
                  <td className="py-2 px-4">5 mins ago</td>
                  <td className="py-2 px-4">
                    <span className="bg-green-500 text-black px-2 py-1 rounded text-xs">Synced</span>
                  </td>
                </tr>
                <tr className="border-t border-gray-700">
                  <td className="py-2 px-4">8</td>
                  <td className="py-2 px-4">98</td>
                  <td className="py-2 px-4">54</td>
                  <td className="py-2 px-4">2 hours ago</td>
                  <td className="py-2 px-4">
                    <span className="bg-yellow-400 text-black px-2 py-1 rounded text-xs">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
