import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { teacherApi } from "../apiServices/teacherApi";
import "react-toastify/dist/ReactToastify.css";

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState(null);

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const data = await teacherApi.fetchAll();
      if (Array.isArray(data)) {
        setTeachers(data);
      } else if (Array.isArray(data.teachers)) {
        setTeachers(data.teachers);
      } else {
        toast.error("Failed to load teachers");
        setTeachers([]);
      }
    } catch (err) {
      console.error(err);
      toast.error("Error fetching teachers");
      setTeachers([]);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this teacher?")) {
      try {
        const res = await teacherApi.deleteTeacher(id);
        if (res.ok) {
          toast.success("Teacher deleted");
          fetchTeachers();
        } else {
          toast.error("Failed to delete");
        }
      } catch (err) {
        toast.error("Error deleting teacher");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      subject: form.subject.value.trim(),
      role: "teacher",
      isActive: form.status.value === "Active",
    };

    try {
      const res = editTeacher
        ? await teacherApi.updateTeacher(editTeacher.id, payload)
        : await teacherApi.saveTeacher(payload);

      if (res.ok) {
        toast.success(editTeacher ? "Teacher updated" : "Teacher added");
        fetchTeachers();
        setFormOpen(false);
        setEditTeacher(null);
      } else {
        toast.error("Failed to save teacher");
      }
    } catch (err) {
      toast.error("Error saving teacher");
    }
  };

  const filtered = teachers.filter(
    (t) =>
      t.name?.toLowerCase().includes(search.toLowerCase()) ||
      t.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold text-white mb-4">Manage Teachers</h2>

      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search by name or email"
          className="p-2 px-6 rounded-lg bg-[#2a2b39] text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 sm:w-72 lg:w-96"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {/* <button
          className="bg-blue-600 sm:px-2 lg:px-4 py-2 rounded-lg"
          onClick={() => {
            setFormOpen(true);
            setEditTeacher(null);
          }}
        >
          + Add Teacher
        </button> */}
      </div>
      
      <div className="overflow-x-auto">
      <table className="w-full border text-sm">
        <thead className="bg-gray-300 text-black">
          <tr>
            <th className="p-2 border">#</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Subject</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((t, i) => (
            <tr key={t._id}>
              <td className="p-2 border">{i + 1}</td>
              <td className="p-2 border">{t.name}</td>
              <td className="p-2 border">{t.email}</td>
              <td className="p-2 border">{t.subject}</td>
              <td className="p-2 border">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    t.isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {t.isActive ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="p-2 border flex flex-row">
                <button
                  onClick={() => {
                    setFormOpen(true);
                    setEditTeacher(t);
                  }}
                  className="text-blue-500 mr-2 flex items-center gap-1 "
                >
                  <FaEdit /> Edit
                </button>
                <button
                  onClick={() => handleDelete(t._id)}
                  className="text-red-500 flex items-center gap-1"
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      
      {/* Modal */}
      {formOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-lg text-black">
            <h3 className="text-xl font-semibold mb-4">
              {editTeacher ? "Edit Teacher" : "Add Teacher"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                name="name"
                defaultValue={editTeacher?.name || ""}
                placeholder="Name"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="email"
                type="email"
                defaultValue={editTeacher?.email || ""}
                placeholder="Email"
                className="w-full p-2 border rounded"
                required
              />
              <input
                name="subject"
                defaultValue={editTeacher?.subject || ""}
                placeholder="Subject"
                className="w-full p-2 border rounded"
              />
              <select
                name="status"
                defaultValue={editTeacher?.isActive ? "Active" : "Inactive"}
                className="w-full p-2 border rounded"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 bg-gray-200"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  ✅ Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
