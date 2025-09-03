import AdminNavbar from '../Pages/Admin/AdminNavbar'
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExpand, FaCompress, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { getCookie } from "../utils/cookie";

const API_URL = import.meta.env.VITE_API_URL;
const access_token = getCookie("access_token");

function ConcernList() {
  const [concerns, setConcerns] = useState([]);
  const [selectedConcern, setSelectedConcern] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchConcerns = async () => {
      try {
        const res = await fetch(`${API_URL}/admin/concerns`, {
        credentials:"include",
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setConcerns(data);
      } catch (error) {
        console.error("Failed to fetch concerns:", error);
      }
    };

    fetchConcerns();
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await modalRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${API_URL}/students/concern/${id}`, {
        method: "DELETE",
        credentials:"include",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete concern");

      setConcerns((prev) => prev.filter((c) => c._id !== id));
      toast.success("Concern deleted successfully!");
    } catch (error) {
      console.error("Error deleting concern:", error);
      toast.error("Failed to delete concern!");
    }
  };

  return (
    
    <div className="min-h-screen bg-[#1a1b23] p-6">
        
      <h1 className="text-2xl font-bold text-white mb-4">Students Concerns List</h1>

      <button
        onClick={() => navigate(-1)} 
        className="mb-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition duration-200"
      >
        ← Go to Dashboard
      </button>

      <div className="overflow-x-auto rounded-xl shadow-md bg-[#2a2b38]">
        <table className="min-w-full text-sm text-left text-white">
          <thead className="bg-[#383a4a] text-xs uppercase text-gray-300">
            <tr>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Subject</th>
              <th className="px-6 py-3">Priority</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {concerns.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center py-6 text-gray-300">
                  No concerns found.
                </td>
              </tr>
            ) : (
              concerns.map((item) => (
                <tr key={item._id} className="border-b border-gray-700 hover:bg-[#343545]">
                  <td className="px-6 py-4">{item.student?.name}</td>
                  <td className="px-6 py-4">{item.subject}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.priority === "High"
                          ? "bg-red-600/30 text-red-400"
                          : item.priority === "Medium"
                          ? "bg-yellow-600/30 text-yellow-300"
                          : "bg-green-600/30 text-green-300"
                      }`}
                    >
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`text-sm font-medium ${
                        item.status === "Resolved"
                          ? "text-green-400"
                          : "text-yellow-300"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-6 py-4 text-center flex justify-center items-center gap-4">
                    <button
                      onClick={() => setSelectedConcern(item)}
                      className="text-blue-400 hover:underline font-medium"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      title="Delete Concern"
                      className="text-red-400 hover:text-red-600 text-base"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {selectedConcern && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
          <div
            ref={modalRef}
            className="relative bg-[#2a2b38] rounded-xl shadow-xl max-w-3xl w-full pb-4 pt-10 px-4"
          >
            <div className="absolute top-0 right-3 flex gap-3 z-50">
              <button
                onClick={toggleFullscreen}
                className="text-white hover:text-blue-400 text-xl"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={() => {
                  setSelectedConcern(null);
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                    setIsFullscreen(false);
                  }
                }}
                className="text-white hover:text-red-400 relative bottom-1 text-4xl"
              >
                &times;
              </button>
            </div>

            <img
              src={selectedConcern.image}
              alt="Concern Proof"
              className="w-full max-h-[80vh] object-contain rounded-lg border border-gray-600"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ConcernList;

