import { useEffect, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  fetchAllStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} from "../apiServices/studentsApi";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Students() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchStudents = async () => {
    try {
      const result = await fetchAllStudents();
      if (Array.isArray(result)) {
        setStudents(result);
      } else if (Array.isArray(result.data)) {
        setStudents(result.data);
      } else {
        console.error("Unexpected response:", result);
      }
    } catch (err) {
      console.error("Failed to fetch students:", err);
      toast.error("Failed to fetch students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openForm = (data = null) => {
    setEditData(data);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      await deleteStudent(id);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch (err) {
      toast.error("Failed to delete student");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      // className: form.className.value.trim(),
      // rollNo: Number(form.rollNo.value),
      isActive: form.status.value === "Active",
    };

    if (!payload.name || !payload.email  ) {
      toast.error("Please fill out all fields");
      return;
    }

    try {
      if (editData) {
        await updateStudent(editData.id, payload);
        toast.success("Student updated");
      } else {
        await addStudent(payload);
        toast.success("Student added");
      }
      setShowForm(false);
      setEditData(null);
      fetchStudents();
    } catch (err) {
      toast.error("Submission failed");
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

        {/* <button
          onClick={() => openForm()}
          className="ml-4 sm:px-2 lg:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          + Add Student
        </button> */}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-200 text-gray-900">
              <th className="p-2 border">#</th>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">Class</th>
              <th className="p-2 border">Roll No.</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s.id}>
                <td className="p-2 border">{i + 1}</td>
                <td className="p-2 border">{s.name}</td>
                <td className="p-2 border">{s.email}</td>
                <td className="p-2 border">{s.className || "-"}</td>
                <td className="p-2 border">{s.rollNo || "-"}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      s.isActive ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {s.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-2 border flex flex-row">
                  <button
                    onClick={() => openForm(s)}
                    className="text-blue-500 mr-3 flex items-center gap-1"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-500 flex items-center gap-1"
                  >
                    <FaTrash /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-3 text-gray-400 text-sm">
          Showing {filteredStudents.length} of {students.length}
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white text-black p-5 rounded w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">
              {editData ? "Edit Student" : "Add Student"}
            </h2>
            <form className="space-y-3" onSubmit={handleSubmit}>
              <input name="name" defaultValue={editData?.name || ""} placeholder="Full Name" className="w-full border p-2 rounded" />
              <input name="email" type="email" defaultValue={editData?.email || ""} placeholder="Email" className="w-full border p-2 rounded" />
              <input name="className" defaultValue={editData?.className || ""} placeholder="Class" className="w-full border p-2 rounded" />
              <input name="rollNo" type="number" defaultValue={editData?.rollNo || ""} placeholder="Roll Number" className="w-full border p-2 rounded" />
              <select name="status" defaultValue={editData?.isActive ? "Active" : "Inactive"} className="w-full border p-2 rounded">
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 border rounded">
                  ❌ Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
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
