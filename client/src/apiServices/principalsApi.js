import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;
const access_token = getCookie("access_token");

export async function fetchPrincipals() {
  const res = await fetch(`${API_URL}/user/filter?role=principal`, {
    method: "GET",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch principals");
  }

  return res.json();
}

export async function createPrincipal(data) {
  const res = await fetch(`${API_URL}/user`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to create");
  }

  return result;
}

export async function updatePrincipal(id, data) {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();
  if (!res.ok) {
    throw new Error(result.message || "Failed to update");
  }

  return result;
}

export async function deletePrincipal(id) {
  const res = await fetch(`${API_URL}/user/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to delete");
  }

  return res.json();
}
