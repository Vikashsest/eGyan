import { useEffect, useState } from "react";
import ProfilePage from "../../Components/ProfilePage";

const API_URL = import.meta.env.VITE_API_URL;

export default function StudentProfile() {
  const [user, setUser] = useState(null);


  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        setUser(data.profile);
      } catch (err) {
        console.error("❌ Failed to fetch profile:", err);
      }
    }

    fetchProfile();
  }, []);

  if (!user) return <div className="text-white p-6">Loading profile...</div>;

  return <ProfilePage user={user} />;
}
