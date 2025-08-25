import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaUserShield,
  FaPhoneAlt,
  FaEdit,
} from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa6";
import Logout from "../Pages/Auth/Logout";

export default function ProfilePage({ user }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDashboardRedirect = () => {
    if (!user) return;

    const role = user.role?.toLowerCase().trim();

    switch (role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "principal":
        navigate("/principal/dashboard");
        break;
      case "teacher":
        navigate("/teacher/dashboard");
        break;
      case "student":
        navigate("/student/dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-[#1e1f2b] text-white p-6">
      <div className="max-w-3xl mx-auto bg-[#2a2b39] rounded-xl shadow-md p-8">
        {/* Profile Info */}
        <div className="flex flex-col items-center text-center">
          <img
            src="/user.png"
            alt={formData.name}
            width={100}
            height={100}
            className="rounded-full border-4 border-blue-500"
          />
          <h2 className="text-2xl font-bold mt-4">{formData.name}</h2>
          <p className="text-gray-400 text-sm">
            {formData.role} | School Library System
          </p>
        </div>

        {/* Details */}
        <div className="mt-8 space-y-4 text-sm">
          <ProfileRow icon={<FaEnvelope />} label="Email" value={formData.email} />
          <ProfileRow icon={<FaPhoneAlt />} label="Phone" value={formData.phone} />
          <ProfileRow icon={<FaUserShield />} label="Role" value={formData.role} />
        </div>

        {/* Buttons */}
        <div className="mt-10 flex justify-center gap-6 flex-wrap">
          <button
            onClick={handleDashboardRedirect}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            <FaArrowLeft /> Go to Dashboard
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
          >
            <FaEdit /> Edit Profile
          </button>

          <div>
            <Logout />
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md text-black">
            <h3 className="text-lg font-semibold mb-4">✏️ Edit Profile</h3>
            <form className="space-y-4">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Full Name"
                className="w-full border p-2 rounded"
              />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="Email"
                className="w-full border p-2 rounded"
              />
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="Phone Number"
                className="w-full border p-2 rounded"
              />
              <div className="flex justify-end gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-200"
                >
                  ❌ Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  ✅ Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-4 border-b border-gray-700 pb-2">
      <div className="text-blue-400 text-lg">{icon}</div>
      <div>
        <p className="text-gray-400">{label}</p>
        <p className="text-white font-medium">{value}</p>
      </div>
    </div>
  );
}



