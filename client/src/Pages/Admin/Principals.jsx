import { useState, useEffect } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Sidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import {
  fetchPrincipals,
  createPrincipal,
  updatePrincipal,
  deletePrincipal,
} from "../../apiServices/principalsApi";
import { toast } from "react-toastify";

export default function ManagePrincipalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [principals, setPrincipals] = useState([]);

  useEffect(() => {
    loadPrincipals();
  }, []);

  const loadPrincipals = async () => {
    try {
      const data = await fetchPrincipals();
      setPrincipals(data);
    } catch (error) {
      toast.error("❌ Failed to fetch principals");
    }
  };

  const filteredPrincipals = Array.isArray(principals)
    ? principals.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const openForm = (data = null) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value,
      email: form.email.value,
      isActive: form.status.value === "Active",
    };

    try {
      if (editData?.id) {
        await updatePrincipal(editData.id, payload);
        toast.success("✏️ Updated successfully");
      } else {
        await createPrincipal(payload);
        toast.success("✅ Created successfully");
      }
      setShowForm(false);
      loadPrincipals();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this principal?")) return;

    try {
      await deletePrincipal(id);
      toast.success("🗑 Deleted successfully");
      loadPrincipals();
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to delete");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <Sidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <AdminNavbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />

        <h1 className="text-2xl font-bold mb-6">🏫 Manage Principals</h1>

        <div className="overflow-x-auto">
          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-200 text-gray-900 text-left">
                <th className="p-2 border">#</th>
                <th className="p-2 border">Name</th>
                <th className="p-2 border">Email</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPrincipals.map((p, index) => (
                <tr key={p.id}>
                  <td className="p-2 border">{index + 1}</td>
                  <td className="p-2 border">{p.name}</td>
                  <td className="p-2 border">{p.email}</td>
                  <td className="p-2 border">
                    <span
                      className={`px-2 py-1 rounded text-white ${
                        p.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      {p.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-2 border">
                    <div className="flex space-x-2 text-sm">
                      <button
                        onClick={() => openForm(p)}
                        className="text-blue-500 hover:underline flex items-center gap-1"
                      >
                        <FaEdit /> Edit
                      </button>

                      <button
                        className="text-red-500 flex items-center gap-1"
                        onClick={() => handleDelete(p.id)}
                        title="Delete"
                      >
                        <FaTrashAlt />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded w-full max-w-lg text-black">
              <h2 className="text-xl font-semibold mb-4">
                {editData ? "Edit Principal" : "Add Principal"}
              </h2>
              <form className="space-y-4" onSubmit={handleSave}>
                <input
                  name="name"
                  defaultValue={editData?.name || ""}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Full Name"
                />
                <input
                  name="email"
                  type="email"
                  defaultValue={editData?.email || ""}
                  required
                  className="w-full border p-2 rounded"
                  placeholder="Email"
                />
                <select
                  name="status"
                  defaultValue={
                    editData
                      ? editData.isActive
                        ? "Active"
                        : "Inactive"
                      : "Active"
                  }
                  required
                  className="w-full border p-2 rounded"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="px-4 py-2 border rounded hover:bg-gray-100"
                  >
                    ❌ Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    ✅ Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
