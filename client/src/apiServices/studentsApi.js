import { getCookie } from "../utils/cookie";
const API_URL = import.meta.env.VITE_API_URL;

const access_token = getCookie("access_token");

function getHeaders() {
  return {
    "Content-Type": "application/json",
     Authorization: `Bearer ${access_token}`,
  };
}

export async function fetchAllStudents() {
  const response = await fetch(`${API_URL}/user/filter?role=student`, {
    credentials:"include",
    headers: getHeaders(),
  });
  return await response.json();
}

export async function addStudent(data) {
  return await fetch(`${API_URL}/students`, {
    method: "POST",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

export async function updateStudent(id, data) {
  return await fetch(`${API_URL}/user/${id}`, {
    method: "PATCH",
    credentials: "include",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
}

export async function deleteStudent(id) {
  return await fetch(`${API_URL}/students/${id}`, {
    method: "DELETE",
    credentials: "include",
    headers: getHeaders(),
  });
}
