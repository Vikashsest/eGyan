import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const [data, setData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  function handledata(e) {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  }

  async function handlesubmit(e) {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        credentials:"include",
        headers: { "Content-Type": "application/json",
         },
        body: JSON.stringify(data),
      });

      const result = await res.json();
    
// document.cookie = `access_token=${result.access_token}; path=/; max-age=86400; sameSite=lax`

      if (res.ok) {
         localStorage.setItem("role", result.role); 
        toast.success("Login successful ✅");

        setData({ email: '', password: '' });

        setTimeout(() => {
          switch (result.role) {
            case "student":
              navigate("/student/dashboard");
              break;
            case "teacher":
              navigate("/teacher/dashboard");
              break;
            case "principal":
              navigate("/principal/dashboard");
              break;
            case "admin":
              navigate("/admin/dashboard");
              break;
            default:
              navigate("/login");
          }
        }, 1000); 
      } else {
        toast.error(result.message || "Login failed ❌");
      }
    } catch (error) {
      toast.error("Something went wrong ❗");
      console.error("Login error:", error);
    }
  }

  return (
    <main
      className="min-h-screen bg-cover bg-center text-white flex items-center justify-center px-6 relative overflow-hidden"
      style={{ backgroundImage: "url('/signup3.jpg')" }}
    >
      <div className="absolute inset-0 bg-black opacity-60 z-0"></div>

      <div className="w-full max-w-md z-10 bg-[#1c1d2a]/70 backdrop-blur-lg border border-white/10 shadow-2xl rounded-3xl p-10 space-y-8 transition-all duration-300">
        <h2 className="text-3xl font-bold text-center  text-blue-400 drop-shadow-md">
          Unlock Knowledge.<br />
          <span className='text-white'>Log In.</span>
        </h2>

        <form className="space-y-6" onSubmit={handlesubmit}>
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-3 text-white z-10" />
            <input
              onChange={handledata}
              name="email"
              type="email"
              placeholder="Email Address"
              value={data.email}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-3 text-white z-10" />
            <input
              onChange={handledata}
              name="password"
              type="password"
              placeholder="Password"
              value={data.password}
              required
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-white/10"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all duration-200 text-white font-semibold py-3 rounded-xl shadow-lg"
          >
            Log In
          </button>

          <p className="text-sm text-center text-gray-300">
            Start learning–Log In.?{' '}
            <Link to="/forgot-password" className="text-blue-400 hover:underline">
              Forgot Password
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}












