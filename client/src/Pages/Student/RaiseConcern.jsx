import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";
import { useState, useEffect } from "react";
import { FaExclamationCircle } from "react-icons/fa";
import { getCookie } from "../../utils/cookie";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

export default function RaiseConcernPage() {
  const [formData, setFormData] = useState({
    subject: "",
    issueType : "",
    priority: "",
    message: "",
    file: null,
  });

  const [concerns, setConcerns] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/students/previous-concerns`, {
      credentials: "include",
      headers: {
            Authorization: `Bearer ${access_token}`,
          },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch concerns");
        return res.json();
      })
      .then((data) => setConcerns(data))
      .catch((err) => {
        console.error(err);
        toast.error("Failed to load previous concerns.");
      });
  }, []);

  // Handle form input
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const concernFormData = new FormData();
    concernFormData.append("subject", formData.subject);
    concernFormData.append("issueType", formData.issueType);
    concernFormData.append("priority", formData.priority);
    concernFormData.append("message", formData.message);
    if (formData.file) {
      concernFormData.append("file", formData.file);
    }

    try {
      const res = await fetch(`${API_URL}/students/concerns`, {
        method: "POST",
        credentials: "include",
        body:concernFormData,
        headers: {
            Authorization: `Bearer ${access_token}`,
          },
      });

      if (!res.ok) throw new Error("Failed to submit concern");

      const newConcern = await res.json(); 
      setConcerns((prev) => [newConcern, ...prev]);
      toast.success("Concern submitted successfully!");

      // Reset form
      setFormData({
        subject: "",
        issueType: "",
        priority: "",
        message: "",
        file: null,
      });
    } catch (error) {
      console.error(error);
      toast.error("Submission failed. Please try again.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#1e1f2b] text-white">
      <StudentSidebar />
      <main className="pl-[280px] py-6 pr-5 w-full">
        <StudentNavbar />
        <div className="p-4 max-w-3xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <FaExclamationCircle className="text-red-500" />
              Raise a Concern
            </h1>
            <p className="text-white/70 text-sm mt-1">
              If you're facing issues with content or system access, report it below.
            </p>
          </div>

          {/* Concern Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-[#2a2b39] p-6 rounded-xl shadow space-y-4"
          >
            <div>
              <label className="block mb-1 text-white/70">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. History video not playing"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-[#1e1f2b] border border-gray-600 text-white focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-1 text-white/70">Issue Type</label>
              <select
                name="issueType"
                value={formData.issueType}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-[#1e1f2b] border border-gray-600 text-white"
              >
                <option value="">Select Type</option>
                <option value="content">Content Issue</option>
                <option value="access">Access Problem</option>
                <option value="performance">Performance Issue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-white/70">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                required
                className="w-full p-2 rounded bg-[#1e1f2b] border border-gray-600 text-white"
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-white/70">Message</label>
              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe the issue you're facing..."
                required
                className="w-full p-2 rounded bg-[#1e1f2b] border border-gray-600 text-white resize-none"
              ></textarea>
            </div>

            <div>
              <label className="block mb-1 text-white/70">
                Attach Screenshot (optional)
              </label>
              <input
                type="file"
                name="file"
                onChange={handleChange}
                accept="image/*,application/pdf"
                className="w-full p-2 rounded bg-[#1e1f2b] border border-gray-600 text-white"
              />
            </div>

            <div className="text-right">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-sm font-medium transition"
              >
                Submit Concern
              </button>
            </div>
          </form>

          {/* Concern History */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">My Previous Concerns</h2>
            <div className="bg-[#2a2b39] p-4 rounded-lg shadow">
              {concerns.length === 0 ? (
                <p className="text-white/60">No concerns raised yet.</p>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {concerns.map((c, idx) => (
                    <li key={idx} className="py-3 flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{c.subject}</h4>
                        <p className="text-xs text-white/50">
                          {c.type} • Priority: {c.priority} •{" "}
                          {new Date(c.date).toLocaleDateString()}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          c.status === "Resolved"
                            ? "bg-green-600 text-white"
                            : "bg-yellow-500 text-black"
                        }`}
                      >
                        {c.status}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
