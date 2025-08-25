import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { fetchUsers, updateUserRole, deleteUser } from "../apiServices/roleApi";

export default function RoleManagement({ currentUserRole }) {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    fetchUsersList();
  }, []);

  const fetchUsersList = async () => {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  useEffect(() => {
    if (currentUserRole === "teacher") {
      setRoleFilter("student");
    } else if (currentUserRole === "principal") {
      setRoleFilter("teacher");
    }
  }, [currentUserRole]);

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    let hasPermission = true;
    if (currentUserRole === "principal") {
      hasPermission = u.role !== "principal";
    } else if (currentUserRole === "teacher") {
      hasPermission = u.role === "student";
    }

    return matchesSearch && matchesRole && hasPermission;
  });

  const handleEdit = (user) => setEditData(user);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updatedRole = form.role.value;
    const updatedStatus = form.status.value === "Active";

    try {
      await updateUserRole(editData.id, updatedRole, updatedStatus);
      setEditData(null);
      fetchUsersList();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await deleteUser(id);
      fetchUsersList();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-white mb-4">Manage Students</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 px-6 rounded-lg bg-[#2a2b39] text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-72 lg:w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="border p-2 rounded bg-white text-black"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="all">All Roles</option>

          {currentUserRole === "admin" && (
            <>
              <option value="principal">Principal</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </>
          )}

          {currentUserRole === "principal" && (
            <>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </>
          )}

          {currentUserRole === "teacher" && (
            <>
              <option value="student">Student</option>
            </>
          )}
        </select>
      </div>
      
      <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-200 text-gray-900 text-left">
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u, index) => (
            <tr key={u.id}>
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{u.name}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border capitalize">{u.role}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    u.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {u.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-2 border">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(u)}
                    disabled={
                      (currentUserRole === "teacher" && u.role !== "student") ||
                      (currentUserRole === "principal" && u.role === "principal")
                    }
                    className={`flex items-center gap-1 ${
                      (currentUserRole === "teacher" && u.role !== "student") ||
                      (currentUserRole === "principal" && u.role === "principal")
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-blue-500 hover:underline"
                    }`}
                  >
                    <FaEdit /> Change Role
                  </button>
                  <button
                    onClick={() => handleDelete(u.id)}
                    disabled={
                      (currentUserRole === "teacher" && u.role !== "student") ||
                      (currentUserRole === "principal" && u.role === "principal")
                    }
                    className={`flex items-center gap-1 ${
                      (currentUserRole === "teacher" && u.role !== "student") ||
                      (currentUserRole === "principal" && u.role === "principal")
                        ? "text-gray-500 cursor-not-allowed"
                        : "text-red-500 hover:underline"
                    }`}
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>

      <div className="mt-4 text-sm text-gray-400">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded max-w-md w-full text-black">
            <h2 className="text-xl font-semibold mb-4">Update Role</h2>
            <form className="space-y-4" onSubmit={handleUpdate}>
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  disabled
                  value={editData.name}
                  className="w-full border p-2 rounded bg-gray-100"
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Select Role</label>
                <select
                  name="role"
                  defaultValue={editData.role}
                  className="w-full border p-2 rounded"
                >
                  <option value="principal">Principal</option>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">Status</label>
                <select
                  name="status"
                  defaultValue={editData.isActive ? "Active" : "Inactive"}
                  className="w-full border p-2 rounded"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditData(null)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ✅ Update
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}







