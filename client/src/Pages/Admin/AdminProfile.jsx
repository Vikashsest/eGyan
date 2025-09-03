
import { useEffect, useState } from "react";
import ProfilePage from "../../Components/ProfilePage";
import { getCookie } from "../../utils/cookie";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const access_token = getCookie("access_token");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
            credentials: "include",
            headers: {
            Authorization: `Bearer ${access_token}`
          }, 
        });

        const data = await res.json();
        setUserData(data.profile);
      } catch (err) {
        console.error("❌ Failed to fetch admin profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p className="text-white p-6">🔄 Loading Profile...</p>;
  // if (!userData) return <p className="text-white p-6">❌ Failed to load profile.</p>;

  return <ProfilePage user={userData} />;
}
