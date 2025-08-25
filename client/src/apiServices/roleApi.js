import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

export async function fetchUsers() {
  const res = await fetch(`${API_URL}/user`, {
    method:'GET',
    credentials:'include',
    headers: {
    Authorization: `Bearer ${access_token}`
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }

  return res.json();
}

export async function updateUserRole(userId, role, isActive) {
  const res = await fetch(`${API_URL}/user/update-role/${userId}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`
    },
    body: JSON.stringify({ role, isActive }),
  });

  if (!res.ok) {
    throw new Error("Failed to update user role");
  }

  return res.json();
}

export async function deleteUser(userId) {
  const res = await fetch(`${API_URL}/user/${userId}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
    Authorization: `Bearer ${access_token}`
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete user");
  }

  return res.json();
}
