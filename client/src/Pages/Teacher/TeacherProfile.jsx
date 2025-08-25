
import { useEffect, useState } from "react";
import ProfilePage from "../../Components/ProfilePage";

const API_URL = import.meta.env.VITE_API_URL;

export default function TeacherProfile() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });

        const data = await res.json();
        setUserData(data.profile);
      } catch (err) {
        console.error("❌ Failed to fetch teacher profile", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <p className="text-white p-6">🔄 Loading Profile...</p>;
  if (!userData) return <p className="text-white p-6">❌ Failed to load profile.</p>;

  return <ProfilePage user={userData} />;
}
