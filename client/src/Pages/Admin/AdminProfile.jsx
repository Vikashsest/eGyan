
import { useEffect, useState } from "react";
import ProfilePage from "../../Components/ProfilePage";
import { getCookie } from "../../utils/cookie";
import { toast } from "react-toastify";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminProfile() {
  const [userData, setUserData] = useState(null);

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
        toast.error("❌ Failed to fetch admin profile", err)
      }
    }

    fetchProfile();
  }, []);

  return <ProfilePage user={userData} />;
}
