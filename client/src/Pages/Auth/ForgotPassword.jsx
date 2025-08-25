import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    dob: '',
    newPassword: '',
    confirmPassword: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    

    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`,
         {
        credentials:"include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          dob: String(formData.dob),
          newPassword: String(formData.newPassword),
          confirmPassword: String(formData.confirmPassword)
        }),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Password reset successful ✅");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(result.message || "Reset failed ❌");
      }
    } catch (err) {
      toast.error("Something went wrong ❗");
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-6 relative"
      style={{ backgroundImage: "url('/signup3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/60 z-0"></div>

      <form
        onSubmit={handleSubmit}
        className="z-10 w-full max-w-md p-10 bg-[#1c1d2a]/70 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl space-y-6 transition-all duration-300"
      >
        <h2 className="text-3xl font-bold text-center text-blue-400 drop-shadow-md">
          Reset Your Password
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
        />

        <input
          type="date"
          name="dob"
          placeholder="Date of Birth"
          value={formData.dob}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
        />

        <input
          type="password"
          name="newPassword"
          placeholder="New Password"
          value={formData.newPassword}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl bg-white/10 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/20"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all duration-200"
        >
          Reset Password
        </button>
      </form>
    </main>
  );
}


