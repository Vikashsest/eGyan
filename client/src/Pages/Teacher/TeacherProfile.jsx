
import { useEffect, useState } from "react";
import ProfilePage from "../../Components/ProfilePage";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function TeacherProfile() {
  const [userData, setUserData] = useState(null);


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
        toast.error("❌ Failed to fetch teacher profile", err);
      } 
    }

    fetchProfile();
  }, []);

  return <ProfilePage user={userData} />;
}
